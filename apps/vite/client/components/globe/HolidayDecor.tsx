import { useEffect, useMemo } from "react"
import * as THREE from "three"
import { M } from "./materials"
import { P } from "./palette"
import { Ball, Block, ChristmasStar, Cyl, type V3 } from "./primitives"

// All ornaments use the same fired glazes as the city miniatures.
export function Gift({ p, size = 0.14, green = false, rot = 0 }: { p: V3; size?: number; green?: boolean; rot?: number }) {
  return (
    <group position={p} rotation={[0, rot, 0]}>
      <Block p={[0, size / 2, 0]} s={[size, size, size * 0.85]} m={green ? M.green : M.red} />
      <Block p={[0, size * 0.53, 0]} s={[size * 0.16, size * 1.02, size * 0.88]} m={M.goldSoft} />
      <Block p={[0, size * 0.53, 0]} s={[size * 1.02, size * 1.02, size * 0.13]} m={M.goldSoft} />
      <Ball p={[-size * 0.15, size * 1.07, 0]} r={size * 0.16} s={[1, 0.45, 0.55]} rot={[0, 0, -0.35]} m={M.gold} />
      <Ball p={[size * 0.15, size * 1.07, 0]} r={size * 0.16} s={[1, 0.45, 0.55]} rot={[0, 0, 0.35]} m={M.gold} />
    </group>
  )
}

export function Wreath({ p, r = 0.07, rotY = 0 }: { p: V3; r?: number; rotY?: number }) {
  return (
    <group position={p} rotation={[0, rotY, 0]}>
      <mesh material={M.green} castShadow receiveShadow>
        <torusGeometry args={[r, r * 0.24, 10, 36]} />
      </mesh>
      <Ball p={[-r * 0.32, -r * 0.75, r * 0.17]} r={r * 0.35} s={[1, 0.65, 0.45]} rot={[0, 0, -0.4]} m={M.red} />
      <Ball p={[r * 0.32, -r * 0.75, r * 0.17]} r={r * 0.35} s={[1, 0.65, 0.45]} rot={[0, 0, 0.4]} m={M.red} />
      <Ball p={[r * 0.72, r * 0.58, r * 0.2]} r={r * 0.16} m={M.gold} />
      <Ball p={[-r * 0.72, r * 0.58, r * 0.2]} r={r * 0.16} m={M.gold} />
    </group>
  )
}

const bulbMaterial = new THREE.MeshStandardMaterial({ color: P.goldSoft, emissive: P.gold, emissiveIntensity: 0.55, roughness: 0.3, metalness: 0.2 })

export function Garland({ p, width = 0.6, drop = 0.12, rotY = 0, foliage = true }: { p: V3; width?: number; drop?: number; rotY?: number; foliage?: boolean }) {
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(new THREE.Vector3(-width / 2, 0, 0), new THREE.Vector3(0, -drop * 2, 0), new THREE.Vector3(width / 2, 0, 0)), [width, drop])
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 40, foliage ? 0.014 : 0.004, 6, false), [curve, foliage])
  useEffect(() => () => geometry.dispose(), [geometry])
  return (
    <group position={p} rotation={[0, rotY, 0]}>
      <mesh geometry={geometry} material={foliage ? M.green : M.gold} castShadow />
      {Array.from({ length: 15 }, (_, index) => {
        const point = curve.getPoint(index / 14)
        return <mesh key={index} position={[point.x, point.y - 0.013, point.z + 0.011]} material={index % 4 === 0 ? M.red : bulbMaterial}>
          <sphereGeometry args={[index % 4 === 0 ? 0.018 : 0.012, 10, 8]} />
        </mesh>
      })}
    </group>
  )
}

export function MarketStall({ p, rot = 0, snow = false }: { p: V3; rot?: number; snow?: boolean }) {
  return (
    <group position={p} rotation={[0, rot, 0]}>
      <Block p={[0, 0.1, 0]} s={[0.3, 0.2, 0.2]} m={M.red} />
      <Block p={[0, 0.21, 0.04]} s={[0.33, 0.025, 0.22]} m={M.cream} />
      <Cyl p={[-0.14, 0.31, 0.075]} rt={0.009} rb={0.011} h={0.2} m={M.gold} />
      <Cyl p={[0.14, 0.31, 0.075]} rt={0.009} rb={0.011} h={0.2} m={M.gold} />
      <Block p={[0, 0.43, 0.045]} s={[0.36, 0.035, 0.17]} r={[0.35, 0, 0]} m={snow ? M.ivory : M.green} />
      <Block p={[0, 0.43, -0.105]} s={[0.36, 0.035, 0.17]} r={[-0.35, 0, 0]} m={snow ? M.ivory : M.green} />
      <Garland p={[0, 0.385, 0.127]} width={0.32} drop={0.04} />
      <Cyl p={[-0.07, 0.247, 0.09]} rt={0.022} rb={0.018} h={0.05} m={M.ivory} />
      <Cyl p={[0.015, 0.247, 0.09]} rt={0.022} rb={0.018} h={0.05} m={M.red} />
      <Ball p={[0.09, 0.24, 0.08]} r={0.034} s={[1, 0.55, 1]} m={M.goldSoft} />
      <Wreath p={[0, 0.11, 0.105]} r={0.045} />
    </group>
  )
}

export function Sleigh({ p, rot = 0 }: { p: V3; rot?: number }) {
  return (
    <group position={p} rotation={[0, rot, 0]}>
      <Block p={[0, 0.1, 0]} s={[0.3, 0.055, 0.18]} m={M.red} />
      <Block p={[-0.135, 0.17, 0]} s={[0.035, 0.17, 0.2]} r={[0, 0, 0.15]} m={M.red} />
      <Block p={[0, 0.15, 0.09]} s={[0.29, 0.08, 0.025]} m={M.red} />
      <Block p={[0, 0.15, -0.09]} s={[0.29, 0.08, 0.025]} m={M.red} />
      <Block p={[0, 0.025, 0.1]} s={[0.34, 0.018, 0.018]} m={M.gold} />
      <Block p={[0, 0.025, -0.1]} s={[0.34, 0.018, 0.018]} m={M.gold} />
      <mesh position={[0.165, 0.06, 0.1]} material={M.gold} castShadow><torusGeometry args={[0.035, 0.009, 8, 24, Math.PI * 1.2]} /></mesh>
      <mesh position={[0.165, 0.06, -0.1]} material={M.gold} castShadow><torusGeometry args={[0.035, 0.009, 8, 24, Math.PI * 1.2]} /></mesh>
      <Gift p={[-0.045, 0.13, 0]} size={0.12} green />
      <Gift p={[0.075, 0.13, 0]} size={0.085} />
    </group>
  )
}

export function Rink({ p, scale = 1 }: { p: V3; scale?: number }) {
  return (
    <group position={p} scale={scale}>
      <Cyl p={[0, 0.018, 0]} rt={0.3} rb={0.31} h={0.036} m={M.ivory} />
      <mesh position={[0, 0.038, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.gold}>
        <torusGeometry args={[0.28, 0.008, 8, 56]} />
      </mesh>
      <group position={[0.06, 0.04, 0.03]} rotation={[0, -0.45, 0]}>
        <Cyl p={[0, 0.105, 0]} rt={0.021} rb={0.034} h={0.11} m={M.red} />
        <Ball p={[0, 0.19, 0]} r={0.035} m={M.cream} />
        <Block p={[0.016, 0.043, 0]} s={[0.016, 0.075, 0.018]} r={[0, 0, -0.3]} m={M.green} />
        <Block p={[-0.027, 0.043, 0]} s={[0.016, 0.075, 0.018]} r={[0, 0, 0.55]} m={M.green} />
        <Block p={[0, 0.14, 0]} s={[0.14, 0.02, 0.022]} r={[0, 0, 0.2]} m={M.red} />
        <Ball p={[0, 0.214, 0]} r={0.035} s={[1, 0.5, 1]} m={M.green} />
        <Block p={[0.045, 0.16, -0.01]} s={[0.07, 0.02, 0.016]} r={[0, 0, 0.1]} m={M.gold} />
      </group>
    </group>
  )
}

export function LightArch({ p, width = 0.58, h = 0.75, rot = 0 }: { p: V3; width?: number; h?: number; rot?: number }) {
  return (
    <group position={p} rotation={[0, rot, 0]}>
      <Cyl p={[-width / 2, (h - width / 2) / 2, 0]} rt={0.012} rb={0.018} h={h - width / 2} m={M.gold} />
      <Cyl p={[width / 2, (h - width / 2) / 2, 0]} rt={0.012} rb={0.018} h={h - width / 2} m={M.gold} />
      <mesh position={[0, h - width / 2, 0]} material={M.gold} castShadow><torusGeometry args={[width / 2, 0.012, 8, 48, Math.PI]} /></mesh>
      {Array.from({ length: 13 }, (_, index) => {
        const a = index / 12 * Math.PI
        return <mesh key={index} position={[Math.cos(a) * width / 2, h - width / 2 + Math.sin(a) * width / 2, 0.016]} material={bulbMaterial}><sphereGeometry args={[0.018, 10, 8]} /></mesh>
      })}
      <ChristmasStar p={[0, h - 0.11, 0]} r={0.065} />
    </group>
  )
}

export function NochebuenaTable({ p, rot = 0 }: { p: V3; rot?: number }) {
  return (
    <group position={p} rotation={[0, rot, 0]}>
      <Block p={[0, 0.13, 0]} s={[0.35, 0.025, 0.23]} m={M.ivory} />
      <Block p={[0, 0.1, 0]} s={[0.12, 0.1, 0.24]} m={M.red} />
      <Cyl p={[-0.13, 0.06, 0]} rt={0.012} rb={0.018} h={0.12} m={M.gold} />
      <Cyl p={[0.13, 0.06, 0]} rt={0.012} rb={0.018} h={0.12} m={M.gold} />
      <Cyl p={[0, 0.151, 0]} rt={0.065} rb={0.065} h={0.012} m={M.gold} />
      <Ball p={[0, 0.18, 0]} r={0.049} s={[1, 0.85, 1]} m={M.sand} />
      <Ball p={[0, 0.202, 0]} r={0.039} s={[1, 0.35, 1]} m={M.ivory} />
      <Cyl p={[-0.11, 0.18, 0.04]} rt={0.022} rb={0.012} h={0.045} m={M.gold} />
      <Cyl p={[0.11, 0.18, 0.04]} rt={0.022} rb={0.012} h={0.045} m={M.gold} />
      <Block p={[-0.23, 0.07, 0]} s={[0.09, 0.025, 0.11]} m={M.green} />
      <Block p={[0.23, 0.07, 0]} s={[0.09, 0.025, 0.11]} m={M.green} />
    </group>
  )
}

export function Nativity({ p, rot = 0 }: { p: V3; rot?: number }) {
  return (
    <group position={p} rotation={[0, rot, 0]}>
      <Block p={[0, 0.015, 0]} s={[0.35, 0.03, 0.22]} m={M.sand} />
      <Cyl p={[-0.15, 0.15, -0.06]} rt={0.014} rb={0.019} h={0.28} m={M.goldSoft} />
      <Cyl p={[0.15, 0.15, -0.06]} rt={0.014} rb={0.019} h={0.28} m={M.goldSoft} />
      <Block p={[-0.09, 0.32, -0.03]} s={[0.22, 0.025, 0.26]} r={[0, 0, 0.4]} m={M.red} />
      <Block p={[0.09, 0.32, -0.03]} s={[0.22, 0.025, 0.26]} r={[0, 0, -0.4]} m={M.red} />
      <Cyl p={[-0.085, 0.1, 0]} rt={0.022} rb={0.04} h={0.13} m={M.green} />
      <Ball p={[-0.085, 0.195, 0]} r={0.033} m={M.ivory} />
      <Cyl p={[0.085, 0.1, 0]} rt={0.022} rb={0.04} h={0.13} m={M.cream} />
      <Ball p={[0.085, 0.195, 0]} r={0.033} m={M.ivory} />
      <Ball p={[0, 0.06, 0.075]} r={0.045} s={[1, 0.45, 0.65]} m={M.gold} />
      <Ball p={[0, 0.078, 0.075]} r={0.024} s={[1, 0.55, 0.6]} m={M.ivory} />
      <ChristmasStar p={[0, 0.4, -0.01]} r={0.065} />
    </group>
  )
}

export function BeachUmbrella({ p }: { p: V3 }) {
  return (
    <group position={p}>
      <Cyl p={[0, 0.2, 0]} rt={0.009} rb={0.012} h={0.4} m={M.gold} />
      <Cyl p={[0, 0.41, 0]} rt={0.005} rb={0.18} h={0.09} seg={24} m={M.red} />
      <ChristmasStar p={[0, 0.49, 0]} r={0.042} />
      <Gift p={[0.045, 0, 0.07]} size={0.11} green />
      <Gift p={[-0.085, 0, 0.09]} size={0.08} />
    </group>
  )
}

export function Pinata({ p }: { p: V3 }) {
  return (
    <group position={p}>
      <Cyl p={[0, 0.13, 0]} rt={0.003} rb={0.003} h={0.26} seg={8} m={M.gold} />
      <Ball p={[0, 0, 0]} r={0.065} m={M.red} />
      {Array.from({ length: 7 }, (_, index) => (
        <group key={index} rotation={[0, 0, index / 7 * Math.PI * 2]}>
          <Cyl p={[0, 0.09, 0]} rt={0} rb={0.038} h={0.12} seg={12} m={index % 2 ? M.green : M.gold} />
        </group>
      ))}
      <Block p={[-0.03, -0.2, 0]} s={[0.012, 0.13, 0.008]} r={[0, 0, -0.15]} m={M.red} />
      <Block p={[0, -0.22, 0]} s={[0.012, 0.15, 0.008]} m={M.gold} />
      <Block p={[0.03, -0.2, 0]} s={[0.012, 0.13, 0.008]} r={[0, 0, 0.15]} m={M.green} />
    </group>
  )
}
