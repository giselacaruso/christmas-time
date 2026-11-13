import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject, type PointerEvent, type ReactNode } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { City } from "../../data/cities"
import { London, Moscow, NewYork, Paris } from "./ColdCities"
import { BuenosAires, Dubai, Rio, Rome, Sydney, Tokyo } from "./WarmCities"
import { Bangkok, Cancun, SanFrancisco, Toronto, Vienna } from "./NewCities"
import { M } from "./materials"
import { GlobeGlass, GroundShadow, StudioLights } from "./GlobeStudio"
import { P } from "./palette"
import { Particles } from "./Particles"
import { GROUND_R, GROUND_Y, createShake, floorAt, type ShakeState } from "./shake"

const SCENES: Record<string, () => JSX.Element> = {
  "nueva-york": NewYork,
  londres: London,
  paris: Paris,
  tokio: Tokyo,
  "buenos-aires": BuenosAires,
  roma: Rome,
  sidney: Sydney,
  moscu: Moscow,
  dubai: Dubai,
  rio: Rio,
  "san-francisco": SanFrancisco,
  cancun: Cancun,
  toronto: Toronto,
  bangkok: Bangkok,
  viena: Vienna,
}

const GROUND_MAT = { snow: M.snow, grass: M.green, sand: M.sand }

function makeBaseGeometry() {
  const profile = new THREE.Path()
  profile.moveTo(0, -1.9)
  profile.lineTo(1.49, -1.9)
  profile.quadraticCurveTo(1.565, -1.9, 1.565, -1.845)
  profile.quadraticCurveTo(1.565, -1.8, 1.52, -1.77)
  profile.lineTo(1.45, -1.7)
  profile.quadraticCurveTo(1.4, -1.62, 1.37, -1.47)
  profile.quadraticCurveTo(1.35, -1.4, 1.38, -1.35)
  profile.quadraticCurveTo(1.395, -1.32, 1.36, -1.28)
  profile.lineTo(1.3, -1.19)
  profile.quadraticCurveTo(1.27, -1.14, 1.27, -1.1)
  profile.quadraticCurveTo(1.27, -1.06, 1.22, -1.06)
  profile.lineTo(0, -1.06)
  return new THREE.LatheGeometry(profile.getPoints(12), 160)
}

const baseMat = M.red.clone()
baseMat.side = THREE.DoubleSide

function easeOutBack(x: number) {
  const c1 = 1.1
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

function Base() {
  const geo = useMemo(makeBaseGeometry, [])
  return (
    <group>
      <mesh geometry={geo} material={baseMat} castShadow receiveShadow />
      <mesh position={[0, -1.8, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.gold} castShadow>
        <torusGeometry args={[1.555, 0.026, 16, 160]} />
      </mesh>
      <mesh position={[0, -1.32, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.gold} castShadow>
        <torusGeometry args={[1.38, 0.02, 16, 160]} />
      </mesh>
      <mesh position={[0, -1.09, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.gold}>
        <torusGeometry args={[1.265, 0.018, 16, 160]} />
      </mesh>
      <mesh position={[0, -1.5, 1.388]} rotation={[-0.245, 0, 0]} material={M.gold} castShadow>
        <boxGeometry args={[0.56, 0.13, 0.02]} />
      </mesh>
      <mesh position={[0, (-1.08 + GROUND_Y) / 2, 0]} material={M.cream} receiveShadow>
        <cylinderGeometry args={[1.3, 1.3, GROUND_Y + 1.08, 96]} />
      </mesh>
    </group>
  )
}

interface Part {
  obj: THREE.Object3D
  baseY: number
  baseRz: number
  depth: number
  inDelay: number
  outDelay: number
  from: number
  cur: number
  sway: number
}

const OUT_DUR = 0.42
const IN_DUR = 0.85
const STAGGER = 0.06

function collectParts(root: THREE.Group): Part[] {
  const scene = root.children[0]
  if (!scene) return []
  const box = new THREE.Box3()
  const list = scene.children.map((obj) => {
    box.setFromObject(obj)
    const h = box.isEmpty() ? 0.5 : box.max.y - box.min.y
    const depth = h + Math.max(0, obj.position.y) + 0.3
    return {
      obj,
      // Seat each piece on the curved terrain instead of floating above its rim.
      baseY: obj.position.y + floorAt(obj.position.x, obj.position.z) - GROUND_Y - 0.148,
      baseRz: obj.rotation.z,
      depth,
      inDelay: 0,
      outDelay: 0,
      from: 0,
      cur: depth,
      sway: (Math.random() - 0.5) * 0.14,
      dist: Math.hypot(obj.position.x, obj.position.z),
    }
  })
  const order = [...list].sort((a, b) => a.dist - b.dist)
  order.forEach((p, rank) => {
    p.inDelay = rank * STAGGER
    p.outDelay = (order.length - 1 - rank) * STAGGER * 0.5
  })
  return list
}

function Stage({ city, shake }: { city: City; shake: MutableRefObject<ShakeState> }) {
  const [shown, setShown] = useState(city)
  const latest = useRef(city)
  latest.current = city
  const anim = useRef<{ t: number; phase: "swap" | "in" | "out" | "idle" }>({ t: 0, phase: "swap" })
  const parts = useRef<Part[]>([])
  const group = useRef<THREE.Group>(null)

  // Collect the new city's pieces and tuck each one under the ground, right where it stands.
  useLayoutEffect(() => {
    parts.current = group.current ? collectParts(group.current) : []
    for (const p of parts.current) p.obj.position.y = p.baseY - p.depth
    anim.current = { t: 0, phase: "in" }
  }, [shown.id])

  useEffect(() => {
    if (city.id === shown.id && anim.current.phase !== "out") return
    if (anim.current.phase === "out") return
    for (const p of parts.current) p.from = p.cur
    anim.current = { t: 0, phase: "out" }
  }, [city.id, shown.id])

  useFrame((_, raw) => {
    const dt = Math.min(raw, 1 / 30)
    const a = anim.current
    if (a.phase === "idle" || a.phase === "swap") return
    a.t += dt
    let done = true
    for (const p of parts.current) {
      if (a.phase === "out") {
        const k = THREE.MathUtils.clamp((a.t - p.outDelay) / OUT_DUR, 0, 1)
        if (k < 1) done = false
        p.cur = p.from + (p.depth - p.from) * k * k
        p.obj.rotation.z = p.baseRz + p.sway * Math.sin(k * Math.PI)
      } else {
        const k = THREE.MathUtils.clamp((a.t - p.inDelay) / IN_DUR, 0, 1)
        if (k < 1) done = false
        p.cur = p.depth * (1 - easeOutBack(k))
        p.obj.rotation.z = p.baseRz + p.sway * Math.sin(k * Math.PI) * (1 - k)
      }
      p.obj.position.y = p.baseY - p.cur
    }
    if (!done) return
    if (a.phase === "out") {
      if (latest.current.id !== shown.id) {
        anim.current = { t: 0, phase: "swap" }
        setShown(latest.current)
      } else {
        anim.current = { t: 0, phase: "in" }
      }
    } else {
      anim.current = { t: 0, phase: "idle" }
    }
  })

  const Scene = SCENES[shown.id] ?? NewYork
  return (
    <>
      <mesh position={[0, GROUND_Y, 0]} scale={[1, 0.12, 1]} material={GROUND_MAT[shown.ground]} receiveShadow>
        <sphereGeometry args={[GROUND_R, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <group ref={group} position={[0, GROUND_Y + 0.13, 0]}>
        <Scene />
      </group>
      <Particles key={shown.id} climate={shown.climate} density={shown.density} shake={shake} />
    </>
  )
}

function GlobeRig({ shake, children }: { shake: MutableRefObject<ShakeState>; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  const st = useRef({ px: 0, py: 0, vx: 0, vy: 0, ry: 0 })

  useFrame((state, raw) => {
    const dt = Math.min(raw, 1 / 30)
    const s = shake.current
    const k = st.current
    const tx = s.dragging ? s.offX * 0.34 : 0
    const ty = s.dragging ? s.offY * 0.24 : 0
    const ax = (tx - k.px) * 80 - k.vx * 7
    const ay = (ty - k.py) * 80 - k.vy * 7
    k.vx += ax * dt
    k.vy += ay * dt
    k.px += k.vx * dt
    k.py += k.vy * dt
    s.accel.set(THREE.MathUtils.clamp(ax, -40, 40), THREE.MathUtils.clamp(ay, -40, 40), 0)
    s.energy = Math.min(4, s.energy * Math.exp(-dt * 0.85) + Math.hypot(ax, ay) * dt * 0.01)
    k.ry = THREE.MathUtils.lerp(k.ry, s.spin, 1 - Math.exp(-dt * 6))
    const t = state.clock.elapsedTime
    if (ref.current) {
      ref.current.position.set(k.px, 0.15 + k.py, 0)
      ref.current.rotation.set(-k.py * 0.35, k.ry + Math.sin(t * 0.2) * 0.18, -k.px * 0.4)
    }
  })

  return <group ref={ref}>{children}</group>
}

export function SnowGlobe({ city, shakeKey }: { city: City; shakeKey: number }) {
  const shake = useRef<ShakeState>(createShake())
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (shakeKey > 0) shake.current.energy = Math.min(4, shake.current.energy + 2.8)
  }, [shakeKey])

  useEffect(() => {
    shake.current.energy = Math.min(4, shake.current.energy + 2)
  }, [city.id])

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    const s = shake.current
    s.dragging = true
    s.startX = e.clientX
    s.startY = e.clientY
    s.lastX = e.clientX
    s.lastY = e.clientY
    s.offX = 0
    s.offY = 0
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const s = shake.current
    if (!s.dragging || !wrap.current) return
    const rect = wrap.current.getBoundingClientRect()
    const dx = e.clientX - s.lastX
    const dy = e.clientY - s.lastY
    s.lastX = e.clientX
    s.lastY = e.clientY
    s.offX = THREE.MathUtils.clamp((e.clientX - s.startX) / (rect.width * 0.35), -1, 1)
    s.offY = THREE.MathUtils.clamp(-(e.clientY - s.startY) / (rect.height * 0.35), -1, 1)
    s.spin += dx * 0.004
    s.energy = Math.min(4, s.energy + Math.hypot(dx, dy) * 0.006)
  }

  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    shake.current.dragging = false
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
  }

  return (
    <div
      ref={wrap}
      className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp} data-oid="a5a0ccf6d0" data-oid-component-root="true" data-oid-callsite-deletable="true" data-oid-callsite-single="true"
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.2, 8.2], fov: 30 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(P.porcelain, 1)
          gl.shadowMap.type = THREE.PCFSoftShadowMap
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 0.95
        }}
      >
        <color attach="background" args={[P.porcelain]} />
        <StudioLights />
        <GlobeRig shake={shake}>
          <Base />
          <Stage city={city} shake={shake} />
          <GlobeGlass />
        </GlobeRig>
        <GroundShadow />
      </Canvas>
    </div>
  )
}
