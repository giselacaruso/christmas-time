import { useCallback, useState } from "react";
import { MoveUpRight, Snowflake, Sparkles, Sun } from "lucide-react";
import { CitySlider } from "../components/CitySlider";
import { GlobePanel } from "../components/GlobePanel";
import { CITIES } from "../data/cities";
import "../components/christmas-editorial.css";

export default function Index() {
  const [index, setIndex] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const selectCity = useCallback((next: number) => setIndex(next), []);
  const city = CITIES[index];

  return (
    <main className="christmas-editorial relative grid h-dvh min-h-screen grid-rows-[minmax(0,1fr)_auto_auto] gap-y-ds-lg overflow-clip bg-card px-ds-lg py-ds-lg text-foreground md:px-ds-xl md:py-ds-xl 2xl:px-ds-2xl" data-oid="a258d16a5f" data-oid-component-root="true" data-oid-callsite-deletable="true" data-oid-callsite-single="true">
      <div aria-hidden="true" className="globe-backdrop pointer-events-none absolute inset-0" data-oid="3cdebcab9a" />

      <div className="relative z-10 grid min-h-0 min-w-0 grid-rows-[minmax(0,1fr)_auto] items-center gap-x-ds-2xl lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:grid-rows-1" data-oid="59337d435b">
        <CitySlider cities={CITIES} index={index} onSelect={selectCity} />
        <GlobePanel city={city} shakeKey={shakeKey} />
      </div>

      <footer className="relative z-10 grid items-center justify-items-center gap-x-ds-2xl gap-y-ds-md lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:justify-items-stretch" data-oid="e1b574fd8b">
        <section
          id="selected-city-info"
          aria-label="Información del destino seleccionado"
          aria-live="polite"
          aria-atomic="true"
          className="flex flex-row items-center gap-ds-md text-left lg:gap-ds-lg" data-oid="3f268a948a">
          
          <p className="type-body whitespace-nowrap text-display not-italic leading-none tracking-normal tabular-nums lining-nums text-foreground" data-oid="839eb34112">{city.temp.replace(/\s+(?=°)/, "")}</p>
          <div className="flex min-w-0 flex-col items-start gap-ds-xs" data-oid="c8f4d5950a">
            <h2 className="type-label uppercase text-foreground" data-oid="64b29a7084">{city.country}</h2>
            <p className="flex items-center gap-ds-sm type-caption text-muted-foreground" data-oid="73e717b056" data-oid-text-editable="false" data-oid-text-source="expression:33651009acf3|expression:06ffb3af518d">
              {city.climate === "snow" ?
              <Snowflake aria-label="Invierno" className="size-4 shrink-0" strokeWidth={1.2} data-oid="3fabbe106b" /> :

              <Sun aria-label="Clima cálido" className="size-4 shrink-0" strokeWidth={1.2} data-oid="da82436992" />
              }
              {city.weather}
            </p>
            <p className="type-caption text-muted-foreground" data-oid="cb6fce8725">{city.coords}</p>
          </div>
        </section>

        <div className="flex flex-col items-center gap-ds-xs" data-oid="3720033362">
          <button
            type="button"
            onClick={() => setShakeKey((key) => key + 1)}
            className="ds-button ds-button-secondary gap-ds-sm rounded-none border-0 bg-transparent px-ds-sm py-ds-sm type-label uppercase text-foreground hover:translate-y-0 hover:bg-transparent hover:text-accent active:text-primary focus-visible:outline-ring" data-oid="b414e74131">
            
            <Sparkles aria-hidden="true" className="size-4" strokeWidth={1.2} data-oid="d18e41896e" />
            Agitar la esfera
            <MoveUpRight aria-hidden="true" className="size-3" strokeWidth={1.2} data-oid="041e06d842" />
          </button>
          
        </div>
      </footer>

      <p className="relative z-10 type-caption text-center text-muted-foreground lg:text-right" data-oid="966e7aa028"><a href="https://giselacaruso.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2" data-oid="944d5f761c">With love giselacaruso.com</a></p>
    </main>);

}