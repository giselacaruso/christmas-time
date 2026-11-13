import { useEffect, useMemo } from "react"
import * as THREE from "three"
import { M } from "./materials"
import { P } from "./palette"
import { Ball, Block } from "./primitives"

export function BasePlaque() {
  const lettering = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 1600
    canvas.height = 360
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    return { canvas, texture }
  }, [])

  useEffect(() => {
    let live = true
    const family = getComputedStyle(document.documentElement).getPropertyValue("--ds-font-cormorant-garamond").trim()
    const font = `italic 500 218px ${family}`
    const draw = () => {
      if (!live) return
      const g = lettering.canvas.getContext("2d")
      if (!g) return
      g.clearRect(0, 0, 1600, 360)
      g.font = font
      g.textAlign = "center"
      g.textBaseline = "middle"
      g.fillStyle = P.redDeep
      g.fillText("Christmas Time", 800, 163, 1420)
      // Fine engraved flourishes give the system's italic an heirloom signature.
      g.strokeStyle = P.redDeep
      g.lineWidth = 3.2
      g.lineCap = "round"
      g.beginPath()
      g.moveTo(450, 272)
      g.bezierCurveTo(620, 210, 1020, 309, 1240, 244)
      g.bezierCurveTo(1290, 227, 1300, 249, 1260, 259)
      g.moveTo(450, 272)
      g.bezierCurveTo(382, 296, 301, 272, 355, 247)
      g.stroke()
      lettering.texture.needsUpdate = true
    }
    document.fonts.load(font).then(draw).catch(draw)
    return () => { live = false; lettering.texture.dispose() }
  }, [lettering])

  return (
    <group position={[0, -1.52, 1.412]} rotation={[-0.245, 0, 0]} name="Christmas Time — chapita de oro grabada">
      <Block p={[0, 0, 0]} s={[0.98, 0.23, 0.028]} round={0.025} m={M.gold} />
      <mesh position={[0, 0, 0.0155]}>
        <planeGeometry args={[0.88, 0.198]} />
        <meshStandardMaterial map={lettering.texture} transparent alphaTest={0.06} depthWrite={false} roughness={0.64} metalness={0.15} />
      </mesh>
      <Ball p={[-0.45, 0, 0.017]} r={0.009} s={[1, 1, 0.35]} m={M.goldSoft} />
      <Ball p={[0.45, 0, 0.017]} r={0.009} s={[1, 1, 0.35]} m={M.goldSoft} />
    </group>
  )
}
