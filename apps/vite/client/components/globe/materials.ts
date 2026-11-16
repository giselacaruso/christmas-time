import * as THREE from "three"
import { P } from "./palette"

function makeCanvas(size: number, draw: (g: CanvasRenderingContext2D, size: number) => void) {
  const c = document.createElement("canvas")
  c.width = size
  c.height = size
  const g = c.getContext("2d")
  if (g) draw(g, size)
  return c
}

function toTexture(c: HTMLCanvasElement, srgb: boolean) {
  const t = new THREE.CanvasTexture(c)
  t.wrapS = THREE.RepeatWrapping
  t.wrapT = THREE.RepeatWrapping
  t.anisotropy = 8
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  return t
}

// Seeded random so every reload gets the same "kiln batch".
let seed = 1337
function rnd() {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

// Draw a blob that wraps around tile edges so the texture stays seamless.
function wrapBlob(g: CanvasRenderingContext2D, s: number, x: number, y: number, r: number, inner: string, outer: string) {
  for (const ox of [-s, 0, s]) {
    for (const oy of [-s, 0, s]) {
      const cx = x + ox
      const cy = y + oy
      if (cx + r < 0 || cy + r < 0 || cx - r > s || cy - r > s) continue
      const grad = g.createRadialGradient(cx, cy, 0, cx, cy, r)
      grad.addColorStop(0, inner)
      grad.addColorStop(1, outer)
      g.fillStyle = grad
      g.fillRect(cx - r, cy - r, r * 2, r * 2)
    }
  }
}

// ── Height field of the glaze: orange-peel, pinholes, crawled ridges, drip runs ──
const HEIGHT = makeCanvas(512, (g, s) => {
  g.fillStyle = "rgb(128,128,128)"
  g.fillRect(0, 0, s, s)
  // large, very soft glaze-thickness waves
  for (let i = 0; i < 70; i++) {
    const v = rnd() > 0.5 ? 255 : 0
    wrapBlob(g, s, rnd() * s, rnd() * s, 40 + rnd() * 90, `rgba(${v},${v},${v},0.06)`, `rgba(${v},${v},${v},0)`)
  }
  // orange-peel dimples
  for (let i = 0; i < 1400; i++) {
    const v = rnd() > 0.5 ? 255 : 0
    wrapBlob(g, s, rnd() * s, rnd() * s, 3 + rnd() * 7, `rgba(${v},${v},${v},0.07)`, `rgba(${v},${v},${v},0)`)
  }
  // vertical drip runs where glaze flowed in the kiln
  for (let i = 0; i < 26; i++) {
    const x = rnd() * s
    const y = rnd() * s
    const len = 30 + rnd() * 90
    const w = 2 + rnd() * 4
    const grad = g.createLinearGradient(x, y, x, y + len)
    grad.addColorStop(0, "rgba(255,255,255,0)")
    grad.addColorStop(0.7, "rgba(255,255,255,0.12)")
    grad.addColorStop(1, "rgba(255,255,255,0)")
    g.fillStyle = grad
    g.beginPath()
    g.ellipse(x, y + len / 2, w, len / 2, 0, 0, Math.PI * 2)
    g.fill()
  }
  // pinholes: tiny craters from escaping gas
  for (let i = 0; i < 240; i++) {
    const x = rnd() * s
    const y = rnd() * s
    const r = 0.6 + rnd() * 1.4
    g.fillStyle = "rgba(0,0,0,0.55)"
    g.beginPath()
    g.arc(x, y, r, 0, Math.PI * 2)
    g.fill()
    g.strokeStyle = "rgba(255,255,255,0.25)"
    g.lineWidth = 0.8
    g.beginPath()
    g.arc(x, y, r + 0.8, 0, Math.PI * 2)
    g.stroke()
  }
})

// Derive a gentle tangent-space normal map from the height field (Sobel).
function normalFromHeight(src: HTMLCanvasElement, strength: number) {
  const s = src.width
  const hd = src.getContext("2d")?.getImageData(0, 0, s, s).data
  return makeCanvas(s, (g) => {
    if (!hd) return
    const out = g.createImageData(s, s)
    const h = (x: number, y: number) => hd[(((y + s) % s) * s + ((x + s) % s)) * 4] / 255
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const dx = (h(x + 1, y - 1) + 2 * h(x + 1, y) + h(x + 1, y + 1) - h(x - 1, y - 1) - 2 * h(x - 1, y) - h(x - 1, y + 1)) * strength
        const dy = (h(x - 1, y + 1) + 2 * h(x, y + 1) + h(x + 1, y + 1) - h(x - 1, y - 1) - 2 * h(x, y - 1) - h(x + 1, y - 1)) * strength
        const len = Math.hypot(dx, dy, 1)
        const i = (y * s + x) * 4
        out.data[i] = ((-dx / len) * 0.5 + 0.5) * 255
        out.data[i + 1] = ((dy / len) * 0.5 + 0.5) * 255
        out.data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255
        out.data[i + 3] = 255
      }
    }
    g.putImageData(out, 0, 0)
  })
}
const NORMAL = normalFromHeight(HEIGHT, 2.2)

// Low-frequency roughness variation belongs to the clay underneath the glaze.
const ROUGH = makeCanvas(256, (g, s) => {
  g.fillStyle = "rgb(150,150,150)"
  g.fillRect(0, 0, s, s)
  for (let i = 0; i < 110; i++) {
    const v = rnd() > 0.55 ? 225 : 70
    wrapBlob(g, s, rnd() * s, rnd() * s, 6 + rnd() * 28, `rgba(${v},${v},${v},0.16)`, `rgba(${v},${v},${v},0)`)
  }
  for (let i = 0; i < 2600; i++) {
    const v = 120 + rnd() * 70
    g.fillStyle = `rgba(${v},${v},${v},0.22)`
    g.fillRect(rnd() * s, rnd() * s, 1, 1)
  }
})

// Stoneware: iron speckles + glaze pooling tones.
const SPECKLE = makeCanvas(512, (g, s) => {
  g.fillStyle = "#ffffff"
  g.fillRect(0, 0, s, s)
  for (let i = 0; i < 55; i++) {
    wrapBlob(g, s, rnd() * s, rnd() * s, 24 + rnd() * 70, "rgba(206,178,132,0.05)", "rgba(206,178,132,0)")
  }
  for (let i = 0; i < 900; i++) {
    g.fillStyle = `rgba(${90 + rnd() * 50},${62 + rnd() * 30},40,${0.06 + rnd() * 0.16})`
    g.beginPath()
    g.arc(rnd() * s, rnd() * s, 0.3 + rnd() * 1.1, 0, Math.PI * 2)
    g.fill()
  }
})

// Coloured glazes: subtle thick/thin tonal variation so reds & greens aren't flat.
const POOL = makeCanvas(512, (g, s) => {
  g.fillStyle = "#ffffff"
  g.fillRect(0, 0, s, s)
  for (let i = 0; i < 80; i++) {
    const dark = rnd() > 0.45
    const c = dark ? "40,22,14" : "255,240,215"
    wrapBlob(g, s, rnd() * s, rnd() * s, 18 + rnd() * 60, `rgba(${c},${dark ? 0.1 : 0.08})`, `rgba(${c},0)`)
  }
  for (let i = 0; i < 260; i++) {
    g.fillStyle = `rgba(30,18,10,${0.08 + rnd() * 0.12})`
    g.beginPath()
    g.arc(rnd() * s, rnd() * s, 0.4 + rnd() * 0.8, 0, Math.PI * 2)
    g.fill()
  }
})

// Each material gets its own UV offset/scale so neighbouring pieces never look stamped.
function variant(c: HTMLCanvasElement, srgb: boolean, repeat: number) {
  const t = toTexture(c, srgb)
  t.repeat.set(repeat, repeat)
  t.offset.set(rnd(), rnd())
  return t
}

interface CeramicOpts {
  speckled?: boolean
  roughness?: number
  side?: THREE.Side
}

function ceramic(color: string, { speckled = true, roughness = 0.28, side = THREE.FrontSide }: CeramicOpts = {}) {
  const repeat = 1.4 + rnd() * 0.8
  const normal = variant(NORMAL, false, repeat)
  return new THREE.MeshPhysicalMaterial({
    color,
    map: variant(speckled ? SPECKLE : POOL, true, repeat),
    roughness,
    roughnessMap: variant(ROUGH, false, repeat),
    normalMap: normal,
    normalScale: new THREE.Vector2(0.075, 0.075),
    metalness: 0,
    // A continuous, smooth glaze over slightly irregular fired clay. Broad
    // studio sources soften the highlight without making the glaze look matte.
    ior: 1.5,
    clearcoat: 1,
    clearcoatRoughness: 0.065,
    clearcoatNormalMap: normal,
    clearcoatNormalScale: new THREE.Vector2(0.025, 0.025),
    specularIntensity: 1,
    specularColor: new THREE.Color(1, 1, 1),
    sheen: 0,
    envMapIntensity: 1.25,
    side,
  })
}

function lustre(color: string, roughness = 0.22) {
  const repeat = 1.6 + rnd() * 0.6
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 1,
    roughness,
    roughnessMap: variant(ROUGH, false, repeat),
    normalMap: variant(NORMAL, false, repeat),
    normalScale: new THREE.Vector2(0.07, 0.07),
    clearcoat: 0.65,
    clearcoatRoughness: 0.085,
    envMapIntensity: 1.35,
  })
}

// Bright white glaze for the scene pieces: crisp contrast against the reds
// and greens instead of a cream cast.
const WHITE = new THREE.Color(P.porcelain).lerp(new THREE.Color(1, 1, 1), 0.92).getStyle()

// Richer glaze colour for the pieces inside the globe: same four hue families,
// pushed in saturation so they read through the glass and studio reflections.
function rich(color: string, saturation: number, lightness = 0) {
  const c = new THREE.Color(color)
  const hsl = { h: 0, s: 0, l: 0 }
  c.getHSL(hsl)
  c.setHSL(hsl.h, Math.min(1, hsl.s * saturation), Math.min(1, Math.max(0, hsl.l + lightness)))
  return c.getStyle()
}

export const M = {
  cream: ceramic(WHITE),
  creamDouble: ceramic(WHITE, { side: THREE.DoubleSide }),
  ivory: ceramic(WHITE, { roughness: 0.36 }),
  snow: new THREE.MeshPhysicalMaterial({
    color: WHITE,
    roughness: 0.82,
    normalMap: variant(NORMAL, false, 7),
    normalScale: new THREE.Vector2(0.18, 0.18),
    clearcoat: 0.08,
    envMapIntensity: 0.65,
  }),
  red: ceramic(rich(P.red, 1.35, 0.02), { speckled: false, roughness: 0.22 }),
  redDeep: ceramic(rich(P.redDeep, 1.6), { speckled: false, roughness: 0.3 }),
  green: ceramic(rich(P.fir, 1.45, 0.03), { speckled: false, roughness: 0.22 }),
  greenDeep: ceramic(rich(P.firDeep, 1.6), { speckled: false, roughness: 0.3 }),
  sand: ceramic(rich(P.sand, 1.4), { roughness: 0.55 }),
  gold: lustre(rich(P.gold, 1.3)),
  goldSoft: lustre(rich(P.goldSoft, 1.3), 0.38),
}

export const flakeMaterial = new THREE.MeshPhysicalMaterial({
  color: WHITE,
  emissive: WHITE,
  emissiveIntensity: 0.08,
  roughness: 0.62,
  clearcoat: 0.15,
  clearcoatRoughness: 0.2,
})

export const glitterMaterial = new THREE.MeshStandardMaterial({
  color: P.porcelain,
  metalness: 0.52,
  roughness: 0.3,
  flatShading: true,
  side: THREE.DoubleSide,
})
