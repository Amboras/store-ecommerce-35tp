'use client'

import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { init, createElement } from '@airwallex/components-sdk'
import type { AirwallexConfig } from '@amboras-dev/airwallex'
import { toAirwallexSdkEnv } from '@amboras-dev/airwallex'
import type { PaymentProviderConfig, PaymentProviderComponentProps } from './types'

// ── Config hook (inline — no separate hook file) ──────────────────────
function useAirwallexConnectConfig(): { data: AirwallexConfig | null; isLoading: boolean } {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? 'http://localhost:9000'
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ''
  const storeId = process.env.NEXT_PUBLIC_STORE_ID ?? ''

  const { data, isLoading } = useQuery<AirwallexConfig | null>({
    queryKey: ['airwallex-connect-config', storeId],
    queryFn: async () => {
      const headers: Record<string, string> = { 'x-publishable-api-key': publishableKey }
      if (storeId) headers['X-Store-Environment-ID'] = storeId
      const res = await fetch(`${backendUrl}/store/airwallex-connect`, { headers })
      if (!res.ok) return null
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  return { data: data ?? null, isLoading }
}

// ── Adapter component ─────────────────────────────────────────────────
function AirwallexAdapter({
  cart,
  sessionData,
  isCompleting,
  onApproved,
  onError,
}: PaymentProviderComponentProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [isElementReady, setIsElementReady] = useState(false)
  const { data: config, isLoading: isConfigLoading } = useAirwallexConnectConfig()

  const cartAny = cart as any
  const intentId = sessionData?.intent_id as string | undefined
  const clientSecret = sessionData?.client_secret as string | undefined
  const currency = (
    (sessionData?.currency_code as string | undefined) ??
    (cartAny?.currency_code as string | undefined) ??
    'usd'
  ).toUpperCase()

  // The Drop-in renders its OWN Pay button, which bypasses the storefront's
  // place-order bar (and its contact-email guard). So we gate the Drop-in here:
  // without a contact email on the cart, we never mount it — otherwise the
  // buyer could pay and we'd complete an order with no email.
  const hasContactEmail = Boolean((cartAny?.email as string | undefined)?.trim())

  // The parent re-creates onApproved/onError on every render (completeCheckout
  // is not memoized). Hold them in refs so the Drop-in listeners always call
  // the latest version WITHOUT making them effect dependencies — otherwise the
  // effect re-runs every render and tears down the element mid-payment, losing
  // the onSuccess that completes the cart (buyer charged, no order created).
  const onApprovedRef = useRef(onApproved)
  const onErrorRef = useRef(onError)
  useEffect(() => {
    onApprovedRef.current = onApproved
    onErrorRef.current = onError
  }, [onApproved, onError])

  const isReady = Boolean(config?.payment_ready)
  const environment = config?.environment

  useEffect(() => {
    if (!hasContactEmail || !isReady || !environment || !intentId || !clientSecret) return
    const mountEl = mountRef.current
    if (!mountEl) return

    let cancelled = false
    let element: any = null

    // The dropIn element emits its lifecycle events as window-level
    // CustomEvents — 'onReady' / 'onSuccess' / 'onError' — NOT through
    // element.on() (that API exists in the types but does not deliver events
    // for the payment dropIn at runtime). Each event's `detail` is the
    // Airwallex ElementEvent. If we don't listen here, onSuccess never fires
    // and the cart is never completed — the buyer is charged with no order.
    const handleReady = () => setIsElementReady(true)
    const handleSuccess = () => {
      // The buyer confirmed the intent inside the Drop-in. Complete the cart.
      void onApprovedRef.current()
    }
    const handleError = (event: any) => {
      const message =
        event?.detail?.detail?.error?.message ||
        event?.detail?.error?.message ||
        'Payment failed. Please try again.'
      onErrorRef.current(message)
    }
    window.addEventListener('onReady', handleReady)
    window.addEventListener('onSuccess', handleSuccess)
    window.addEventListener('onError', handleError)

    ;(async () => {
      try {
        await init({
          env: toAirwallexSdkEnv(environment),
          enabledElements: ['payments'],
        })
        element = await createElement('dropIn', {
          intent_id: intentId,
          client_secret: clientSecret,
          currency,
        })
        if (cancelled || !mountRef.current) return
        element.mount(mountRef.current)
      } catch {
        onErrorRef.current('Could not load Airwallex checkout. Please refresh and try again.')
      }
    })()

    return () => {
      cancelled = true
      window.removeEventListener('onReady', handleReady)
      window.removeEventListener('onSuccess', handleSuccess)
      window.removeEventListener('onError', handleError)
      try {
        element?.unmount?.()
      } catch {
        // element may already be torn down — ignore.
      }
    }
    // Stable deps only — the Drop-in mounts once per intent and stays mounted.
    // hasContactEmail is included so the Drop-in mounts as soon as the buyer
    // fills in their email (and not before).
  }, [hasContactEmail, isReady, environment, intentId, clientSecret, currency])

  if (isConfigLoading) {
    return (
      <div className="border rounded-sm p-6 flex items-center justify-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading Airwallex…</span>
      </div>
    )
  }

  if (!config?.payment_ready) return null

  if (!intentId || !clientSecret) {
    return (
      <div className="border rounded-sm p-6 flex items-center justify-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Preparing payment…</span>
      </div>
    )
  }

  // Block payment until the buyer has entered a contact email. The Drop-in's
  // own Pay button would otherwise let them pay with no email on the order.
  if (!hasContactEmail) {
    return (
      <div className="border rounded-sm p-6 flex items-center justify-center text-center">
        <span className="text-sm text-muted-foreground">
          Enter your email address above to continue to payment.
        </span>
      </div>
    )
  }

  return (
    <div className="border rounded-sm p-6 space-y-4">
      {(!isElementReady || isCompleting) && (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {isCompleting ? 'Completing order…' : 'Loading payment methods…'}
          </span>
        </div>
      )}
      {/* Airwallex Drop-in mounts here — card, Apple Pay, Google Pay, and local methods. */}
      <div ref={mountRef} />
    </div>
  )
}

// ── Registry export ───────────────────────────────────────────────────
export const airwallexProvider: PaymentProviderConfig = {
  id: 'pp_airwallex_airwallex',
  label: 'Airwallex',
  kind: 'form',
  matches: (id) => id.startsWith('pp_airwallex_'),
  Component: AirwallexAdapter,
}
