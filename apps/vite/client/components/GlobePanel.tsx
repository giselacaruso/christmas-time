import type { City } from "../data/cities"
import { SnowGlobe } from "./globe/SnowGlobe"

interface Props {
  city: City
  shakeKey: number
}

export function GlobePanel({ city, shakeKey }: Props) {
  return (
    <section aria-label="Esfera de Navidad interactiva" className="globe-panel flex h-full min-h-0 min-w-0 items-center justify-center" data-oid="6cd73c3f4d" data-oid-component-root="true" data-oid-callsite-deletable="true" data-oid-callsite-single="true">
      <div className="globe-frame relative aspect-square" data-oid="426919d46f">
        <div className="absolute inset-0" data-oid="44b352bbdf">
          <SnowGlobe city={city} shakeKey={shakeKey} />
        </div>
      </div>

    </section>
  )
}
