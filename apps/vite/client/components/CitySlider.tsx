import type { City } from "../data/cities";

interface Props {
  cities: City[];
  index: number;
  onSelect: (i: number) => void;
}

export function CitySlider({ cities, index, onSelect }: Props) {
  return (
    <section aria-labelledby="destinations-heading" className="relative z-10 py-ds-xl lg:py-ds-2xl" data-oid="81f47660eb" data-oid-component-root="true" data-oid-callsite-deletable="true" data-oid-callsite-single="true">
      


      

      <ul aria-label="Ciudades de la colección" className="list-none p-0" data-oid="8fea900bf3">
        {cities.map((city, itemIndex) =>
        <li key={city.id} className="inline-block align-baseline" data-city={city.id} data-oid="606a97f66d" data-oid-shared="true" data-oid-instance-targetable="true" data-oid-text-editable="false" data-oid-text-source="element:button|element:sup|expression:95f2c3520322">
            <button
            type="button"
            aria-pressed={index === itemIndex}
            aria-controls="selected-city-info"
            onClick={() => onSelect(itemIndex)}
            className={`ds-button ds-button-secondary city-name inline-block min-h-0 whitespace-nowrap rounded-none border-0 bg-transparent p-0 text-left font-display text-heading font-medium text-foreground shadow-none hover:translate-y-0 hover:bg-transparent focus-visible:outline-accent xl:text-display ${city.listClassName ?? "not-italic"}`} data-oid="60624a8c5b" data-oid-shared="true" data-oid-instance-targetable="true" data-oid-classname-dynamic="true">
            
              {city.name}
            </button>
            <sup className="ml-ds-xs align-super type-caption text-muted-foreground" data-oid="cb9adf0e8c" data-oid-shared="true" data-oid-instance-targetable="true">{String(itemIndex + 1).padStart(2, "0")}</sup>
            {itemIndex < cities.length - 1 &&
          <span aria-hidden="true" className="mx-ds-sm font-display text-heading font-medium text-foreground/40 xl:text-display" style={itemIndex === 0 ? { width: "55px", marginLeft: "-19px", height: "126px" } : undefined} data-oid="370cc202ec" data-oid-shared="true"> / </span>
          }
          </li>
        )}
      </ul>

      
    </section>);

}