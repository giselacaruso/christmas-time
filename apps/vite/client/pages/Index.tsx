import { useCallback, useState } from "react";
import { Snowflake } from "lucide-react";
import { CitySlider } from "../components/CitySlider";
import { GlobePanel } from "../components/GlobePanel";
import { CITIES } from "../data/cities";
import "../components/christmas-editorial.css";

export default function Index() {
  const [index, setIndex] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const selectCity = useCallback((next: number) => setIndex(next), []);

  return (
    <main className="christmas-editorial relative flex min-h-screen flex-col bg-background px-ds-lg py-ds-lg text-foreground md:px-ds-xl md:py-ds-xl 2xl:px-ds-2xl" data-oid="033b6f01be" data-oid-component-root="true" data-oid-callsite-deletable="true" data-oid-callsite-single="true">
      








      

      <div className="grid flex-1 items-center gap-x-ds-2xl lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]" data-oid="fd810209d4">
        <CitySlider cities={CITIES} index={index} onSelect={selectCity} />
        <GlobePanel city={CITIES[index]} number={index + 1} shakeKey={shakeKey} onShake={() => setShakeKey((key) => key + 1)} />
      </div>

      <footer className="mt-ds-xl flex flex-wrap items-center justify-between gap-ds-md" data-oid="f329b349b9">
        <p className="type-caption text-muted-foreground" data-oid="3b731a21a4">{"giselacaruso.com"}</p>
        
      </footer>
    </main>);

}