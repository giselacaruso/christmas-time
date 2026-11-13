import { useCallback, useState } from "react"
import { Snowflake } from "lucide-react"
import { CitySlider } from "../components/CitySlider"
import { GlobePanel } from "../components/GlobePanel"
import { CITIES } from "../data/cities"
import "../components/christmas-editorial.css"

export default function Index() {
  const [index, setIndex] = useState(0)
  const [shakeKey, setShakeKey] = useState(0)
  const selectCity = useCallback((next: number) => setIndex(next), [])

  return (
    <main className="christmas-editorial relative flex min-h-screen flex-col bg-background px-ds-lg py-ds-lg text-foreground md:px-ds-xl md:py-ds-xl 2xl:px-ds-2xl" data-oid="033b6f01be" data-oid-component-root="true" data-oid-callsite-deletable="true" data-oid-callsite-single="true">
      <header className="flex items-start justify-between gap-ds-lg" data-oid="06c4110718">
        <div data-oid="b7c0bc209e">
          <h1 className="type-label uppercase text-foreground" data-oid="eb78fccdbc">Christmas Time</h1>
          <p className="mt-ds-xs type-caption text-muted-foreground" data-oid="e436ffbba1">Un atlas de Navidad</p>
        </div>
        <div className="flex items-center gap-ds-lg" data-oid="e4e25cb956">
          <p className="type-caption uppercase text-muted-foreground" data-oid="4d46215f25">Colección 2026</p>
          <Snowflake aria-hidden="true" className="size-6 text-foreground" strokeWidth={1} data-oid="573454a0e7" />
        </div>
      </header>

      <div className="grid flex-1 items-center gap-x-ds-2xl lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]" data-oid="fd810209d4">
        <CitySlider cities={CITIES} index={index} onSelect={selectCity} />
        <GlobePanel city={CITIES[index]} number={index + 1} shakeKey={shakeKey} onShake={() => setShakeKey((key) => key + 1)} />
      </div>

      <footer className="mt-ds-xl flex flex-wrap items-center justify-between gap-ds-md" data-oid="f329b349b9">
        <p className="type-caption text-muted-foreground" data-oid="3b731a21a4">Una Navidad. Quince formas de sentirla.</p>
        <p className="type-caption text-muted-foreground" data-oid="7f92051768">Vidrio, cerámica y un pequeño viaje.</p>
      </footer>
    </main>
  )
}
