import * as THREE from "three"

// Three cannot parse CSS var(), so the design-system tokens get resolved to
// concrete colors here, once, when the module loads.
//
// This module is evaluated before React mounts, so the stylesheet is not
// guaranteed to be applied yet and a token can come back as "". Per the canvas
// spec an invalid value assigned to `fillStyle` is silently IGNORED, which left
// fillStyle at its default black: every material in the scene was then built
// black, with no error in the console. So each token now carries the literal
// fallback from global.css, and `parse` rejects whatever the canvas refuses.
const styles = getComputedStyle(document.documentElement)
const swatch = document.createElement("canvas")
swatch.width = swatch.height = 1
const context = swatch.getContext("2d", { willReadFrequently: true })!

// The canvas-normalised color, or null when the value does not parse. Probing
// from two opposite sentinels is what makes a rejected assignment visible: it
// leaves each sentinel untouched, so the two reads only agree on a real color.
function parse(value: string) {
  if (!value) return null
  context.fillStyle = "#000000"
  context.fillStyle = value
  const fromBlack = context.fillStyle
  context.fillStyle = "#ffffff"
  context.fillStyle = value
  return fromBlack === context.fillStyle ? fromBlack : null
}

function token(name: string, fallback: string) {
  context.clearRect(0, 0, 1, 1)
  context.fillStyle = parse(styles.getPropertyValue(`--${name}`).trim()) ?? fallback
  context.fillRect(0, 0, 1, 1)
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data
  return new THREE.Color(`rgb(${r}, ${g}, ${b})`)
}

// The fallbacks mirror the :root tokens in global.css, written as hex so they
// parse even where canvas rejects CSS Color 4 space-separated hsl().
const porcelain = token("background", "#fbf6ec")
const ink = token("foreground", "#2a231a")
const red = token("primary", "#b8322a")
const fir = token("secondary", "#1e4d31")
const gold = token("accent", "#c49a3a")
const mixed = (a: THREE.Color, b: THREE.Color, amount: number) => a.clone().lerp(b, amount).getStyle()

export const P = {
  porcelain: porcelain.getStyle(),
  cream: mixed(porcelain, gold, 0.07),
  red: red.getStyle(),
  redDeep: mixed(red, ink, 0.36),
  fir: fir.getStyle(),
  firDeep: mixed(fir, ink, 0.4),
  gold: gold.getStyle(),
  goldSoft: mixed(gold, porcelain, 0.14),
  sand: mixed(porcelain, gold, 0.32),
  shadow: ink.getStyle(),
  studio: mixed(ink, porcelain, 0.22),
  fill: mixed(porcelain, gold, 0.1),
}
