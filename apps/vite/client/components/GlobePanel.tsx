import { MoveUpRight, Sparkles } from "lucide-react"
import type { City } from "../data/cities"
import { SnowGlobe } from "./globe/SnowGlobe"

interface Props {
  city: City
  shakeKey: number
  onShake: () => void
}

export function GlobePanel({ city, shakeKey, onShake }: Props) {
  return (
    <section aria-label="Esfera de Navidad interactiva" className="flex min-w-0 flex-col items-center justify-center pb-ds-xl lg:pb-0" data-oid="6cd73c3f4d" data-oid-component-root="true" data-oid-callsite-deletable="true" data-oid-callsite-single="true">
      <div className="relative aspect-square w-full" data-oid="426919d46f">
        <div className="absolute inset-0 scale-[0.88]" data-oid="44b352bbdf">
          <SnowGlobe city={city} shakeKey={shakeKey} />
        </div>
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
