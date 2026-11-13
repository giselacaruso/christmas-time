import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import * as THREE from "three"
import { M } from "./materials"

export type V3 = [number, number, number]

interface BlockProps {
  p: V3
  s: V3
  m?: THREE.Material
  r?: V3
  round?: number
}

export function Block({ p, s, m = M.cream, r = [0, 0, 0], round }: BlockProps) {
  const rad = round ?? Math.min(s[0], s[1], s[2]) * 0.18
  return <RoundedBox args={s} radius={rad} smoothness={3} position={p} rotation={r} material={m} castShadow receiveShadow />
}

interface CylProps {
  p: V3
  rt: number
  rb: number
  h: number
  seg?: number
  m?: THREE.Material
  r?: V3
}

export function Cyl({ p, rt, rb, h, seg = 32, m = M.cream, r = [0, 0, 0] }: CylProps) {
  return (
    <mesh position={p} rotation={r} material={m} castShadow receiveShadow>
      <cylinderGeometry args={[rt, rb, h, seg]} />
    </mesh>
  )
}

interface BallProps {
  p: V3
  r: number
  m?: THREE.Material
  s?: V3
  rot?: V3
}

export function Ball({ p, r, m = M.cream, s = [1, 1, 1], rot = [0, 0, 0] }: BallProps) {
  return (
    <mesh position={p} scale={s} rotation={rot} material={m} castShadow receiveShadow>
      <sphereGeometry args={[r, 40, 28]} />
    </mesh>
  )
}

export function Tree({ p, h = 0.6, snow = false }: { p: V3; h?: number; snow?: boolean }) {
  const tiers = [0, 1, 2]
  const baubles = [
    [0, 0.2],
    [2.1, 0.2],
    [4.2, 0.2],
    [1.0, 0.45],
    [3.2, 0.45],
    [5.3, 0.45],
    [2.4, 0.66],
  ]
  return (
    <group position={p}>
      <Cyl p={[0, h * 0.08, 0]} rt={h * 0.05} rb={h * 0.065} h={h * 0.16} m={M.goldSoft} />
      {tiers.map((k) => {
        const H = h * 0.42
        const R = h * (0.36 - k * 0.085)
        const y = h * (0.32 + k * 0.2)
        return (
          <group key={k}>
            <Cyl p={[0, y, 0]} rt={0} rb={R} h={H} seg={28} m={M.green} />
            {snow && <Cyl p={[0, y + H * 0.5 - H * 0.2, 0]} rt={0} rb={R * 0.42} h={H * 0.4} seg={28} m={M.ivory} />}
          </group>
        )
      })}
      {baubles.map(([a, t], i) => {
        const y = h * (0.18 + t * 0.85)
        const rad = h * 0.36 * (1 - t * 0.78) * 0.82
        return <Ball key={i} p={[Math.sin(a) * rad, y, Math.cos(a) * rad]} r={h * 0.035} m={i % 3 === 0 ? M.gold : M.red} />
      })}
      <mesh position={[0, h * 0.97, 0]} material={M.gold} castShadow>
        <octahedronGeometry args={[h * 0.07, 0]} />
      </mesh>
    </group>
  )
}

export function Palm({ p, h = 0.7, lean = 0.12, rotY = 0 }: { p: V3; h?: number; lean?: number; rotY?: number }) {
  const segs = 7
  const leaves = [0, 1, 2, 3, 4, 5, 6]
  const top: V3 = [lean * h, h, 0]
  return (
    <group position={p} rotation={[0, rotY, 0]}>
      {Array.from({ length: segs }).map((_, i) => {
        const t = (i + 0.5) / segs
        const x = lean * h * t * t
        const r = 0.04 - t * 0.014
        return <Cyl key={i} p={[x, t * h, 0]} rt={r * 0.85} rb={r} h={h / segs + 0.01} seg={16} r={[0, 0, -lean * t * 1.6]} m={M.sand} />
      })}
      <group position={top}>
        {leaves.map((i) => (
          <group key={i} rotation={[0, (i / leaves.length) * Math.PI * 2, 0]}>
            <Ball p={[0.15, -0.03, 0]} r={0.16} s={[1, 0.11, 0.32]} rot={[0, 0, -0.45]} m={M.green} />
          </group>
        ))}
        <Ball p={[0.03, -0.04, 0.03]} r={0.032} m={M.goldSoft} />
        <Ball p={[-0.03, -0.04, 0.02]} r={0.03} m={M.goldSoft} />
      </group>
    </group>
  )
}

export function SunOrnament({ p, r = 0.2 }: { p: V3; r?: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z -= dt * 0.25
  })
  const rays = Array.from({ length: 12 })
  return (
    <group position={p}>
      <Ball p={[0, 0, 0]} r={r} m={M.gold} />
      <group ref={ref}>
        {rays.map((_, i) => (
          <group key={i} rotation={[0, 0, (i / rays.length) * Math.PI * 2]}>
            <Cyl p={[0, r * 1.5, 0]} rt={0} rb={r * (i % 2 ? 0.12 : 0.16)} h={r * (i % 2 ? 0.45 : 0.7)} seg={12} m={M.gold} />
          </group>
        ))}
      </group>
    </group>
  )
}

interface HouseProps {
  p: V3
  w?: number
  h?: number
  d?: number
  roof?: THREE.Material
  rotY?: number
}

export function House({ p, w = 0.24, h = 0.2, d = 0.2, roof = M.red, rotY = 0 }: HouseProps) {
  const rr = (d * 1.12) / 1.732
  return (
    <group position={p} rotation={[0, rotY, 0]}>
      <Block p={[0, h / 2, 0]} s={[w, h, d]} />
      <mesh position={[0, h + rr * 0.5, 0]} rotation={[0, 0, Math.PI / 2]} material={roof} castShadow receiveShadow>
        <cylinderGeometry args={[rr, rr, w * 1.1, 3, 1, false, Math.PI / 2]} />
      </mesh>
      <Block p={[0, h * 0.28, d / 2 + 0.004]} s={[w * 0.22, h * 0.5, 0.012]} m={M.gold} />
      <Block p={[-w * 0.3, h * 0.62, d / 2 + 0.004]} s={[w * 0.16, h * 0.22, 0.01]} m={M.goldSoft} />
      <Block p={[w * 0.3, h * 0.62, d / 2 + 0.004]} s={[w * 0.16, h * 0.22, 0.01]} m={M.goldSoft} />
    </group>
  )
}

export function Lamp({ p, h = 0.28 }: { p: V3; h?: number }) {
  return (
    <group position={p}>
      <Cyl p={[0, h / 2, 0]} rt={0.008} rb={0.012} h={h} seg={10} m={M.gold} />
      <Ball p={[0, h + 0.02, 0]} r={0.028} m={M.ivory} />
    </group>
  )
}

export function Cypress({ p, h = 0.4 }: { p: V3; h?: number }) {
  return (
    <group position={p}>
      <Cyl p={[0, 0.03, 0]} rt={0.012} rb={0.016} h={0.06} seg={10} m={M.goldSoft} />
      <Ball p={[0, 0.05 + h / 2, 0]} r={h / 6} s={[1, 3, 1]} m={M.greenDeep} />
    </group>
  )
}

const ONION = [
  [0, 0],
  [0.55, 0],
  [0.86, 0.18],
  [1, 0.45],
  [0.94, 0.72],
  [0.7, 0.98],
  [0.4, 1.22],
  [0.15, 1.45],
  [0.04, 1.62],
  [0, 1.7],
]

export function Onion({ p, R, m = M.gold }: { p: V3; R: number; m?: THREE.Material }) {
  const geo = useMemo(
    () => new THREE.LatheGeometry(ONION.map(([x, y]) => new THREE.Vector2(x * R, y * R)), 40),
    [R],
  )
  return (
    <group position={p}>
      <mesh geometry={geo} material={m} castShadow receiveShadow />
      <Cyl p={[0, R * 1.85, 0]} rt={0.003} rb={0.008} h={R * 0.5} seg={8} m={M.gold} />
    </group>
  )
}

export function Snowman({ p }: { p: V3 }) {
  return (
    <group position={p}>
      <Ball p={[0, 0.08, 0]} r={0.09} m={M.ivory} />
      <Ball p={[0, 0.2, 0]} r={0.065} m={M.ivory} />
      <mesh position={[0, 0.165, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.red} castShadow>
        <torusGeometry args={[0.052, 0.014, 12, 32]} />
      </mesh>
      <Cyl p={[0, 0.262, 0]} rt={0.06} rb={0.06} h={0.012} m={M.greenDeep} />
      <Cyl p={[0, 0.3, 0]} rt={0.038} rb={0.04} h={0.07} m={M.greenDeep} />
      <Cyl p={[0, 0.21, 0.07]} rt={0} rb={0.01} h={0.05} seg={10} r={[Math.PI / 2, 0, 0]} m={M.gold} />
    </group>
  )
}
