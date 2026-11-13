import * as THREE from "three"
import { Tower } from "./ColdCities"
import { M } from "./materials"
import { Ball, Block, Cyl, Cypress, Lamp, Palm, SunOrnament, Tree } from "./primitives"

const Q = Math.PI / 4
const pillarGeo = new THREE.BoxGeometry(0.05, 0.13, 0.06)
const PILLARS = 28

export function Tokyo() {
  return (
    <group>
      <group position={[0.3, 0, -0.6]}>
        <Cyl p={[0, 0.275, 0]} rt={0.07} rb={0.5} h={0.55} seg={48} m={M.green} />
        <Cyl p={[0, 0.475, 0]} rt={0.074} rb={0.196} h={0.15} seg={48} m={M.ivory} />
      </group>
      <Tower p={[-0.3, 0, -0.1]} m={M.red} accent={M.cream} scale={0.88} />
      <group position={[0.55, 0, 0.28]}>
        <Block p={[0, 0.07, 0]} s={[0.16, 0.12, 0.16]} />
        <Cyl p={[0, 0.15, 0]} rt={0.03} rb={0.17} h={0.05} seg={4} r={[0, Q, 0]} m={M.green} />
        <Block p={[0, 0.21, 0]} s={[0.13, 0.1, 0.13]} />
        <Cyl p={[0, 0.28, 0]} rt={0.03} rb={0.14} h={0.05} seg={4} r={[0, Q, 0]} m={M.green} />
        <Block p={[0, 0.34, 0]} s={[0.1, 0.09, 0.1]} />
        <Cyl p={[0, 0.41, 0]} rt={0.02} rb={0.11} h={0.05} seg={4} r={[0, Q, 0]} m={M.green} />
        <Cyl p={[0, 0.49, 0]} rt={0.003} rb={0.012} h={0.12} seg={8} m={M.gold} />
      </group>
      <group position={[-0.55, 0, 0.5]} rotation={[0, 0.4, 0]}>
        <Cyl p={[0.12, 0.15, 0]} rt={0.018} rb={0.022} h={0.3} m={M.red} />
        <Cyl p={[-0.12, 0.15, 0]} rt={0.018} rb={0.022} h={0.3} m={M.red} />
        <Block p={[0, 0.27, 0]} s={[0.3, 0.03, 0.04]} m={M.red} />
        <Block p={[0, 0.32, 0]} s={[0.38, 0.035, 0.05]} m={M.redDeep} />
      </group>
      <Tree p={[0.12, 0, 0.55]} h={0.42} />
      <Lamp p={[-0.15, 0, 0.75]} />
      <Lamp p={[0.8, 0, -0.15]} />
      <Ball p={[0.38, 0.03, 0.72]} r={0.03} m={M.gold} />
      <Ball p={[-0.82, 0.03, 0.05]} r={0.03} m={M.gold} />
    </group>
  )
}

export function BuenosAires() {
  return (
    <group>
      <group position={[0, 0, -0.18]}>
        <Block p={[0, 0.03, 0]} s={[0.3, 0.06, 0.3]} />
        <Cyl p={[0, 0.635, 0]} rt={0.06} rb={0.1} h={1.15} seg={4} r={[0, Q, 0]} />
        <Cyl p={[0, 1.27, 0]} rt={0} rb={0.061} h={0.12} seg={4} r={[0, Q, 0]} />
        <Block p={[0, 1.12, 0.046]} s={[0.024, 0.034, 0.006]} round={0.002} m={M.gold} />
      </group>
      <SunOrnament p={[0.6, 1.02, -0.55]} r={0.19} />

      <Block p={[0, 0.02, 0.32]} s={[0.26, 0.02, 0.96]} m={M.ivory} />
      <Block p={[0, 0.033, 0.0]} s={[0.022, 0.006, 0.08]} round={0.002} m={M.gold} />
      <Block p={[0, 0.033, 0.2]} s={[0.022, 0.006, 0.08]} round={0.002} m={M.gold} />
      <Block p={[0, 0.033, 0.4]} s={[0.022, 0.006, 0.08]} round={0.002} m={M.gold} />
      <Block p={[0, 0.033, 0.6]} s={[0.022, 0.006, 0.08]} round={0.002} m={M.gold} />

      <Palm p={[-0.55, 0, -0.36]} h={0.72} lean={0.1} />
      <Palm p={[0.55, 0, 0.1]} h={0.6} lean={-0.12} rotY={0.5} />
      <Palm p={[-0.52, 0, 0.45]} h={0.5} lean={0.14} rotY={2} />
      <Palm p={[0.42, 0, -0.42]} h={0.45} lean={0.1} rotY={1.2} />

      <group position={[0.36, 0, 0.58]} rotation={[0, 0.25, 0]}>
        <Block p={[0, 0.11, 0]} s={[0.34, 0.16, 0.15]} m={M.red} />
        <Block p={[0, 0.14, 0]} s={[0.345, 0.05, 0.155]} />
        <Cyl p={[0.1, 0.035, 0.07]} rt={0.035} rb={0.035} h={0.025} r={[Math.PI / 2, 0, 0]} m={M.greenDeep} />
        <Cyl p={[-0.1, 0.035, 0.07]} rt={0.035} rb={0.035} h={0.025} r={[Math.PI / 2, 0, 0]} m={M.greenDeep} />
      </group>
      <Tree p={[-0.24, 0, 0.24]} h={0.38} />
    </group>
  )
}

export function Rome() {
  const pillars: JSX.Element[] = []
  for (let L = 0; L < 3; L++) {
    for (let i = 0; i < PILLARS; i++) {
      const th = (i / PILLARS) * Math.PI * 2
      if (L === 2 && !(th > Math.PI * 0.6 && th < Math.PI * 1.4)) continue
      pillars.push(
        <mesh
          key={`${L}-${i}`}
          geometry={pillarGeo}
          material={M.cream}
          position={[Math.sin(th) * 0.55, 0.06 + L * 0.15 + 0.065, Math.cos(th) * 0.55]}
          rotation={[0, th, 0]}
          castShadow
          receiveShadow
        />,
      )
    }
  }
  return (
    <group>
      <group position={[0, 0, -0.22]}>
        <Cyl p={[0, 0.03, 0]} rt={0.58} rb={0.6} h={0.06} seg={64} />
        <Cyl p={[0, 0.065, 0]} rt={0.44} rb={0.44} h={0.012} seg={48} m={M.sand} />
        {pillars}
        <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.cream} castShadow receiveShadow>
          <torusGeometry args={[0.55, 0.022, 8, 72]} />
        </mesh>
        <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.cream} castShadow receiveShadow>
          <torusGeometry args={[0.55, 0.022, 8, 72]} />
        </mesh>
        <mesh position={[0, 0.56, 0]} material={M.creamDouble} castShadow receiveShadow>
          <cylinderGeometry args={[0.56, 0.56, 0.1, 48, 1, true, Math.PI * 0.6, Math.PI * 0.8]} />
        </mesh>
      </group>
      <SunOrnament p={[-0.62, 1.08, -0.5]} r={0.13} />
      <Cypress p={[-0.76, 0, 0.2]} h={0.45} />
      <Cypress p={[-0.86, 0, -0.25]} h={0.5} />
      <Cypress p={[0.8, 0, 0.12]} h={0.42} />
      <Cypress p={[0.62, 0, 0.52]} h={0.34} />
      <Tree p={[0.22, 0, 0.62]} h={0.5} />
      <Lamp p={[-0.3, 0, 0.66]} />
    </group>
  )
}

export function Sydney() {
  return (
    <group>
      <Cyl p={[0.15, 0.008, -0.45]} rt={0.55} rb={0.55} h={0.02} seg={56} m={M.green} />
      <group position={[-0.22, 0, 0.02]}>
        <Block p={[0, 0.04, 0]} s={[0.72, 0.08, 0.4]} />
        <group position={[-0.22, 0.08, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh scale={[1, 1.6, 0.7]} material={M.creamDouble} castShadow receiveShadow>
            <sphereGeometry args={[0.2, 32, 16, 0, Math.PI, 0, Math.PI / 2]} />
          </mesh>
        </group>
        <group position={[0.0, 0.08, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh scale={[1, 1.6, 0.7]} material={M.creamDouble} castShadow receiveShadow>
            <sphereGeometry args={[0.17, 32, 16, 0, Math.PI, 0, Math.PI / 2]} />
          </mesh>
        </group>
        <group position={[0.2, 0.08, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh scale={[1, 1.6, 0.7]} material={M.creamDouble} castShadow receiveShadow>
            <sphereGeometry args={[0.13, 32, 16, 0, Math.PI, 0, Math.PI / 2]} />
          </mesh>
        </group>
      </group>
      <group position={[0.5, 0, -0.55]} rotation={[0, -0.6, 0]}>
        <mesh material={M.gold} castShadow>
          <torusGeometry args={[0.34, 0.022, 12, 48, Math.PI]} />
        </mesh>
        <Block p={[0, 0.16, 0]} s={[0.86, 0.03, 0.08]} />
        <Block p={[0.4, 0.13, 0]} s={[0.08, 0.26, 0.1]} />
        <Block p={[-0.4, 0.13, 0]} s={[0.08, 0.26, 0.1]} />
      </group>
      <SunOrnament p={[-0.6, 1.05, -0.5]} r={0.18} />
      <Palm p={[0.55, 0, 0.3]} h={0.6} lean={-0.1} />
      <Palm p={[-0.7, 0, 0.45]} h={0.5} lean={0.15} rotY={2.2} />
      <Tree p={[0.14, 0, 0.56]} h={0.34} />
      <Ball p={[-0.25, 0.1, 0.62]} r={0.12} s={[0.35, 1, 0.08]} rot={[0, 0.3, 0.2]} m={M.red} />
    </group>
  )
}

const BURJ: [number, number][] = [
  [0.17, 0.3],
  [0.14, 0.28],
  [0.115, 0.24],
  [0.09, 0.2],
  [0.07, 0.17],
  [0.05, 0.14],
  [0.033, 0.12],
]

export function Dubai() {
  let y = 0
  const tiers = BURJ.map(([r, h], i) => {
    const base = y
    y += h
    return (
      <group key={i}>
        <Cyl p={[0, base + h / 2, 0]} rt={r * 0.94} rb={r} h={h} seg={6} />
        <Cyl p={[0, base + h, 0]} rt={r * 1.02} rb={r * 1.02} h={0.012} seg={6} m={M.gold} />
      </group>
    )
  })
  return (
    <group>
      <group position={[0, 0, -0.2]}>
        {tiers}
        <Cyl p={[0, y + 0.11, 0]} rt={0.003} rb={0.02} h={0.22} seg={8} m={M.gold} />
      </group>
      <Ball p={[-0.65, 0, -0.35]} r={0.35} s={[1.3, 0.35, 0.9]} m={M.sand} />
      <Ball p={[0.68, 0, -0.2]} r={0.3} s={[1.2, 0.3, 1]} m={M.sand} />
      <Ball p={[0.2, 0, 0.62]} r={0.3} s={[1.4, 0.18, 0.8]} m={M.sand} />
      <SunOrnament p={[-0.6, 1.05, -0.5]} r={0.2} />
      <Palm p={[0.5, 0, 0.25]} h={0.55} lean={-0.1} />
      <Palm p={[-0.45, 0, 0.35]} h={0.62} lean={0.1} rotY={2.5} />
      <Palm p={[0.74, 0, 0.48]} h={0.4} lean={0.12} rotY={1} />
      <Tree p={[-0.12, 0, 0.6]} h={0.36} />
      <Lamp p={[0.18, 0, 0.3]} />
    </group>
  )
}

export function Rio() {
  return (
    <group>
      <Ball p={[-0.15, 0, -0.4]} r={0.5} s={[0.95, 1.4, 0.8]} m={M.green} />
      <group position={[-0.15, 0.68, -0.4]}>
        <Block p={[0, 0.02, 0]} s={[0.07, 0.05, 0.07]} />
        <Cyl p={[0, 0.15, 0]} rt={0.022} rb={0.04} h={0.22} />
        <Block p={[0, 0.225, 0]} s={[0.28, 0.03, 0.035]} />
        <Ball p={[0, 0.28, 0]} r={0.026} />
      </group>
      <Ball p={[0.62, 0, -0.35]} r={0.26} s={[0.8, 1.6, 0.8]} m={M.green} />
      <Ball p={[0.86, 0, 0.0]} r={0.16} s={[1, 1, 0.8]} m={M.greenDeep} />
      <Ball p={[0, 0, 0.55]} r={0.7} s={[1.15, 0.06, 0.4]} m={M.sand} />
      <SunOrnament p={[0.55, 1.02, -0.6]} r={0.17} />
      <Palm p={[-0.6, 0, 0.4]} h={0.55} lean={0.15} />
      <Palm p={[0.45, 0, 0.45]} h={0.5} lean={-0.1} rotY={0.4} />
      <Palm p={[-0.78, 0, -0.02]} h={0.45} lean={0.1} rotY={1.4} />
      <Tree p={[0.08, 0, 0.55]} h={0.34} />
    </group>
  )
}
