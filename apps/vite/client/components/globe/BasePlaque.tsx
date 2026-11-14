import { useEffect, useMemo } from "react"
import * as THREE from "three"
import { M } from "./materials"
import { P } from "./palette"
import { Ball } from "./primitives"

const INSCRIPTION = "Christmas Time"
const WIDTH = 2048
const HEIGHT = 512
const PLAQUE_WIDTH = 0.98
const PLAQUE_HEIGHT = 0.23

function makePlaqueGeometry() {
  const x = -PLAQUE_WIDTH / 2
  const y = -PLAQUE_HEIGHT / 2
  const r = 0.018
  const shape = new THREE.Shape()
  shape.moveTo(x + r, y)
  shape.lineTo(-x - r, y)
  shape.quadraticCurveTo(-x, y, -x, y + r)
  shape.lineTo(-x, -y - r)
  shape.quadraticCurveTo(-x, -y, -x - r, -y)
  shape.lineTo(x + r, -y)
  shape.quadraticCurveTo(x, -y, x, -y - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.018,
    bevelEnabled: true,
    bevelThickness: 0.005,
    bevelSize: 0.005,
    bevelSegments: 5,
    curveSegments: 12,
    steps: 1,
  })
  geometry.translate(0, 0, -0.009)
  // The inscription belongs to the metal cap itself, not a decal above it.
  const positions = geometry.getAttribute("position")
  const uv = geometry.getAttribute("uv")
  for (let i = 0; i < positions.count; i++) {
    uv.setXY(i, positions.getX(i) / PLAQUE_WIDTH + 0.5, positions.getY(i) / PLAQUE_HEIGHT + 0.5)
  }
  uv.needsUpdate = true
  return geometry
}

function makeMap(srgb = false) {
  const canvas = document.createElement("canvas")
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const texture = new THREE.CanvasTexture(canvas)
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return { canvas, texture }
}

export function BasePlaque() {
  const geometry = useMemo(makePlaqueGeometry, [])
  const engraving = useMemo(() => {
    const color = makeMap(true)
    const height = makeMap()
    const roughness = makeMap()
    const material = new THREE.MeshPhysicalMaterial({
      map: color.texture,
      bumpMap: height.texture,
      // Dark strokes in the height field cut INTO the gold surface.
      bumpScale: 0.004,
      roughnessMap: roughness.texture,
      roughness: 1,
      metalness: 1,
      clearcoat: 0.14,
      clearcoatRoughness: 0.28,
      envMapIntensity: 1.25,
    })
    return { color, height, roughness, material }
  }, [])

  useEffect(() => {
    let live = true
    const family = getComputedStyle(document.documentElement).getPropertyValue("--ds-font-cormorant-garamond").trim()
    const font = `italic 500 280px ${family}`
    const mask = document.createElement("canvas")
    mask.width = WIDTH
    mask.height = HEIGHT

    const draw = () => {
      if (!live) return
      const g = mask.getContext("2d", { willReadFrequently: true })
      if (!g) return
      g.clearRect(0, 0, WIDTH, HEIGHT)
      g.save()
      g.font = font
      g.fillStyle = "white"
      g.strokeStyle = "white"
      g.lineCap = "round"
      g.lineJoin = "round"
      const textWidth = g.measureText(INSCRIPTION).width
      const scale = Math.min(1, 1640 / (textWidth + 100))
      g.translate((WIDTH - textWidth * scale) / 2 - 20, 328)
      g.scale(scale, 1)
      // A more flowing calligraphic slant, using the loaded system typeface.
      g.transform(1, 0, -0.18, 1, 0, 0)
      g.fillText(INSCRIPTION, 0, 0)

      // Fine baseline joins give the engraving a connected, handwritten rhythm;
      // ornaments stay within the lettering, with no underline beneath it.
      g.lineWidth = 2.2
      let pen = 0
      const letters = [...INSCRIPTION]
      letters.forEach((letter, index) => {
        const end = g.measureText(INSCRIPTION.slice(0, index + 1)).width
        const advance = end - pen
        const next = letters[index + 1]
        if (next && letter !== " " && next !== " ") {
          g.beginPath()
          g.moveTo(pen + advance * 0.68, -8)
          g.bezierCurveTo(pen + advance * 0.91, -3, pen + advance + 8, -24, pen + advance + 18, -49)
          g.stroke()
        }
        pen = end
      })
      g.lineWidth = 2.8
      g.beginPath()
      // Looped entrance into the capital C.
      g.moveTo(99, -153)
      g.bezierCurveTo(17, -201, -91, -84, -39, -54)
      g.bezierCurveTo(-13, -37, 34, -60, 43, -84)
      g.stroke()
      g.restore()

      const source = g.getImageData(0, 0, WIDTH, HEIGHT).data
      const cg = engraving.color.canvas.getContext("2d")
      const hg = engraving.height.canvas.getContext("2d")
      const rg = engraving.roughness.canvas.getContext("2d")
      if (!cg || !hg || !rg) return
      const color = cg.createImageData(WIDTH, HEIGHT)
      const height = hg.createImageData(WIDTH, HEIGHT)
      const roughness = rg.createImageData(WIDTH, HEIGHT)
      const gold = new THREE.Color(P.goldSoft).convertLinearToSRGB()
      const cutGold = new THREE.Color(P.gold).lerp(new THREE.Color(P.shadow), 0.48).convertLinearToSRGB()
      const sample = (x: number, y: number) => source[(Math.max(0, Math.min(HEIGHT - 1, y)) * WIDTH + Math.max(0, Math.min(WIDTH - 1, x))) * 4 + 3] / 255
      for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
          const i = (y * WIDTH + x) * 4
          const cut = source[i + 3] / 255
          const grain = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
          const noise = (grain - Math.floor(grain) - 0.5) * 0.025
          const brush = Math.sin(y * 2.3 + Math.sin(x * 0.014) * 0.25) * 0.007
          // Subtle cavity shading supplements real moving-light bump normals;
          // no red ink, raised lettering, or separate transparent text surface.
          const lip = (sample(x - 1, y - 1) - sample(x + 1, y + 1)) * 0.065
          for (let c = 0; c < 3; c++) {
            const channel = c === 0 ? "r" : c === 1 ? "g" : "b"
            color.data[i + c] = THREE.MathUtils.clamp(gold[channel] * (1 - cut) + cutGold[channel] * cut + noise + brush + lip, 0, 1) * 255
            height.data[i + c] = THREE.MathUtils.clamp(0.86 - cut * 0.72 + noise * 0.22 + brush * 0.4, 0, 1) * 255
            roughness.data[i + c] = (0.36 + cut * 0.24 + noise + brush) * 255
          }
          color.data[i + 3] = height.data[i + 3] = roughness.data[i + 3] = 255
        }
      }
      cg.putImageData(color, 0, 0)
      hg.putImageData(height, 0, 0)
      rg.putImageData(roughness, 0, 0)
      engraving.color.texture.needsUpdate = true
      engraving.height.texture.needsUpdate = true
      engraving.roughness.texture.needsUpdate = true
    }
    draw()
    document.fonts.load(font).then(draw).catch(() => undefined)
    return () => { live = false }
  }, [engraving])

  useEffect(() => () => {
    geometry.dispose()
    engraving.material.dispose()
    engraving.color.texture.dispose()
    engraving.height.texture.dispose()
    engraving.roughness.texture.dispose()
  }, [engraving, geometry])

  return (
    <group position={[0, -1.52, 1.412]} rotation={[-0.245, 0, 0]} name="Christmas Time — grabado en bajo relieve sobre oro cepillado">
      <mesh geometry={geometry} material={[engraving.material, M.gold]} castShadow receiveShadow />
      <Ball p={[-0.45, 0, 0.017]} r={0.009} s={[1, 1, 0.35]} m={M.goldSoft} />
      <Ball p={[0.45, 0, 0.017]} r={0.009} s={[1, 1, 0.35]} m={M.goldSoft} />
    </group>
  )
}
