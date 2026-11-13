import { useEffect, useMemo, useRef } from "react"
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
  const rad = round ?? Math.min(s[0], s[1], s[2]) * 0.22
  return <RoundedBox args={s} radius={rad} smoothness={5} position={p} rotation={r} material={m} castShadow receiveShadow />
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
  const geometry = useMemo(() => {
    // Keep architectural pyramids polygonal, but roll the edges of turned
    // ceramic pieces so the glaze catches a continuous highlight at the lip.
    if (seg < 12) return new THREE.CylinderGeometry(rt, rb, h, seg)
    const b = Math.min(h * 0.12, Math.max(rt, rb) * 0.12)
    const profile = new THREE.Path()
    profile.moveTo(0, -h / 2)
    profile.lineTo(Math.max(0, rb - b), -h / 2)
    profile.quadraticCurveTo(rb, -h / 2, rb, -h / 2 + b)
    if (rt > b) {
      profile.lineTo(rt, h / 2 - b)
      profile.quadraticCurveTo(rt, h / 2, rt - b, h / 2)
    } else {
      profile.lineTo(Math.max(rt, b * 0.2), h / 2 - b * 0.5)
      profile.quadraticCurveTo(rt, h / 2, 0, h / 2)
    }
    profile.lineTo(0, h / 2)
    return new THREE.LatheGeometry(profile.getPoints(6), Math.max(48, seg))
  }, [rt, rb, h, seg])
  useEffect(() => () => geometry.dispose(), [geometry])
  return (
    <mesh position={p} rotation={r} geometry={geometry} material={m} castShadow receiveShadow />
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

const TREE_PROFILE = [
  [0, 0.1], [0.26, 0.1], [0.335, 0.125], [0.34, 0.15],
  [0.3, 0.205], [0.21, 0.32], [0.165, 0.385],
  [0.245, 0.365], [0.26, 0.395], [0.225, 0.46],
  [0.14, 0.585], [0.11, 0.635], [0.17, 0.62],
  [0.176, 0.65], [0.135, 0.73], [0.05, 0.875], [0, 0.965],
]

export function ChristmasStar({ p, r = 0.06 }: { p: V3; r?: number }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    for (let i = 0; i < 10; i++) {
      const a = Math.PI / 2 + i * Math.PI / 5
      const radius = r * (i % 2 ? 0.44 : 1)
      const x = Math.cos(a) * radius
      const y = Math.sin(a) * radius
      if (i === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    }
    shape.closePath()
    return new THREE.ExtrudeGeometry(shape, { depth: r * 0.2, bevelEnabled: true, bevelThickness: r * 0.07, bevelSize: r * 0.07, bevelSegments: 3, steps: 1 })
  }, [r])
  useEffect(() => () => geometry.dispose(), [geometry])
  return <mesh position={p} geometry={geometry} material={M.gold} castShadow receiveShadow />
}

function treeRadius(y: number) {
  let radius = 0
  for (let i = 1; i < TREE_PROFILE.length; i++) {
    const [a, ya] = TREE_PROFILE[i - 1]
    const [b, yb] = TREE_PROFILE[i]
    if (y >= Math.min(ya, yb) && y <= Math.max(ya, yb) && ya !== yb) {
      radius = Math.max(radius, THREE.MathUtils.lerp(a, b, (y - ya) / (yb - ya)))
    }
  }
  return radius
}

export function Tree({ p, h = 0.6, snow = false }: { p: V3; h?: number; snow?: boolean }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      TREE_PROFILE.map(([radius, y]) => new THREE.Vector3(radius * h, y * h, 0)),
      false, "centripetal",
    )
    return new THREE.LatheGeometry(curve.getPoints(160).map((v) => new THREE.Vector2(Math.max(0, v.x), v.y)), 64)
  }, [h])
  const ribbon = useMemo(() => {
    const points = Array.from({ length: 180 }, (_, i) => {
      const t = i / 179
      const y = 0.19 + t * 0.67
      const a = t * Math.PI * 7
      const r = h * (treeRadius(y) + 0.009)
      return new THREE.Vector3(Math.sin(a) * r, y * h, Math.cos(a) * r)
    })
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 180, h * 0.007, 5, false)
  }, [h])
  useEffect(() => () => { geometry.dispose(); ribbon.dispose() }, [geometry, ribbon])
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
      <mesh geometry={geometry} material={M.green} castShadow receiveShadow />
      <mesh geometry={ribbon} material={M.goldSoft} />
      {snow && <>
        <Ball p={[-h * 0.16, h * 0.29, h * 0.14]} r={h * 0.08} s={[1.5, 0.32, 0.8]} rot={[0.3, 0.4, -0.6]} m={M.snow} />
        <Ball p={[h * 0.12, h * 0.51, h * 0.1]} r={h * 0.065} s={[1.4, 0.32, 0.8]} rot={[0.3, -0.4, 0.6]} m={M.snow} />
        <Ball p={[-h * 0.04, h * 0.82, h * 0.035]} r={h * 0.04} s={[1, 1.4, 0.7]} rot={[0, 0, -0.5]} m={M.snow} />
      </>}
      {baubles.map(([a, t], i) => {
        const y = h * (0.18 + t * 0.85)
        const rad = h * (treeRadius(y / h) + 0.018)
        return <Ball key={i} p={[Math.sin(a) * rad, y, Math.cos(a) * rad]} r={h * 0.035} m={i % 3 === 0 ? M.gold : M.red} />
      })}
      <ChristmasStar p={[0, h * 0.99, 0]} r={h * 0.085} />
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
  const roofGeometry = useMemo(() => {
    const profile = new THREE.Shape()
    profile.moveTo(-d * 0.56, 0)
    profile.lineTo(d * 0.56, 0)
    profile.lineTo(0, rr * 1.5)
    profile.closePath()
    return new THREE.ExtrudeGeometry(profile, {
      depth: w * 1.06,
      bevelEnabled: true,
      bevelThickness: Math.min(w, d) * 0.025,
      bevelSize: Math.min(w, d) * 0.035,
      bevelSegments: 4,
      steps: 1,
    })
  }, [w, d, rr])
  useEffect(() => () => roofGeometry.dispose(), [roofGeometry])
  return (
    <group position={p} rotation={[0, rotY, 0]}>
      <Block p={[0, h / 2, 0]} s={[w, h, d]} />
      <mesh position={[-w * 0.53, h, 0]} rotation={[0, Math.PI / 2, 0]} geometry={roofGeometry} material={roof} castShadow receiveShadow />
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
