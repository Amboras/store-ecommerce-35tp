'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Check, Loader2, Truck } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/hooks/use-cart'

type Props = {
  currency: string
  main: {
    id: string
    title: string
    image: string | null
    variantId: string
    unitPrice: number
  }
  bonus: {
    id: string
    title: string
    image: string | null
    variantId: string
    fullPrice: number
    discountedPrice: number
  }
  pricing: {
    mainSubtotal: number
    bundleTotal: number
    bundleFull: number
    savings: number
    discountPercent: number
    freeShipping: boolean
  }
}

function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  } catch {
    return `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`
  }
}

export default function BundleCrossSellUI({ currency, main, bonus, pricing }: Props) {
  const [selected, setSelected] = useState<'buy2' | 'bundle'>('bundle')
  const [adding, setAdding] = useState(false)
  const { addItemAsync } = useCart()

  async function handleAdd() {
    setAdding(true)
    try {
      // Always add 2x main
      await addItemAsync({ variantId: main.variantId, quantity: 2 })
      // Add bonus only if bundle selected
      if (selected === 'bundle') {
        await addItemAsync({ variantId: bonus.variantId, quantity: 1 })
        toast.success('Bundle added — your discount applies at checkout', {
          description: `${pricing.discountPercent}% off ${bonus.title}`,
        })
      } else {
        toast.success('Added 2 to your cart')
      }
    } catch (err) {
      console.error(err)
      toast.error('Could not add to cart. Please try again.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <section className="mt-12 lg:mt-16">
      {/* Eyebrow header with hairlines */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-border" />
        <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground">
          Complete Your Routine
        </h3>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="rounded-2xl border bg-card shadow-premium p-5 sm:p-7 space-y-5">
        {/* Option: Buy 2 only */}
        <OptionRow
          selected={selected === 'buy2'}
          onClick={() => setSelected('buy2')}
          title="Buy 2 Only"
          subtitle="Standard price"
          rightTop={formatPrice(pricing.mainSubtotal, currency)}
        />

        {/* Option: Bundle (highlighted) */}
        <OptionRow
          selected={selected === 'bundle'}
          onClick={() => setSelected('bundle')}
          title="Buy 2 + Bonus Item"
          subtitle={`Add ${bonus.title} at ${pricing.discountPercent}% off`}
          rightTop={formatPrice(pricing.bundleTotal, currency)}
          rightBottom={
            pricing.bundleFull > pricing.bundleTotal
              ? formatPrice(pricing.bundleFull, currency)
              : undefined
          }
          badge={pricing.freeShipping ? 'FREE SHIPPING' : undefined}
        />

        {/* Visualizer */}
        <div className="rounded-xl bg-muted/40 px-4 py-6 sm:py-8">
          <div className="flex items-center justify-center gap-4">
            {/* Main x2 */}
            <div className="flex gap-2">
              <BundleThumb image={main.image} alt={main.title} />
              <BundleThumb image={main.image} alt={main.title} />
            </div>
            <Plus className="h-5 w-5 text-muted-foreground shrink-0" strokeWidth={2.5} />
            {/* Bonus with discount badge */}
            <div className="relative">
              <BundleThumb
                image={bonus.image}
                alt={bonus.title}
                muted={selected === 'buy2'}
                ringed={selected === 'bundle'}
              />
              {selected === 'bundle' && (
                <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-md bg-foreground text-background text-[10px] font-bold tracking-wide shadow-sm">
                  {pricing.discountPercent}%
                </span>
              )}
            </div>
          </div>
          <div className="text-center mt-4 space-y-1">
            <p className="text-sm font-semibold text-foreground">
              2x {main.title} + {bonus.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {selected === 'bundle'
                ? `${bonus.title} added at ${pricing.discountPercent}% off`
                : 'Standard pricing — no bonus'}
            </p>
          </div>
        </div>

        {/* Savings line */}
        {selected === 'bundle' && pricing.savings > 0 && (
          <div className="rounded-lg bg-lime-50 dark:bg-lime-700/10 px-4 py-3 text-center">
            <p className="text-sm font-semibold text-foreground">
              You save{' '}
              <span className="text-lime-700 dark:text-lime-400">
                {formatPrice(pricing.savings, currency)}
              </span>{' '}
              on the {bonus.title.toLowerCase()}
              {pricing.freeShipping && (
                <span className="text-muted-foreground font-normal"> · plus free shipping</span>
              )}
            </p>
          </div>
        )}

        {/* CTA */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={adding}
          className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background py-4 text-sm font-medium tracking-wide uppercase hover:bg-foreground/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-premium hover:shadow-lime-glow"
        >
          {adding ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Adding…
            </>
          ) : (
            <>
              Add {selected === 'bundle' ? 'bundle' : '2'} to cart
              {pricing.freeShipping && selected === 'bundle' && (
                <Truck className="h-4 w-4 ml-1 opacity-80" strokeWidth={1.75} />
              )}
            </>
          )}
        </button>
      </div>
    </section>
  )
}

function OptionRow({
  selected,
  onClick,
  title,
  subtitle,
  rightTop,
  rightBottom,
  badge,
}: {
  selected: boolean
  onClick: () => void
  title: string
  subtitle: string
  rightTop: string
  rightBottom?: string
  badge?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        'w-full text-left rounded-xl px-4 sm:px-5 py-4 transition-all flex items-center gap-4',
        selected
          ? 'border-2 border-foreground bg-card shadow-sm'
          : 'border-2 border-transparent bg-muted/40 hover:bg-muted/60',
      ].join(' ')}
    >
      {/* Radio */}
      <span
        className={[
          'shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors',
          selected ? 'border-foreground' : 'border-muted-foreground/40',
        ].join(' ')}
      >
        {selected && <Check className="h-3 w-3 text-foreground" strokeWidth={3} />}
      </span>

      {/* Title + subtitle */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base sm:text-lg font-semibold text-foreground">{title}</span>
          {badge && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-foreground text-background text-[10px] font-bold tracking-wider">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      </div>

      {/* Price */}
      <div className="text-right shrink-0">
        <div className="text-lg sm:text-xl font-bold text-foreground tabular-nums">{rightTop}</div>
        {rightBottom && (
          <div className="text-xs text-muted-foreground line-through tabular-nums">
            {rightBottom}
          </div>
        )}
      </div>
    </button>
  )
}

function BundleThumb({
  image,
  alt,
  muted = false,
  ringed = false,
}: {
  image: string | null
  alt: string
  muted?: boolean
  ringed?: boolean
}) {
  return (
    <div
      className={[
        'relative h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-card border overflow-hidden',
        ringed ? 'ring-2 ring-foreground' : '',
        muted ? 'opacity-50' : '',
      ].join(' ')}
    >
      {image ? (
        <Image src={image} alt={alt} fill sizes="64px" className="object-cover" />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-muted to-muted-foreground/10" />
      )}
    </div>
  )
}
