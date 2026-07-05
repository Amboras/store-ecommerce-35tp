import type { ReactElement } from 'react'

import type { Cart } from '@/types'

export type PaymentProviderSessionData = Record<string, unknown>

export interface PaymentProviderComponentProps {
  cart: Cart | null | undefined
  sessionData?: PaymentProviderSessionData | null
  isCompleting?: boolean
  onApproved: () => void | Promise<void>
  onError: (message: string) => void
}

export interface PaymentProviderConfig {
  id: string
  label: string
  kind: 'form' | 'redirect'
  matches: (id: string) => boolean
  Component: (props: PaymentProviderComponentProps) => ReactElement | null
}
