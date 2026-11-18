import { useEffect, useLayoutEffect, useRef } from "react";
import type { City } from "../data/cities";

interface Props {
  cities: City[];
  index: number;
  onSelect: (i: number) => void;
}

const MOBILE_QUERY = "(width < 64rem)";

export function CitySlider({ cities, index, onSelect }: Props) {
  const listRef = useRef<HTMLUListElement>(null);
  const indexRef = useRef(index);
  const fromScrollRef = useRef(false);
  indexRef.current = index;

  // Pad the track so the first and last city can sit in the exact center.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const update = () => {
      if (!window.matchMedia(MOBILE_QUERY).matches) {
        list.style.paddingLeft = "";
        list.style.paddingRight = "";
        return;
      }
      const items = list.querySelectorAll<HTMLElement>(".city-option");
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      const w = list.clientWidth;
      list.style.paddingLeft = `${Math.max(0, (w - first.offsetWidth) / 2)}px`;
      list.style.paddingRight = `${Math.max(0, (w - last.offsetWidth) / 2)}px`;
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(list);
    return () => ro.disconnect();
  }, [cities]);

  // Select whichever city is centered while swiping on mobile.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let frame = 0;
    const onScroll = () => {
      if (!window.matchMedia(MOBILE_QUERY).matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = list.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const items = list.querySelectorAll<HTMLElement>(".city-option");
        let best = indexRef.current;
        let bestDist = Infinity;
        items.forEach((item, i) => {
          const r = item.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - center);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        if (best !== indexRef.current) {
          fromScrollRef.current = true;
          onSelect(best);
        }
      });
    };
    list.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      list.removeEventListener("scroll", onScroll);
    };
  }, [onSelect]);

  // When a city is tapped, bring it to the center of the track.
  useEffect(() => {
    if (fromScrollRef.current) {
      fromScrollRef.current = false;
      return;
    }
    const list = listRef.current;
    if (!list || !window.matchMedia(MOBILE_QUERY).matches) return;
    const item = list.querySelectorAll<HTMLElement>(".city-option")[index];
    if (!item) return;
    const target = item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2;
    list.scrollTo({ left: target, behavior: "smooth" });
  }, [index]);

  return (
    <section aria-label="Destinos de Navidad" className="relative z-10 order-last min-w-0 py-ds-sm lg:order-first" data-oid="81f47660eb" data-oid-component-root="true" data-oid-callsite-deletable="true" data-oid-callsite-single="true">
      <ul ref={listRef} aria-label="Ciudades de la colección" className="city-list flex list-none flex-nowrap gap-ds-md overflow-x-auto overscroll-x-contain touch-pan-x snap-x snap-mandatory p-0 lg:block lg:gap-0 lg:overflow-visible lg:touch-auto lg:snap-none" data-oid="8fea900bf3">
        {cities.map((city, itemIndex) =>
        <li key={city.id} className="city-option inline-flex shrink-0 snap-center items-start justify-start align-top" data-city={city.id} data-oid="606a97f66d" data-oid-shared="true" data-oid-instance-targetable="true" data-oid-text-editable="false" data-oid-text-source="element:button|element:sup|expression:3ec201cd2477">
            <button
            type="button"
            aria-pressed={index === itemIndex}
            aria-controls="selected-city-info"
            onClick={() => onSelect(itemIndex)}
            className="ds-button ds-button-secondary city-name type-display inline-block min-h-0 overflow-visible whitespace-nowrap rounded-none border-0 bg-transparent px-0 py-ds-md text-left text-display not-italic text-foreground shadow-none hover:translate-y-0 hover:bg-transparent focus-visible:outline-accent lg:text-heading 2xl:text-display" data-oid="60624a8c5b" data-oid-shared="true" data-oid-instance-targetable="true">
              {city.name}
            </button>
            <sup className="city-number ml-ds-xs pt-ds-md type-caption text-muted-foreground" data-oid="cb9adf0e8c" data-oid-shared="true" data-oid-instance-targetable="true">{String(itemIndex + 1).padStart(2, "0")}</sup>
            {itemIndex < cities.length - 1 &&
          <span aria-hidden="true" className="hidden mx-ds-md py-ds-md type-display text-heading not-italic text-foreground/40 lg:inline 2xl:text-display" data-oid="370cc202ec" data-oid-shared="true">/</span>
          }
          </li>
        )}
      </ul>
    </section>);
}
