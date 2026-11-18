import { useEffect, useLayoutEffect, useRef } from "react";
import type { City } from "../data/cities";

interface Props {
  cities: City[];
  index: number;
  onSelect: (i: number) => void;
}

const MOBILE_QUERY = "(width < 64rem)";
const COPIES = [0, 1, 2];

const isMobile = () => window.matchMedia(MOBILE_QUERY).matches;

export function CitySlider({ cities, index, onSelect }: Props) {
  const listRef = useRef<HTMLUListElement>(null);
  const indexRef = useRef(index);
  const fromScrollRef = useRef(false);
  indexRef.current = index;
  const count = cities.length;

  const getItems = () =>
    Array.from(listRef.current?.querySelectorAll<HTMLElement>(".city-option") ?? []);

  const centerOn = (item: HTMLElement, behavior: ScrollBehavior) => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTo({ left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2, behavior });
  };

  const nearestToCenter = () => {
    const list = listRef.current;
    if (!list) return -1;
    const rect = list.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    let best = -1;
    let bestDist = Infinity;
    getItems().forEach((item, i) => {
      const r = item.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  };

  // Start on the middle copy so the previous city (the last one) peeks on the left.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const place = () => {
      if (!isMobile()) return;
      const item = getItems()[count + indexRef.current];
      if (item) centerOn(item, "instant" as ScrollBehavior);
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(list);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  // Swipe selects the centered city; when idle, silently jump back to the middle copy (infinite loop).
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let frame = 0;
    let idle = 0;
    const recenter = () => {
      const i = nearestToCenter();
      if (i < 0 || (i >= count && i < count * 2)) return;
      const items = getItems();
      const setWidth = items[count].offsetLeft - items[0].offsetLeft;
      const prevSnap = list.style.scrollSnapType;
      list.style.scrollSnapType = "none";
      list.scrollLeft += i < count ? setWidth : -setWidth;
      list.style.scrollSnapType = prevSnap;
    };
    const onScroll = () => {
      if (!isMobile()) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const i = nearestToCenter();
        if (i < 0) return;
        const next = i % count;
        if (next !== indexRef.current) {
          fromScrollRef.current = true;
          onSelect(next);
        }
      });
      window.clearTimeout(idle);
      idle = window.setTimeout(recenter, 160);
    };
    list.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(idle);
      list.removeEventListener("scroll", onScroll);
    };
  }, [onSelect, count]);

  // A tapped city glides to the center using its closest copy.
  useEffect(() => {
    if (fromScrollRef.current) {
      fromScrollRef.current = false;
      return;
    }
    if (!listRef.current || !isMobile()) return;
    const current = nearestToCenter();
    const items = getItems();
    let target: HTMLElement | undefined;
    let bestDist = Infinity;
    items.forEach((item, i) => {
      if (i % count !== index) return;
      const d = Math.abs(i - current);
      if (d < bestDist) {
        bestDist = d;
        target = item;
      }
    });
    if (target) centerOn(target, "smooth");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <section aria-label="Destinos de Navidad" className="relative z-10 order-last min-w-0 py-ds-sm lg:order-first" data-oid="81f47660eb" data-oid-component-root="true" data-oid-callsite-deletable="true" data-oid-callsite-single="true">
      <ul ref={listRef} aria-label="Ciudades de la colección" className="city-list -mx-5 flex list-none flex-nowrap gap-ds-md overflow-x-auto overscroll-x-contain touch-pan-x snap-x snap-mandatory p-0 lg:mx-0 lg:block lg:gap-0 lg:overflow-visible lg:touch-auto lg:snap-none" data-oid="8fea900bf3">
        {COPIES.flatMap((copy) =>
          cities.map((city, itemIndex) => {
            const clone = copy !== 1;
            return (
              <li
                key={`${copy}-${city.id}`}
                aria-hidden={clone || undefined}
                data-clone={clone}
                className="city-option inline-flex shrink-0 snap-center items-start justify-start align-top lg:data-[clone=true]:hidden"
                data-city={city.id}
                data-oid="606a97f66d" data-oid-shared="true" data-oid-text-editable="false" data-oid-text-source="element:button|element:sup|expression:d3a94867fce7">
                <button
                  type="button"
                  tabIndex={clone ? -1 : undefined}
                  aria-pressed={index === itemIndex}
                  aria-controls="selected-city-info"
                  onClick={() => onSelect(itemIndex)}
                  className="ds-button ds-button-secondary city-name type-display inline-block min-h-0 overflow-visible whitespace-nowrap rounded-none border-0 bg-transparent px-0 py-ds-md text-left text-display not-italic text-foreground shadow-none hover:translate-y-0 hover:bg-transparent focus-visible:outline-accent lg:text-heading 2xl:text-display" data-oid="60624a8c5b" data-oid-shared="true">
                  {city.name}
                </button>
                <sup className="city-number ml-ds-xs pt-ds-md type-caption text-muted-foreground" data-oid="cb9adf0e8c" data-oid-shared="true">{String(itemIndex + 1).padStart(2, "0")}</sup>
                {!clone && itemIndex < cities.length - 1 &&
                <span aria-hidden="true" className="hidden mx-ds-md py-ds-md type-display text-heading not-italic text-foreground/40 lg:inline 2xl:text-display" data-oid="370cc202ec" data-oid-shared="true">/</span>
                }
              </li>);
          })
        )}
      </ul>
    </section>);
}
