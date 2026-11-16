import type { City } from "../data/cities";

interface Props {
  cities: City[];
  index: number;
  onSelect: (i: number) => void;
}

export function CitySlider({ cities, index, onSelect }: Props) {
  return (
    <section aria-label="Destinos de Navidad" className="relative z-10 order-last min-w-0 py-ds-sm lg:order-first" data-oid="81f47660eb" data-oid-component-root="true" data-oid-callsite-deletable="true" data-oid-callsite-single="true">
      


      

      <ul aria-label="Ciudades de la colección" className="city-list flex list-none flex-nowrap gap-ds-lg overflow-x-auto overscroll-x-contain touch-pan-x snap-x snap-mandatory p-0 lg:block lg:gap-0 lg:overflow-visible lg:touch-auto lg:snap-none" data-oid="8fea900bf3">
        {cities.map((city, itemIndex) =>
        <li key={city.id} className="city-option inline-flex shrink-0 snap-center items-start justify-start align-top" data-city={city.id} data-oid="606a97f66d" data-oid-shared="true" data-oid-instance-targetable="true" data-oid-text-editable="false" data-oid-text-source="element:button|element:sup|expression:4414837a9a19">
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