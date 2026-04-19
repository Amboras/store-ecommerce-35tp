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
      <div
        className="container-custom relative flex items-center justify-center gap-5 rounded-xl px-6 py-3.5"
        style={{
          background:
            'linear-gradient(135deg, #fff1f2, #ffe4e6, #fecdd3)',
        }}
      >
        {/* Left: label */}
        <div className="flex items-center gap-2">
          <span className="text-base" aria-hidden="true">
            🎁
          </span>
          <span className="text-sm font-bold tracking-wide text-rose-800">
            Welcome Offer Ends Soon
          </span>
        </div>

        {/* Right: countdown boxes */}
        <div className="flex items-center gap-1.5">
          <div
            className="rounded-lg bg-white/80 px-3 py-1.5 text-center backdrop-blur-sm"
            style={{
              boxShadow:
                '0 1px 3px rgba(159,18,57,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
            }}
          >
            <div className="text-lg font-extrabold leading-tight text-rose-700 tabular-nums transition-opacity duration-200">
              {pad(hours)}
            </div>
            <div
              className="font-bold uppercase tracking-widest text-rose-400"
              style={{ fontSize: '6px' }}
            >
              HRS
            </div>
          </div>

          <span className="text-sm font-bold text-rose-300">:</span>

          <div
            className="rounded-lg bg-white/80 px-3 py-1.5 text-center backdrop-blur-sm"
            style={{
              boxShadow:
                '0 1px 3px rgba(159,18,57,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
            }}
          >
            <div className="text-lg font-extrabold leading-tight text-rose-700 tabular-nums transition-opacity duration-200">
              {pad(minutes)}
            </div>
            <div
              className="font-bold uppercase tracking-widest text-rose-400"
              style={{ fontSize: '6px' }}
            >
              MIN
            </div>
          </div>

          <span className="text-sm font-bold text-rose-300">:</span>

          <div
            className="rounded-lg bg-white/80 px-3 py-1.5 text-center backdrop-blur-sm"
            style={{
              boxShadow:
                '0 1px 3px rgba(159,18,57,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
            }}
          >
            <div className="text-lg font-extrabold leading-tight text-rose-700 tabular-nums transition-opacity duration-200">
              {pad(seconds)}
            </div>
            <div
              className="font-bold uppercase tracking-widest text-rose-400"
              style={{ fontSize: '6px' }}
            >
              SEC
            </div>
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-rose-700 transition-opacity hover:opacity-70"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
