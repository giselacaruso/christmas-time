import * as THREE from "three"

// Resolve the applied design-system colors for Three, which cannot parse CSS var().
const styles = getComputedStyle(document.documentElement)
const swatch = document.createElement("canvas")
swatch.width = swatch.height = 1
const context = swatch.getContext("2d")!

function token(name: string) {
  context.clearRect(0, 0, 1, 1)
  context.fillStyle = styles.getPropertyValue(`--${name}`).trim()
  context.fillRect(0, 0, 1, 1)
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data
  return new THREE.Color(`rgb(${r}, ${g}, ${b})`)
}

const porcelain = token("background")
const ink = token("foreground")
const red = token("primary")
const fir = token("secondary")
const gold = token("accent")
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
