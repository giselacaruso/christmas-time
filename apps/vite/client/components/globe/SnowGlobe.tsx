import { useEffect, useMemo, useRef, useState, type MutableRefObject, type PointerEvent, type ReactNode } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { ContactShadows, Environment, Lightformer } from "@react-three/drei"
import * as THREE from "three"
import type { City } from "../../data/cities"
import { London, Moscow, NewYork, Paris } from "./ColdCities"
import { BuenosAires, Dubai, Rio, Rome, Sydney, Tokyo } from "./WarmCities"
import { M } from "./materials"
import { Particles } from "./Particles"
import { GROUND_R, GROUND_Y, R_GLASS, createShake, type ShakeState } from "./shake"

const BG = "#fbf6ec"

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
}

const GROUND_MAT = { snow: M.ivory, grass: M.green, sand: M.sand }

const BASE_PROFILE: [number, number][] = [
  [0, -1.9],
  [1.5, -1.9],
  [1.56, -1.87],
  [1.56, -1.8],
  [1.48, -1.74],
  [1.4, -1.58],
  [1.36, -1.42],
  [1.38, -1.32],
  [1.31, -1.22],
  [1.27, -1.1],
  [1.22, -1.06],
  [0, -1.06],
]

const baseMat = M.red.clone()
baseMat.side = THREE.DoubleSide

function easeOutBack(x: number) {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

function Glass() {
  return (
    <mesh renderOrder={10}>
      <sphereGeometry args={[R_GLASS, 128, 96]} />
      <meshPhysicalMaterial
        color="#ffffff"
        transmission={1}
        thickness={0.6}
        roughness={0.02}
        ior={1.42}
        metalness={0}
        clearcoat={1}
        clearcoatRoughness={0.02}
        envMapIntensity={1.6}
        specularIntensity={1}
        attenuationColor="#fff4e0"
        attenuationDistance={4}
      />
    </mesh>
  )
}

function Base() {
  const geo = useMemo(() => new THREE.LatheGeometry(BASE_PROFILE.map(([x, y]) => new THREE.Vector2(x, y)), 128), [])
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

function Stage({ city, shake }: { city: City; shake: MutableRefObject<ShakeState> }) {
  const [shown, setShown] = useState(city)
  const latest = useRef(city)
  latest.current = city
  const anim = useRef<{ s: number; phase: "in" | "out" | "idle" }>({ s: 0, phase: "in" })
  const group = useRef<THREE.Group>(null)

  useEffect(() => {
    if (city.id !== shown.id) anim.current.phase = "out"
  }, [city.id, shown.id])

  useFrame((_, raw) => {
    const dt = Math.min(raw, 1 / 30)
    const a = anim.current
    if (a.phase === "out") {
      a.s -= dt * 4.5
      if (a.s <= 0) {
        a.s = 0
        a.phase = "in"
        setShown(latest.current)
      }
    } else if (a.phase === "in") {
      a.s += dt * 1.7
      if (a.s >= 1) {
        a.s = 1
        a.phase = "idle"
      }
    }
    const k = a.phase === "out" ? a.s * a.s : easeOutBack(a.s)
    if (group.current) {
      group.current.scale.setScalar(Math.max(0.001, k))
      group.current.rotation.y = (1 - a.s) * -0.9
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

function Lights() {
  return (
    <>
      <hemisphereLight args={["#fff4e2", "#6b4a2e", 0.55]} />
      <directionalLight
        position={[3.5, 6, 4.5]}
        intensity={2.4}
        color="#fff1dc"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-2.2}
        shadow-camera-right={2.2}
        shadow-camera-top={2.2}
        shadow-camera-bottom={-2.2}
        shadow-camera-near={1}
        shadow-camera-far={16}
      />
      <directionalLight position={[-4, 2, -3]} intensity={0.7} color="#ffd7a8" />
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#3b2c20"]} />
        <Lightformer form="rect" intensity={2.2} position={[0, 5, 1]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={4} position={[-4, 1.5, 3]} scale={[1.6, 4, 1]} color="#fff6e8" />
        <Lightformer form="rect" intensity={2.5} position={[4.5, 1, -1]} scale={[1.2, 5, 1]} color="#ffd59a" />
        <Lightformer form="ring" intensity={3} position={[2.5, 2.5, 5]} scale={0.9} />
        <Lightformer form="rect" intensity={1.2} position={[0, -4, 2]} scale={[8, 2, 1]} color="#f3e3c6" />
      </Environment>
    </>
  )
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
        onCreated={({ gl }) => gl.setClearColor(BG, 1)}
      >
        <color attach="background" args={[BG]} />
        <Lights />
        <GlobeRig shake={shake}>
          <Base />
          <Stage city={city} shake={shake} />
          <Glass />
        </GlobeRig>
        <ContactShadows position={[0, -1.76, 0]} opacity={0.45} scale={6} blur={2.6} far={1.5} color="#5a3d24" />
      </Canvas>
    </div>
  )
}
