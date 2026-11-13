import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Snowflake, Sun } from "lucide-react"
import type { City } from "../data/cities"

const ease = [0.16, 1, 0.3, 1] as const
const easeIn = [0.7, 0, 0.84, 0] as const

const reveal = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  exit: { opacity: 0, y: -32, transition: { duration: 0.3, ease: easeIn } },
}
const revealName = {
  hidden: { opacity: 0, y: 90, rotate: 1.5 },
  visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.9, delay: 0.08, ease } },
  exit: { opacity: 0, y: -60, transition: { duration: 0.32, ease: easeIn } },
}
const revealLate = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.22, ease } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.25, ease: easeIn } },
}

interface Props {
  cities: City[]
  index: number
  onSelect: (i: number) => void
  onPrev: () => void
  onNext: () => void
}

export function CitySlider({ cities, index, onSelect, onPrev, onNext }: Props) {
  const city = cities[index]
  const num = String(index + 1).padStart(2, "0")

  return (
    <section className="relative z-10 flex min-h-screen flex-col justify-between px-ds-2xl py-ds-xl xl:px-ds-3xl lg:min-h-0 lg:h-screen" data-oid="00d6346fbf" data-oid-component-root="true" data-oid-callsite-deletable="true" data-oid-callsite-single="true">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,color-mix(in_srgb,var(--accent)_16%,transparent),transparent_55%)]" data-oid="08a44a0b30" />

      <header className="relative flex items-center justify-between" data-oid="0b8388acee">
        <div className="flex items-center gap-ds-sm" data-oid="50765e9e68">
          <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-primary" data-oid="af87d2d711" />
          <p className="type-label uppercase text-foreground" data-oid="3ecc7e4bc6">Heirloom · Esferas de Navidad</p>
        </div>
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
              <h1 className="mt-ds-md font-display text-[6rem] font-medium leading-[0.9] tracking-[-0.035em] text-foreground xl:text-[8.5rem] 2xl:text-[9.5rem]" data-oid="ff81b69605">
                {city.name}
              </h1>
            </motion.div>

            <motion.div variants={revealLate} data-oid="29fd29f81b">
              <div className="mt-ds-xl flex items-center gap-ds-lg" data-oid="62397ea9e4">
                <div className="flex items-center gap-ds-sm" data-oid="a764c58f41" data-oid-text-editable="false" data-oid-text-source="expression:028f66ba288d|element:span">
                  {city.climate === "snow" ? (
                    <Snowflake className="h-7 w-7 text-secondary" strokeWidth={1.25} data-oid="0553a10907" />
                  ) : (
                    <Sun className="h-7 w-7 text-primary" strokeWidth={1.25} data-oid="7186e044bd" />
                  )}
                  <span className="font-display text-[3rem] font-medium leading-none text-foreground" data-oid="f78e523cfc">{city.temp}</span>
                </div>
                <span aria-hidden="true" className="h-12 w-px bg-accent" data-oid="c6a0420fdf" />
                <div data-oid="d022bbcefc">
                  <p className="type-label uppercase text-primary" data-oid="7d2298c88c">{city.weather}</p>
                  <p className="mt-ds-xs type-caption text-muted-foreground" data-oid="8b4239319e">{city.coords}</p>
                </div>
              </div>
              <p className="mt-ds-lg max-w-xl font-body text-[1.125rem] font-light leading-[1.65] text-muted-foreground" data-oid="b91f91b66f">
                {city.blurb}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="relative" data-oid="caef9c3214">
        <div className="flex items-center gap-ds-md" data-oid="371171a9fa">
          <button
            type="button"
            aria-label="Ciudad anterior"
            onClick={onPrev}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-accent text-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground" data-oid="cfe65b6ba3"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.5} data-oid="6babe00646" />
          </button>
          <button
            type="button"
            aria-label="Ciudad siguiente"
            onClick={onNext}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-secondary" data-oid="7664cd1050"
          >
            <ArrowRight className="h-5 w-5" strokeWidth={1.5} data-oid="88bc5ee474" />
          </button>
          <div className="ml-ds-md h-px flex-1 bg-border" data-oid="349cd30faa">
            <div className="h-px bg-accent transition-all duration-700" style={{ width: `${((index + 1) / cities.length) * 100}%` }} data-oid="437f2f611d" data-oid-style-dynamic="width" />
          </div>
          <p className="type-label text-muted-foreground" data-oid="277ec6947a" data-oid-text-editable="false" data-oid-text-source="expression:9c6c337ee519|text|expression:da66863fe75a">
            {num} / {String(cities.length).padStart(2, "0")}
          </p>
        </div>

        <ol className="mt-ds-lg grid grid-cols-5 gap-x-ds-lg gap-y-ds-sm" data-oid="7616cd8363">
          {cities.map((c, i) => (
            <li key={c.id} data-oid="3254842111" data-oid-shared="true" data-oid-instance-targetable="true">
              <button
                type="button"
                aria-pressed={i === index}
                onClick={() => onSelect(i)}
                className="flex w-full items-baseline gap-ds-sm border-t border-border pt-ds-sm text-left font-body text-[0.875rem] font-normal text-muted-foreground transition-colors hover:text-foreground aria-pressed:border-primary aria-pressed:text-primary" data-oid="5540639329" data-oid-shared="true" data-oid-instance-targetable="true"
              >
                <span className="font-display text-[1rem] italic" data-oid="546a9b075a" data-oid-shared="true" data-oid-instance-targetable="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="truncate" data-oid="0ca9dbc0e7" data-oid-shared="true" data-oid-instance-targetable="true">{c.name}</span>
              </button>
            </li>
          ))}
        </ol>
      </footer>
    </section>
  )
}
