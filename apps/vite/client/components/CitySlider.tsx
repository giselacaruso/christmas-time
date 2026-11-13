import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Snowflake, Sun } from "lucide-react";
import type { City } from "../data/cities";

const ease = [0.16, 1, 0.3, 1] as const;
const easeIn = [0.7, 0, 0.84, 0] as const;

const reveal = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  exit: { opacity: 0, y: -32, transition: { duration: 0.3, ease: easeIn } }
};
const revealName = {
  hidden: { opacity: 0, y: 90, rotate: 1.5 },
  visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.9, delay: 0.08, ease } },
  exit: { opacity: 0, y: -60, transition: { duration: 0.32, ease: easeIn } }
};
const revealLate = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.22, ease } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.25, ease: easeIn } }
};

interface Props {
  cities: City[];
  index: number;
  onSelect: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function CitySlider({ cities, index, onSelect, onPrev, onNext }: Props) {
  const city = cities[index];
  const num = String(index + 1).padStart(2, "0");

  return (
    <section className="relative z-10 flex min-h-screen flex-col justify-between px-ds-2xl py-ds-xl xl:px-ds-3xl lg:min-h-0 lg:h-screen" data-oid="00d6346fbf" data-oid-component-root="true" data-oid-callsite-deletable="true" data-oid-callsite-single="true">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,color-mix(in_srgb,var(--accent)_16%,transparent),transparent_55%)]" data-oid="08a44a0b30" />

      <header className="relative flex items-center justify-between" data-oid="0b8388acee">
        


        
        <p className="type-caption uppercase text-muted-foreground" data-oid="99f8d1d050">Colección del mundo · 2026</p>
      </header>

      <div className="relative py-ds-xl" data-oid="82cf0c9a11">
        <AnimatePresence mode="wait">
          <motion.div key={city.id} initial="hidden" animate="visible" exit="exit" data-oid="d15abce23e">
            <motion.div variants={reveal} data-oid="d0ebd60bc1">
              <div className="flex items-center gap-ds-md" data-oid="e0b74dedfa">
                <span className="font-display text-[4.5rem] italic leading-none text-accent" data-oid="9454f18380">{num}</span>
                <span aria-hidden="true" className="h-px w-16 bg-accent" data-oid="0512c34193" />
                <p className="type-label uppercase text-secondary" data-oid="76b8e5d3c2">{city.country}</p>
              </div>
            </motion.div>

            <motion.div variants={revealName} style={{ transformOrigin: "0% 100%" }} data-oid="6ade88277f">
              <h1 className="mt-ds-md font-display text-[6rem] font-medium leading-[0.9] tracking-[-0.035em] text-foreground xl:text-[8.5rem] 2xl:text-[9.5rem]" data-oid="ff81b69605" style={{ width: "793px", height: "142px" }}>
                {city.name}
              </h1>
            </motion.div>

            <motion.div variants={revealLate} data-oid="29fd29f81b">
              <div className="mt-ds-xl flex items-center gap-ds-lg" data-oid="62397ea9e4" style={{ width: "389px", height: "52px" }}>
                <div className="flex items-center gap-ds-sm" data-oid="a764c58f41" data-oid-text-editable="false" data-oid-text-source="expression:91b2d78b95e3|element:span">
                  {city.climate === "snow" ?
                  <Snowflake className="h-7 w-7 text-secondary" strokeWidth={1.25} data-oid="0553a10907" /> :

                  <Sun className="h-7 w-7 text-primary" strokeWidth={1.25} data-oid="7186e044bd" />
                  }
                  <span className="font-display text-[3rem] font-medium leading-none text-foreground" data-oid="f78e523cfc">{city.temp}</span>
                </div>
                <span aria-hidden="true" className="h-12 w-px bg-accent" data-oid="c6a0420fdf" />
                <div data-oid="d022bbcefc">
                  <p className="type-label uppercase text-primary" data-oid="7d2298c88c">{city.weather}</p>
                  <p className="mt-ds-xs type-caption text-muted-foreground" data-oid="8b4239319e">{city.coords}</p>
                </div>
              </div>
              

              
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      








































      
    </section>);

}