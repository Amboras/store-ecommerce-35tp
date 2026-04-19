'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

// Edit this constant to change when the countdown ends.
// Default: ~10 hours from initial setup.
const TARGET_ISO = '2025-12-31T23:59:59Z'

const TARGET_MS = new Date(TARGET_ISO).getTime()

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)
  const [now, setNow] = useState<number>(() => Date.now())

  useEffect(() => {
    const diff = TARGET_MS - Date.now()
    if (diff <= 0) return
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  const diff = Math.max(0, TARGET_MS - now)
  const hours = Math.floor(diff / 3_600_000)
  const minutes = Math.floor((diff / 60_000) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return (
    <div className="relative w-full">
      <div className="relative flex items-center justify-center gap-5 bg-foreground text-background px-6 py-2.5">
        {/* Subtle lime glow */}
        <div aria-hidden className="pointer-events-none absolute left-1/3 top-0 h-full w-1/3 bg-lime-400/10 blur-2xl" />

        {/* Left: label */}
        <div className="relative flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-background">
            Welcome Offer Ends Soon
          </span>
        </div>

        {/* Right: countdown boxes */}
        <div className="relative flex items-center gap-1.5">
          {[
            { value: pad(hours), label: 'HRS' },
            { value: pad(minutes), label: 'MIN' },
            { value: pad(seconds), label: 'SEC' },
          ].map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-1.5">
              <div className="rounded-md bg-lime-400 text-foreground px-2 py-0.5 text-center min-w-[36px]">
                <div className="text-sm font-extrabold leading-tight tabular-nums">{unit.value}</div>
                <div className="font-bold uppercase tracking-widest opacity-70" style={{ fontSize: '6px' }}>
                  {unit.label}
                </div>
              </div>
              {i < 2 && <span className="text-xs font-bold text-lime-400/60">:</span>}
            </div>
          ))}
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-background/70 transition-opacity hover:text-background"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
