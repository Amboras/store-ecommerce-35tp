import { medusaServerClient } from '@/lib/medusa-client'
import BundleCrossSellUI from './bundle-cross-sell-ui'

const BONUS_PRODUCT_HANDLE = 'tshirt'
const BONUS_DISCOUNT_PERCENT = 50
const FREE_SHIPPING_THRESHOLD = 7500 // Show "Free Shipping" badge if bundle subtotal ≥ $75 (in cents)

type Variant = {
  id: string
  title?: string
  calculated_price?: {
    calculated_amount?: number | null
    currency_code?: string | null
  } | null
  prices?: { amount: number; currency_code: string }[]
}

type Product = {
  id: string
  title: string
  handle: string
  thumbnail?: string | null
  images?: { url: string }[] | null
  variants?: Variant[]
}

async function getBonusProduct(): Promise<Product | null> {
  try {
    const regions = await medusaServerClient.store.region.list()
    const regionId = regions.regions[0]?.id
    if (!regionId) return null

    const response = await medusaServerClient.store.product.list({
      handle: BONUS_PRODUCT_HANDLE,
      region_id: regionId,
      fields: '*variants.calculated_price',
    })
    return (response.products?.[0] as Product) || null
  } catch {
    return null
  }
}

function pickVariantPrice(variant: Variant | undefined): { amount: number; currency: string } | null {
  if (!variant) return null
  const calc = variant.calculated_price
  if (calc?.calculated_amount != null && calc.currency_code) {
    return { amount: calc.calculated_amount, currency: calc.currency_code }
  }
  const fallback = variant.prices?.[0]
  if (fallback) return { amount: fallback.amount, currency: fallback.currency_code }
  return null
}

export default async function BundleCrossSell({ mainProduct }: { mainProduct: Product }) {
  // Don't show on the bonus product's own page
  if (mainProduct.handle === BONUS_PRODUCT_HANDLE) return null

  const bonusProduct = await getBonusProduct()
  if (!bonusProduct) return null

  const mainVariant = mainProduct.variants?.[0]
  const bonusVariant = bonusProduct.variants?.[0]
  if (!mainVariant || !bonusVariant) return null

  const mainPrice = pickVariantPrice(mainVariant)
  const bonusPrice = pickVariantPrice(bonusVariant)
  if (!mainPrice || !bonusPrice) return null

  // If currencies differ we can't sum cleanly — bail out gracefully
  if (mainPrice.currency !== bonusPrice.currency) return null

  const mainSubtotal = mainPrice.amount * 2
  const bonusFull = bonusPrice.amount
  const bonusDiscounted = Math.round(bonusFull * (1 - BONUS_DISCOUNT_PERCENT / 100))
  const bundleTotal = mainSubtotal + bonusDiscounted
  const bundleFull = mainSubtotal + bonusFull
  const savings = bundleFull - bundleTotal
  const freeShipping = bundleTotal >= FREE_SHIPPING_THRESHOLD

  const mainImage =
    mainProduct.thumbnail ||
    mainProduct.images?.[0]?.url ||
    null
  const bonusImage =
    bonusProduct.thumbnail ||
    bonusProduct.images?.[0]?.url ||
    null

  return (
    <BundleCrossSellUI
      currency={mainPrice.currency}
      main={{
        id: mainProduct.id,
        title: mainProduct.title,
        image: mainImage,
        variantId: mainVariant.id,
        unitPrice: mainPrice.amount,
      }}
      bonus={{
        id: bonusProduct.id,
        title: bonusProduct.title,
        image: bonusImage,
        variantId: bonusVariant.id,
        fullPrice: bonusFull,
        discountedPrice: bonusDiscounted,
      }}
      pricing={{
        mainSubtotal,
        bundleTotal,
        bundleFull,
        savings,
        discountPercent: BONUS_DISCOUNT_PERCENT,
        freeShipping,
      }}
    />
  )
}
