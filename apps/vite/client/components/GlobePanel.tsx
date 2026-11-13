import { MoveUpRight, Snowflake, Sparkles, Sun } from "lucide-react"
import type { City } from "../data/cities"
import { SnowGlobe } from "./globe/SnowGlobe"

interface Props {
  city: City
  number: number
  shakeKey: number
  onShake: () => void
}

export function GlobePanel({ city, number, shakeKey, onShake }: Props) {
  return (
    <section aria-label="Esfera de Navidad interactiva" className="flex min-w-0 flex-col items-center justify-center pb-ds-xl lg:pb-0" data-oid="6cd73c3f4d" data-oid-component-root="true" data-oid-callsite-deletable="true" data-oid-callsite-single="true">
      <div className="relative aspect-square w-full" data-oid="426919d46f">
        <div className="absolute inset-0 scale-[0.8]" data-oid="44b352bbdf">
          <SnowGlobe city={city} shakeKey={shakeKey} />
        </div>
      </div>

      <div id="selected-city-info" aria-live="polite" aria-atomic="true" className="relative -mt-ds-xl w-full max-w-md px-ds-md text-center" data-oid="2779042eb0">
        <p className="mb-ds-sm type-caption uppercase text-muted-foreground" data-oid="ac4468dbaf" data-oid-text-editable="false" data-oid-text-source="expression:92e1b6c2dbbe|text|expression:44fa801bb383">{String(number).padStart(2, "0")} / 15 · {city.country}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-ds-lg gap-y-ds-sm" data-oid="a2177c7a84">
          <h2 className="type-heading text-foreground" data-oid="8493e9a682">{city.name}</h2>
          <p className="flex items-center gap-ds-sm type-heading text-foreground" data-oid="64075501ac" data-oid-text-editable="false" data-oid-text-source="expression:36263cc81d5c|expression:b48ae97fa8b1">
            {city.climate === "snow" ? <Snowflake aria-label="Invierno" className="size-5" strokeWidth={1.2} data-oid="ab835954cf" /> : <Sun aria-label="Clima cálido" className="size-5" strokeWidth={1.2} data-oid="8998e9128a" />}
            {city.temp}
          </p>
        </div>
        <p className="mt-ds-sm type-caption text-muted-foreground" data-oid="a331a28a80" data-oid-text-editable="false" data-oid-text-source="expression:06ffb3af518d|text|expression:6e0434cc25ea">{city.weather} · {city.coords}</p>
      </div>

      <button
        type="button"
        onClick={onShake}
        className="ds-button ds-button-secondary mt-ds-xl gap-ds-sm rounded-none border-0 bg-transparent px-ds-sm py-ds-sm type-label uppercase text-foreground hover:translate-y-0 hover:bg-transparent hover:text-accent" data-oid="8ec41453c3"
      >
        <Sparkles aria-hidden="true" className="size-4" strokeWidth={1.2} data-oid="b34f302534" />
        Agitar la esfera
        <MoveUpRight aria-hidden="true" className="size-3" strokeWidth={1.2} data-oid="660aef8d9e" />
      </button>
      <p className="mt-ds-xs type-caption text-muted-foreground" data-oid="3119c950a0">O arrástrala suavemente</p>
    </section>
  )
}
