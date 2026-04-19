'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowRight, Truck, Shield, RotateCcw } from 'lucide-react'
import CollectionSection from '@/components/marketing/collection-section'
import LandingCountdownTimer from '@/components/marketing/landing-countdown-timer'
import { useCollections } from '@/hooks/use-collections'
import { trackMetaEvent } from '@/lib/meta-pixel'
import { HERO_PLACEHOLDER, LIFESTYLE_PLACEHOLDER } from '@/lib/utils/placeholder-images'

export default function HomePage() {
  const { data: collections, isLoading } = useCollections()
  const [newsletterEmail, setNewsletterEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newsletterEmail.trim()) {
      return
    }

    trackMetaEvent('Lead', {
      content_name: 'newsletter_signup',
      status: 'submitted',
    })
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        {/* Soft lime radial glow */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-lime-radial opacity-80" />
        <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-lime-300/40 blur-3xl" />

        <div className="container-custom relative grid lg:grid-cols-2 gap-12 items-center py-section lg:py-32">
          {/* Text Content */}
          <div className="space-y-7 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/70 backdrop-blur px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-foreground/80 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
              New Collection
            </span>
            <h1 className="text-display font-heading font-semibold text-balance leading-[1.05]">
              Elevate Your <span className="italic text-foreground/90">Everyday</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Thoughtfully designed products that bring beauty and function to your daily rituals.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-7 py-3.5 text-sm font-semibold uppercase tracking-wide hover:bg-foreground/90 hover:shadow-lime-glow transition-all"
                prefetch={true}
              >
                Shop Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/60 backdrop-blur px-7 py-3.5 text-sm font-semibold uppercase tracking-wide hover:border-foreground hover:bg-foreground hover:text-background transition-colors"
                prefetch={true}
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in">
            {/* Lime offset card behind image */}
            <div aria-hidden className="absolute -inset-4 -z-10 translate-x-4 translate-y-4 rounded-2xl bg-lime-gradient opacity-90" />
            <div className="relative aspect-[4/5] lg:aspect-[3/4] bg-muted rounded-2xl overflow-hidden shadow-premium-lg ring-1 ring-foreground/5">
              <Image
                src={HERO_PLACEHOLDER}
                alt="Hero - New Collection"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Timer */}
      <section className="container-custom py-12">
        <LandingCountdownTimer />
      </section>

      {/* Collections */}
      {isLoading ? (
        <section className="py-section">
          <div className="container-custom">
            <div className="animate-pulse space-y-4 text-center">
              <div className="h-3 w-20 bg-muted rounded mx-auto" />
              <div className="h-8 w-64 bg-muted rounded mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[3/4] bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      ) : collections && collections.length > 0 ? (
        <>
          {collections.map((collection: { id: string; handle: string; title: string; metadata?: Record<string, unknown> }, index: number) => (
            <CollectionSection
              key={collection.id}
              collection={collection}
              alternate={index % 2 === 1}
            />
          ))}
        </>
      ) : null}

      {/* Editorial / Brand Story Section */}
      <section className="py-section bg-muted/40">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div aria-hidden className="absolute -inset-4 -z-10 -translate-x-4 translate-y-4 rounded-2xl bg-lime-gradient opacity-80" />
              <div className="aspect-[4/5] bg-muted rounded-2xl overflow-hidden relative shadow-premium ring-1 ring-foreground/5">
                <Image
                  src={LIFESTYLE_PLACEHOLDER}
                  alt="Lifestyle - Our Philosophy"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-6 lg:max-w-md">
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                <span className="h-px w-8 bg-lime-400" />
                Our Philosophy
              </span>
              <h2 className="text-h2 font-heading font-semibold">
                Crafted With <span className="italic">Intention</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Every product in our collection is chosen for its quality, design, and the story behind it.
                We believe in fewer, better things — pieces that last and bring joy to everyday moments.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide link-underline pb-0.5"
                prefetch={true}
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Features Bar */}
      <section className="py-section-sm border-y border-foreground/10">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {[
              { Icon: Truck, title: 'Free Shipping', sub: 'On orders over $75' },
              { Icon: RotateCcw, title: 'Easy Returns', sub: '30-day return policy' },
              { Icon: Shield, title: 'Secure Checkout', sub: '256-bit SSL encryption' },
            ].map(({ Icon, title, sub }, i) => (
              <div
                key={title}
                className={`flex items-center gap-4 ${
                  i === 0 ? 'justify-center md:justify-start text-center md:text-left'
                  : i === 2 ? 'justify-center md:justify-end text-center md:text-right'
                  : 'justify-center'
                }`}
              >
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-lime-100 text-foreground ring-1 ring-lime-300/60">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-section">
        <div className="container-custom">
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl bg-foreground text-background px-8 py-16 sm:px-16 sm:py-20 shadow-premium-lg">
            {/* Lime glow accents */}
            <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-lime-400/40 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-lime-300/20 blur-3xl" />

            <div className="relative text-center">
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-lime-300">
                <span className="h-px w-8 bg-lime-400" />
                Newsletter
              </span>
              <h2 className="mt-4 text-h2 font-heading font-semibold">Stay in <span className="italic text-lime-300">Touch</span></h2>
              <p className="mt-3 text-background/70">
                Be the first to know about new arrivals, exclusive offers, and more.
              </p>
              <form className="mt-8 mx-auto flex max-w-md flex-col sm:flex-row gap-2 rounded-full bg-background/5 p-1 ring-1 ring-background/15 backdrop-blur" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent px-5 py-3 text-sm placeholder:text-background/50 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-lime-400 text-foreground px-7 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-lime-300 transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
