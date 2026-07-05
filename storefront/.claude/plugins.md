## Installed Plugins

### product reviews
npm: @amboras-dev/reviews

star ratings and customer reviews for your product

**Components (written to your workspace — edit freely):**

> BEFORE rendering any of these components, open the file with the Read tool and read the exported TypeScript `Props` interface. Required props MUST be passed or the build will fail with a type error at runtime.

`StarRating` — Reusable star rating display (read-only or interactive)
  Destination:    `components/plugins/reviews/StarRating.tsx`
  Required props: rating: number
  Optional props: size: sm | md | lg, onRate: (rating: number) => void, interactive: boolean
  Usage:          `<StarRating rating={4.5} />`

`ReviewsWidget` — Product page reviews section — shows approved reviews with stats, pagination, media, and merchant replies
  Destination:    `components/plugins/reviews/ReviewsWidget.tsx`
  Required props: productId: string

  Usage:          `<ReviewsWidget productId={product.id} />`

`OrderReviewForm` — Order detail page review section — shows review status per item with write/edit forms and discount code reward
  Destination:    `components/plugins/reviews/OrderReviewForm.tsx`
  Required props: items: Array<{ id, product_id, product_title, variant_title?, thumbnail? }>, orderId: string
  Optional props: orderFulfillmentStatus: string
  Usage:          `<OrderReviewForm orderId={order.id} items={order.items} orderFulfillmentStatus={order.fulfillment_status} />`

**Hooks (from npm package — import, do not copy):**

`useProductReviews` — `useProductReviews(productId: string, options?: { page?, perPage? })`
  Returns: { data: { reviews, stats, count }, isLoading, error }
  Import:  `import { useProductReviews } from '@amboras-dev/reviews'`

`useMyReviews` — `useMyReviews(options?: { orderIds?: string[] })`
  Returns: { data: { reviews: MyReview[] }, isLoading }
  Import:  `import { useMyReviews } from '@amboras-dev/reviews'`

`useCreateReview` — `useCreateReview()`
  Returns: { mutateAsync, isPending } — input: { product_id, order_id, rating, title?, content?, media? }
  Import:  `import { useCreateReview } from '@amboras-dev/reviews'`

`useUpdateReview` — `useUpdateReview()`
  Returns: { mutateAsync, isPending } — input: { reviewId, rating?, title?, content?, media? }
  Import:  `import { useUpdateReview } from '@amboras-dev/reviews'`

**API endpoints:**
  GET  /store/products/:id/reviews — public approved reviews + stats
  GET  /store/reviews/me — customer own reviews (filter by order_ids)
  POST /store/reviews — submit review (verified purchase + discount code)
  PUT  /store/reviews/:id — edit own review (re-moderation)
  GET    /admin/reviews — list all reviews (filter by status, product_id)  ← admin auth required
  GET    /admin/reviews/:id — single review detail  ← admin auth required
  POST   /admin/reviews/:id/status — approve/reject with reply  ← admin auth required
  DELETE /admin/reviews/:id — soft delete  ← admin auth required
  GET    /admin/review-settings — get review configuration  ← admin auth required
  POST   /admin/review-settings — update review configuration  ← admin auth required

<!-- AMBORAS:PLUGIN:airwallex:START -->
### Airwallex
npm: @amboras-dev/airwallex

Accept cards, Apple Pay, Google Pay, and local payment methods in multiple currencies via Airwallex.

**Components (written to your workspace — edit freely):**

> BEFORE rendering any of these components, open the file with the Read tool and read the exported TypeScript `Props` interface. Required props MUST be passed or the build will fail with a type error at runtime.

`undefined` —
  Destination:    `undefined`
  Required props: (none)



**Files this plugin writes to your workspace:**

> The `ownership` tag tells you whether your edits survive a re-sync.
> `merchant` = your edits are preserved on sync / upgrade / publish-swap; the file is yours to brand.
> `orchestrator` = re-emitted on every install; **do not edit** — the file marshals a wire-protocol or SDK contract, and the fix belongs in the plugin package, not the template.

`lib/payment-providers/airwallex.tsx` — **orchestrator** (managed by Amboras — do not edit)
`public/.well-known/apple-developer-merchantid-domain-association` — **orchestrator** (managed by Amboras — do not edit)

**API endpoints:**
  GET /store/airwallex-connect — public Airwallex config (environment, payment_ready)

<!-- AMBORAS:PLUGIN:airwallex:END -->

<!-- AMBORAS:PLUGIN:klaviyo:START -->
### Klaviyo
npm: @amboras-dev/klaviyo

Email and SMS marketing for ecommerce — flows, segments, and predictive analytics powered by your store data.

**Components (written to your workspace — edit freely):**

> BEFORE rendering any of these components, open the file with the Read tool and read the exported TypeScript `Props` interface. Required props MUST be passed or the build will fail with a type error at runtime.

`undefined` —
  Destination:    `undefined`
  Required props: (none)



`undefined` —
  Destination:    `undefined`
  Required props: (none)



`undefined` —
  Destination:    `undefined`
  Required props: (none)



`undefined` —
  Destination:    `undefined`
  Required props: (none)



**Files this plugin writes to your workspace:**

> The `ownership` tag tells you whether your edits survive a re-sync.
> `merchant` = your edits are preserved on sync / upgrade / publish-swap; the file is yours to brand.
> `orchestrator` = re-emitted on every install; **do not edit** — the file marshals a wire-protocol or SDK contract, and the fix belongs in the plugin package, not the template.

`components/plugins/klaviyo/SmsConsentCheckbox.jsx` — **orchestrator** (managed by Amboras — do not edit)
`components/plugins/klaviyo/SmsPreferencesNavCard.jsx` — **orchestrator** (managed by Amboras — do not edit)
`app/account/notifications/page.jsx` — **orchestrator** (managed by Amboras — do not edit)

**Hooks (from npm package — import, do not copy):**

`useKlaviyoIdentifyEffect` — `useKlaviyoIdentifyEffect(email, extra?)`
  Returns: void — fires klaviyo.identify on email transitions, deduped
  Import:  `import { useKlaviyoIdentifyEffect } from '@amboras-dev/klaviyo'`

`useKlaviyoTrack` — `useKlaviyoTrack(): (metric, properties?) => void`
  Returns: Stable callback for custom events
  Import:  `import { useKlaviyoTrack } from '@amboras-dev/klaviyo'`

`useKlaviyoSmsStatus` — `useKlaviyoSmsStatus(opts?): UseQueryResult<SmsStatusData>`
  Returns: { smsActive, senderConfigured, disclosureText, smsListId, publicKey, storeName } — NEW in 0.5.0: publicKey + storeName
  Import:  `import { useKlaviyoSmsStatus } from '@amboras-dev/klaviyo'`

`useKlaviyoSubscribePhone` — `useKlaviyoSubscribePhone(opts): UseMutationResult`
  Returns: Returns { ok: true } | { ok: false, error: { code, message } }. Codes: no_public_key, invalid_phone, unsupported_country, klaviyo_error
  Import:  `import { useKlaviyoSubscribePhone } from '@amboras-dev/klaviyo'`

`useKlaviyoUnsubscribePhone` — `useKlaviyoUnsubscribePhone(opts?): UseMutationResult`
  Returns: Returns structured Result instead of throwing (0.5.0 breaking-ish — see CHANGELOG)
  Import:  `import { useKlaviyoUnsubscribePhone } from '@amboras-dev/klaviyo'`

`klaviyoTrack` — `klaviyoTrack(metric, properties?)`
  Returns: Imperative event tracking
  Import:  `import { klaviyoTrack } from '@amboras-dev/klaviyo'`

`klaviyoIdentify` — `klaviyoIdentify(attrs)`
  Returns: Imperative identify
  Import:  `import { klaviyoIdentify } from '@amboras-dev/klaviyo'`

`getActiveIntegrations` — `getActiveIntegrations(opts?): Promise<ActiveIntegrationsResponse | null>`
  Returns: Server-only fetch from /store/integrations/active. 60s revalidation
  Import:  `import { getActiveIntegrations } from '@amboras-dev/klaviyo'`

`KlaviyoViewedProduct` — `<KlaviyoViewedProduct productId price ... />`
  Returns: Drop-in PDP component
  Import:  `import { KlaviyoViewedProduct } from '@amboras-dev/klaviyo'`

**API endpoints:**
  GET  /store/integrations/active — { klaviyo: { publicKey, sms_active, sms_sender_configured, sms_disclosure_text, sms_list_id, sms_active_regions, sms_supported_countries } | null, store_name } — 60s cache, busted on credential sync
  POST /store/klaviyo/unsubscribe-sms — customer self-service unsubscribe (Bearer _medusa_jwt)
  GET    /api/v1/stores/:storeId/integrations/klaviyo  ← admin auth required
  POST   /api/v1/stores/:storeId/integrations/klaviyo/connect — body { privateKey }  ← admin auth required
  DELETE /api/v1/stores/:storeId/integrations/klaviyo  ← admin auth required
  GET    /admin/klaviyo/sms-status  ← admin auth required
  POST   /admin/klaviyo/probe-sms  ← admin auth required
  PATCH  /admin/klaviyo/sms-disclosure  ← admin auth required
  GET    /admin/klaviyo/sms-events  ← admin auth required
  POST   /webhooks/klaviyo  ← admin auth required
  POST   /orchestrator/klaviyo/sync-credentials  ← admin auth required

<!-- AMBORAS:PLUGIN:klaviyo:END -->
