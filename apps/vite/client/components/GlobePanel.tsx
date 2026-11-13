import { Hand, Sparkles } from "lucide-react";
import type { City } from "../data/cities";
import { SnowGlobe } from "./globe/SnowGlobe";

interface Props {
  city: City;
  number: number;
  shakeKey: number;
  onShake: () => void;
}

export function GlobePanel({ city, number, shakeKey, onShake }: Props) {
  return (
    <section aria-label="Esfera de nieve interactiva" className="relative min-h-[80vh] overflow-hidden border-l border-accent lg:h-screen" data-oid="6cd73c3f4d" data-oid-component-root="true" data-oid-callsite-deletable="true" data-oid-callsite-single="true">
      <SnowGlobe city={city} shakeKey={shakeKey} />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-ds-xl" data-oid="3bb567833c">
        


        
        <button type="button" onClick={onShake} className="ds-button ds-button-secondary pointer-events-auto rounded-full px-ds-lg" data-oid="ac4468dbaf">
          <Sparkles className="h-4 w-4" strokeWidth={1.5} data-oid="c859ed2ce8" />
          Agitar
        </button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-ds-sm p-ds-xl" data-oid="44f82c0ee8">
        
        <p className="type-caption uppercase text-muted-foreground" data-oid="a331a28a80" style={{ whiteSpace: "pre-wrap" }}>{"\n"}</p>
      </div>
    </section>);

}