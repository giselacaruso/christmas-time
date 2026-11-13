import { useCallback, useEffect, useState } from "react"
import { CitySlider } from "../components/CitySlider"
import { GlobePanel } from "../components/GlobePanel"
import { CITIES } from "../data/cities"

export default function Index() {
  const [index, setIndex] = useState(0)
  const [shakeKey, setShakeKey] = useState(0)
  const go = useCallback((i: number) => setIndex((i + CITIES.length) % CITIES.length), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") setIndex((i) => (i + 1) % CITIES.length)
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") setIndex((i) => (i - 1 + CITIES.length) % CITIES.length)
      if (e.key === " ") setShakeKey((k) => k + 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-background" data-oid="58fcc5757c" data-oid-component-root="true" data-oid-callsite-deletable="true" data-oid-callsite-single="true">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]" data-oid="e1b574fd8b">
        <CitySlider cities={CITIES} index={index} onSelect={go} onPrev={() => go(index - 1)} onNext={() => go(index + 1)} />
        <GlobePanel city={CITIES[index]} number={index + 1} shakeKey={shakeKey} onShake={() => setShakeKey((k) => k + 1)} />
      </div>
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05] mix-blend-multiply" data-oid="dd464f7ebc">
        <filter id="porcelain-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#porcelain-grain)" />
      </svg>
    </main>
  )
}
