'use client'

import { useEffect, useMemo, useState } from 'react'

// Default: 7 days from the moment the module is first evaluated
const DEFAULT_TARGET_ISO = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

interface LandingCountdownTimerProps {
  targetIso?: string
}

interface TimeUnitProps {
  value: string
  label: string
}

function TimeUnit({ value, label }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="text-5xl font-black leading-none text-gray-900 tabular-nums overflow-hidden"
        style={{ letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}
      >
        {/* key forces a remount each second so the CSS animation re-fires */}
        <span
          key={value}
          className="inline-block animate-[countdown-flip_0.2s_ease-out]"
        >
          {value}
        </span>
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mt-1.5">
        {label}
      </span>
    </div>
  )
}

export default function LandingCountdownTimer({ targetIso }: LandingCountdownTimerProps) {
  const targetMs = useMemo(() => {
    const iso = targetIso ?? DEFAULT_TARGET_ISO
    const parsed = Date.parse(iso)
    if (Number.isNaN(parsed)) {
      return Date.now() + 7 * 24 * 60 * 60 * 1000
    }
    return parsed
  }, [targetIso])

  const [now, setNow] = useState<number>(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = Math.max(0, targetMs - now)
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff / 3_600_000) % 24)
  const minutes = Math.floor((diff / 60_000) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  const pad = (n: number) => String(n).padStart(2, '0')

  const Colon = (
    <span
      style={{ fontSize: '30px', marginBottom: '16px' }}
      className="font-bold text-gray-900/30 leading-none"
    >
      :
    </span>
  )

  return (
    <div
      className="w-full rounded-2xl py-10 px-8 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #e4f54a, #c6e030, #b8d929)' }}
    >
      <h2
        className="text-3xl font-black text-gray-900"
        style={{ letterSpacing: '-0.02em' }}
      >
        Hurry up!
      </h2>
      <p className="text-sm font-medium text-gray-600 mt-1">Sale ends in:</p>

      <div className="flex items-start justify-center gap-2 mt-5">
        <TimeUnit value={pad(days)} label="Days" />
        {Colon}
        <TimeUnit value={pad(hours)} label="Hrs" />
        {Colon}
        <TimeUnit value={pad(minutes)} label="Mins" />
        {Colon}
        <TimeUnit value={pad(seconds)} label="Secs" />
      </div>
    </div>
  )
}
