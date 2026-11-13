import * as THREE from "three"

function canvasTexture(size: number, draw: (g: CanvasRenderingContext2D, size: number) => void, srgb: boolean) {
  const c = document.createElement("canvas")
  c.width = size
  c.height = size
  const g = c.getContext("2d")
  if (g) draw(g, size)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = THREE.RepeatWrapping
  t.wrapT = THREE.RepeatWrapping
  t.anisotropy = 4
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  return t
}

// Tiny iron speckles + soft glaze pooling, like stoneware porcelain.
const speckle = canvasTexture(
  512,
  (g, s) => {
    g.fillStyle = "#ffffff"
    g.fillRect(0, 0, s, s)
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * s
      const y = Math.random() * s
      const r = 20 + Math.random() * 60
      const grad = g.createRadialGradient(x, y, 0, x, y, r)
      grad.addColorStop(0, "rgba(214,190,150,0.10)")
      grad.addColorStop(1, "rgba(214,190,150,0)")
      g.fillStyle = grad
      g.fillRect(x - r, y - r, r * 2, r * 2)
    }
    for (let i = 0; i < 1600; i++) {
      g.fillStyle = `rgba(${90 + Math.random() * 50},${62 + Math.random() * 30},${40},${0.12 + Math.random() * 0.3})`
      g.beginPath()
      g.arc(Math.random() * s, Math.random() * s, 0.3 + Math.random() * 1.1, 0, Math.PI * 2)
      g.fill()
    }
  },
  true,
)

// Glaze surface: gentle orange-peel undulation used for bump + roughness.
const glaze = canvasTexture(
  256,
  (g, s) => {
    g.fillStyle = "rgb(150,150,150)"
    g.fillRect(0, 0, s, s)
    for (let i = 0; i < 260; i++) {
      const x = Math.random() * s
      const y = Math.random() * s
      const r = 4 + Math.random() * 14
      const v = Math.random() > 0.5 ? 255 : 60
      const grad = g.createRadialGradient(x, y, 0, x, y, r)
      grad.addColorStop(0, `rgba(${v},${v},${v},0.12)`)
      grad.addColorStop(1, `rgba(${v},${v},${v},0)`)
      g.fillStyle = grad
      g.fillRect(x - r, y - r, r * 2, r * 2)
    }
    for (let i = 0; i < 3000; i++) {
      const v = 110 + Math.random() * 80
      g.fillStyle = `rgba(${v},${v},${v},0.25)`
      g.fillRect(Math.random() * s, Math.random() * s, 1, 1)
    }
  },
  false,
)

interface CeramicOpts {
  speckled?: boolean
  roughness?: number
  side?: THREE.Side
}

function ceramic(color: string, { speckled = true, roughness = 0.62, side = THREE.FrontSide }: CeramicOpts = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    map: speckled ? speckle : null,
    roughness,
    roughnessMap: glaze,
    bumpMap: glaze,
    bumpScale: 0.18,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.07,
    side,
  })
}

function lustre(color: string, roughness = 0.24) {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 1,
    roughness,
    roughnessMap: glaze,
    bumpMap: glaze,
    bumpScale: 0.12,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
  })
}

export const M = {
  cream: ceramic("#f1e6d0"),
  creamDouble: ceramic("#f1e6d0", { side: THREE.DoubleSide }),
  ivory: ceramic("#fbf7ef", { roughness: 0.7 }),
  red: ceramic("#a52d27", { speckled: false, roughness: 0.5 }),
  redDeep: ceramic("#741d1a", { speckled: false, roughness: 0.5 }),
  green: ceramic("#24553a", { speckled: false, roughness: 0.5 }),
  greenDeep: ceramic("#163a27", { speckled: false, roughness: 0.5 }),
  sand: ceramic("#dcc08a"),
  gold: lustre("#d6ab52"),
  goldSoft: lustre("#c99d4c", 0.38),
}

export const flakeMaterial = new THREE.MeshPhysicalMaterial({
  color: "#fdfaf3",
  roughness: 0.35,
  clearcoat: 1,
  clearcoatRoughness: 0.05,
})

export const glitterMaterial = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  metalness: 0.95,
  roughness: 0.14,
  flatShading: true,
  side: THREE.DoubleSide,
})
