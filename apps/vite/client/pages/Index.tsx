import { useCallback, useState } from "react";
import { Snowflake, Sun } from "lucide-react";
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
    <main className="christmas-editorial relative flex min-h-screen flex-col bg-card px-ds-lg py-ds-lg text-foreground md:px-ds-xl md:py-ds-xl 2xl:px-ds-2xl" data-oid="033b6f01be" data-oid-component-root="true" data-oid-callsite-deletable="true" data-oid-callsite-single="true">
      








      

      <div className="grid flex-1 items-center gap-x-ds-2xl lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]" data-oid="fd810209d4">
        <CitySlider cities={CITIES} index={index} onSelect={selectCity} />
        <GlobePanel city={city} shakeKey={shakeKey} onShake={() => setShakeKey((key) => key + 1)} />
      </div>

      <footer className="mt-ds-xl flex flex-col items-start gap-ds-xl" data-oid="f329b349b9">
        <section id="selected-city-info" aria-label="Información del destino seleccionado" aria-live="polite" aria-atomic="true" className="flex flex-col items-start gap-ds-sm text-left" data-oid="7f92051768">
          <div className="flex flex-wrap items-baseline gap-x-ds-lg gap-y-ds-sm" data-oid="81ab669d79">
            <h2 className="type-label uppercase text-foreground" data-oid="8aa460861c">{city.country}</h2>
            <p className="flex items-center gap-ds-sm type-body text-foreground" data-oid="9e70bcaee2" data-oid-text-editable="false" data-oid-text-source="expression:2c93c8ef1f58|expression:b48ae97fa8b1">
              {city.climate === "snow" ? <Snowflake aria-label="Invierno" className="size-4" strokeWidth={1.2} data-oid="e360b2b422" /> : <Sun aria-label="Clima cálido" className="size-4" strokeWidth={1.2} data-oid="b4a871ad4c" />}
              {city.temp}
            </p>
          </div>
          <p className="type-caption text-muted-foreground" data-oid="6b574add4d">{city.weather}</p>
          <p className="type-caption text-muted-foreground" data-oid="f5a4a3dce2">{city.coords}</p>
        </section>
        <p className="type-caption text-muted-foreground" data-oid="3b731a21a4">{"giselacaruso.com"}</p>
        
      </footer>
    </main>);

}