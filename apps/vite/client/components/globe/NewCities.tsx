import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { M } from "./materials"
import { Garland, Gift, LightArch, MarketStall, Pinata, Rink, Sleigh, Wreath } from "./HolidayDecor"
import { Ball, Block, Cyl, House, Lamp, Palm, Snowman, SunOrnament, Tree, type V3 } from "./primitives"

const Q = Math.PI / 4

function BridgeTower({ x }: { x: number }) {
  return (
    <group position={[x, 0, 0]}>
      <Block p={[0, 0.4, 0.065]} s={[0.05, 0.8, 0.05]} m={M.red} />
      <Block p={[0, 0.4, -0.065]} s={[0.05, 0.8, 0.05]} m={M.red} />
      <Block p={[0, 0.42, 0]} s={[0.06, 0.04, 0.17]} m={M.red} />
      <Block p={[0, 0.6, 0]} s={[0.06, 0.04, 0.17]} m={M.red} />
      <Block p={[0, 0.78, 0]} s={[0.07, 0.04, 0.18]} m={M.redDeep} />
    </group>
  )
}

export function SanFrancisco() {
  return (
    <group>
      <group position={[0, 0, -0.45]} rotation={[0, -0.15, 0]}>
        <BridgeTower x={-0.38} />
        <BridgeTower x={0.38} />
        <Block p={[0, 0.3, 0]} s={[1.34, 0.04, 0.16]} m={M.red} />
        <Block p={[0, 0.27, 0]} s={[1.3, 0.025, 0.12]} m={M.redDeep} />
        <mesh position={[0, 0.78, 0.07]} rotation={[0, 0, Math.PI]} scale={[1, 0.55, 1]} material={M.red} castShadow>
          <torusGeometry args={[0.38, 0.008, 8, 48, Math.PI]} />
        </mesh>
        <mesh position={[0, 0.78, -0.07]} rotation={[0, 0, Math.PI]} scale={[1, 0.55, 1]} material={M.red} castShadow>
          <torusGeometry args={[0.38, 0.008, 8, 48, Math.PI]} />
        </mesh>
        <Block p={[0.515, 0.55, 0.07]} s={[0.012, 0.533, 0.012]} r={[0, 0, 0.53]} round={0.004} m={M.red} />
        <Block p={[-0.515, 0.55, 0.07]} s={[0.012, 0.533, 0.012]} r={[0, 0, -0.53]} round={0.004} m={M.red} />
        <Block p={[0.62, 0.14, 0]} s={[0.08, 0.28, 0.14]} />
        <Block p={[-0.62, 0.14, 0]} s={[0.08, 0.28, 0.14]} />
      </group>

      <group position={[-0.62, 0.98, -0.42]}>
        <Ball p={[0, 0, 0]} r={0.1} s={[1.4, 0.7, 1]} m={M.ivory} />
        <Ball p={[0.13, -0.02, 0.02]} r={0.08} s={[1.4, 0.7, 1]} m={M.ivory} />
        <Ball p={[-0.12, -0.03, 0]} r={0.07} s={[1.4, 0.7, 1]} m={M.ivory} />
      </group>

      <group position={[-0.45, 0, 0.22]} rotation={[0, 0.5, 0]}>
        <House p={[-0.22, 0, 0]} w={0.2} h={0.3} roof={M.red} />
        <House p={[0, 0, 0]} w={0.2} h={0.34} roof={M.green} />
        <House p={[0.22, 0, 0]} w={0.2} h={0.28} roof={M.redDeep} />
        <Wreath p={[-0.22, 0.23, 0.108]} r={0.043} />
        <Wreath p={[0, 0.27, 0.108]} r={0.043} />
        <Wreath p={[0.22, 0.21, 0.108]} r={0.043} />
      </group>

      <group position={[0.46, 0, 0.38]} rotation={[0, -0.45, 0]}>
        <Block p={[0, 0.004, 0.035]} s={[0.6, 0.008, 0.012]} round={0.003} m={M.gold} />
        <Block p={[0, 0.004, -0.035]} s={[0.6, 0.008, 0.012]} round={0.003} m={M.gold} />
        <Block p={[0, 0.12, 0]} s={[0.32, 0.14, 0.14]} m={M.red} />
        <Block p={[0, 0.14, 0]} s={[0.325, 0.05, 0.145]} />
        <Block p={[0, 0.205, 0]} s={[0.36, 0.025, 0.16]} m={M.ivory} />
        <Cyl p={[0.1, 0.035, 0.06]} rt={0.03} rb={0.03} h={0.02} r={[Math.PI / 2, 0, 0]} m={M.greenDeep} />
        <Cyl p={[-0.1, 0.035, 0.06]} rt={0.03} rb={0.03} h={0.02} r={[Math.PI / 2, 0, 0]} m={M.greenDeep} />
      </group>

      <Tree p={[0.04, 0, 0.58]} h={0.64} />
      <Lamp p={[0.78, 0, -0.08]} />
      <Lamp p={[-0.22, 0, 0.72]} />
      <Garland p={[0, 0.77, -0.38]} width={0.75} drop={0.17} foliage={false} rotY={-0.15} />
      <Gift p={[0.26, 0, 0.81]} size={0.14} />
      <Gift p={[-0.11, 0, 0.85]} size={0.11} green />
    </group>
  )
}

const TIERS = [0.8, 0.67, 0.54, 0.41, 0.28]

export function Cancun() {
  return (
    <group>
      <group position={[0, 0, -0.32]}>
        {TIERS.map((w, i) => (
          <Block key={i} p={[0, 0.055 + i * 0.11, 0]} s={[w, 0.11, w]} m={i % 2 ? M.sand : M.cream} round={0.012} />
        ))}
        <Block p={[0, 0.28, 0.27]} s={[0.16, 0.61, 0.05]} r={[-0.44, 0, 0]} round={0.01} m={M.ivory} />
        <Block p={[0, 0.62, 0]} s={[0.24, 0.14, 0.24]} />
        <Block p={[0, 0.705, 0]} s={[0.28, 0.03, 0.28]} m={M.red} />
        <Block p={[0, 0.6, 0.121]} s={[0.07, 0.09, 0.01]} round={0.003} m={M.gold} />
      </group>
      <SunOrnament p={[0.6, 1.02, -0.5]} r={0.17} />
      <Ball p={[0.1, 0, 0.6]} r={0.36} s={[1.5, 0.12, 0.55]} m={M.green} />
      <Palm p={[-0.66, 0, 0.18]} h={0.62} lean={0.12} />
      <Palm p={[0.7, 0, 0.12]} h={0.55} lean={-0.12} rotY={0.6} />
      <Palm p={[-0.5, 0, 0.58]} h={0.42} lean={0.15} rotY={2.1} />
      <group position={[0.4, 0, 0.5]}>
        <Cyl p={[0, 0.16, 0]} rt={0.008} rb={0.01} h={0.32} seg={10} m={M.gold} />
        <Cyl p={[0, 0.33, 0]} rt={0} rb={0.17} h={0.08} seg={16} m={M.red} />
        <Block p={[0.12, 0.01, 0.08]} s={[0.1, 0.012, 0.2]} round={0.004} m={M.ivory} />
      </group>
      <Tree p={[-0.14, 0, 0.62]} h={0.56} />
      <Pinata p={[-0.5, 0.35, 0.3]} />
      <Gift p={[0.13, 0, 0.82]} size={0.15} />
      <Gift p={[-0.35, 0, 0.83]} size={0.11} green />
      <Wreath p={[0.654, 0.31, 0.158]} r={0.066} />
    </group>
  )
}

export function Toronto() {
  return (
    <group>
      <group position={[-0.18, 0, -0.32]}>
        <Cyl p={[0, 0.1, 0]} rt={0.07} rb={0.14} h={0.2} seg={3} />
        <Cyl p={[0, 0.6, 0]} rt={0.035} rb={0.07} h={0.8} seg={3} />
        <Ball p={[0, 1.0, 0]} r={0.1} s={[1, 0.55, 1]} m={M.red} />
        <Cyl p={[0, 1.0, 0]} rt={0.106} rb={0.106} h={0.02} seg={40} m={M.gold} />
        <Cyl p={[0, 1.15, 0]} rt={0.024} rb={0.03} h={0.22} />
        <Ball p={[0, 1.27, 0]} r={0.036} m={M.gold} />
        <Cyl p={[0, 1.45, 0]} rt={0.004} rb={0.015} h={0.3} seg={8} m={M.gold} />
      </group>
      <group position={[0.46, 0, -0.36]}>
        <Cyl p={[0, 0.05, 0]} rt={0.3} rb={0.3} h={0.1} seg={48} />
        <Ball p={[0, 0.1, 0]} r={0.29} s={[1, 0.5, 1]} m={M.ivory} />
        <Cyl p={[0, 0.1, 0]} rt={0.302} rb={0.302} h={0.015} seg={48} m={M.gold} />
      </group>
      <group position={[-0.05, 0, 0.17]}>
        <mesh position={[-0.16, 0, 0]} material={M.cream} castShadow>
          <torusGeometry args={[0.13, 0.016, 10, 32, Math.PI]} />
        </mesh>
        <mesh position={[0.16, 0, 0]} material={M.cream} castShadow>
          <torusGeometry args={[0.13, 0.016, 10, 32, Math.PI]} />
        </mesh>
        <Block p={[0, 0.14, 0]} s={[0.62, 0.025, 0.04]} m={M.cream} />
      </group>
      <House p={[0.62, 0, 0.22]} rotY={-0.5} roof={M.red} />
      <Tree p={[-0.66, 0, 0.08]} h={0.67} snow />
      <Tree p={[0.78, 0, -0.02]} h={0.34} snow />
      <Snowman p={[-0.46, 0, 0.64]} />
      <Lamp p={[0.36, 0, 0.66]} />
      <Rink p={[-0.05, 0, 0.51]} scale={1.05} />
      <MarketStall p={[0.72, 0, 0.65]} rot={-0.3} snow />
      <Gift p={[-0.7, 0, 0.45]} size={0.14} />
      <Gift p={[-0.8, 0, 0.6]} size={0.105} green />
    </group>
  )
}

function MiniPrang({ p }: { p: V3 }) {
  return (
    <group position={p}>
      <Block p={[0, 0.03, 0]} s={[0.14, 0.06, 0.14]} />
      <Cyl p={[0, 0.17, 0]} rt={0.05} rb={0.065} h={0.22} seg={8} />
      <Cyl p={[0, 0.285, 0]} rt={0.055} rb={0.055} h={0.014} seg={8} m={M.gold} />
      <Cyl p={[0, 0.37, 0]} rt={0.008} rb={0.045} h={0.16} seg={8} />
      <Cyl p={[0, 0.49, 0]} rt={0.002} rb={0.01} h={0.08} seg={8} m={M.gold} />
    </group>
  )
}

export function Bangkok() {
  return (
    <group>
      <group position={[0, 0, -0.3]}>
        <Block p={[0, 0.04, 0]} s={[0.5, 0.08, 0.5]} />
        <Cyl p={[0, 0.2, 0]} rt={0.16} rb={0.2} h={0.24} seg={8} />
        <Cyl p={[0, 0.33, 0]} rt={0.17} rb={0.17} h={0.02} seg={8} m={M.gold} />
        <Cyl p={[0, 0.5, 0]} rt={0.1} rb={0.15} h={0.32} seg={8} />
        <Cyl p={[0, 0.45, 0]} rt={0.14} rb={0.14} h={0.025} seg={8} m={M.green} />
        <Cyl p={[0, 0.67, 0]} rt={0.105} rb={0.105} h={0.02} seg={8} m={M.gold} />
        <Cyl p={[0, 0.86, 0]} rt={0.03} rb={0.09} h={0.36} seg={8} />
        <Cyl p={[0, 1.12, 0]} rt={0.003} rb={0.02} h={0.18} seg={8} m={M.gold} />
      </group>
      <MiniPrang p={[-0.42, 0, -0.5]} />
      <MiniPrang p={[0.42, 0, -0.5]} />
      <group position={[-0.6, 0, 0.26]} rotation={[0, 0.5, 0]}>
        <House p={[0, 0, 0]} w={0.3} h={0.18} roof={M.red} />
        <Cyl p={[0.17, 0.33, 0]} rt={0.004} rb={0.012} h={0.1} seg={8} r={[0, 0, -0.5]} m={M.gold} />
        <Cyl p={[-0.17, 0.33, 0]} rt={0.004} rb={0.012} h={0.1} seg={8} r={[0, 0, 0.5]} m={M.gold} />
      </group>
      <group position={[0.5, 0, 0.42]} rotation={[0, -0.5, 0]}>
        <Block p={[0, 0.1, 0]} s={[0.26, 0.12, 0.16]} m={M.red} />
        <Block p={[0.16, 0.09, 0]} s={[0.08, 0.1, 0.08]} m={M.red} />
        <Block p={[0, 0.27, 0]} s={[0.26, 0.025, 0.18]} m={M.green} />
        <Cyl p={[-0.11, 0.21, 0.07]} rt={0.006} rb={0.006} h={0.12} seg={8} m={M.gold} />
        <Cyl p={[-0.11, 0.21, -0.07]} rt={0.006} rb={0.006} h={0.12} seg={8} m={M.gold} />
        <Cyl p={[-0.08, 0.035, 0.085]} rt={0.032} rb={0.032} h={0.02} r={[Math.PI / 2, 0, 0]} m={M.greenDeep} />
        <Cyl p={[-0.08, 0.035, -0.085]} rt={0.032} rb={0.032} h={0.02} r={[Math.PI / 2, 0, 0]} m={M.greenDeep} />
        <Cyl p={[0.18, 0.035, 0]} rt={0.032} rb={0.032} h={0.02} r={[Math.PI / 2, 0, 0]} m={M.greenDeep} />
      </group>
      <SunOrnament p={[-0.62, 1.04, -0.48]} r={0.16} />
      <Palm p={[0.74, 0, -0.12]} h={0.55} lean={-0.12} />
      <Palm p={[-0.78, 0, -0.18]} h={0.5} lean={0.12} rotY={2.3} />
      <Tree p={[0.02, 0, 0.6]} h={0.62} />
      <LightArch p={[-0.62, 0, 0.68]} width={0.4} h={0.64} rot={0.3} />
      <Gift p={[-0.2, 0, 0.8]} size={0.145} />
      <Gift p={[0.23, 0, 0.81]} size={0.12} green />
      <Wreath p={[0.59, 0.2, 0.55]} r={0.055} rotY={-0.5} />
    </group>
  )
}

const GONDOLAS = Array.from({ length: 10 })
const SPOKES = [0, 1, 2, 3, 4]

function FerrisWheel({ p }: { p: V3 }) {
  const wheel = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (wheel.current) wheel.current.rotation.z -= dt * 0.18
  })
  return (
    <group position={p} rotation={[0, -0.35, 0]}>
      <Block p={[0.1, 0.31, 0.08]} s={[0.022, 0.66, 0.022]} r={[0, 0, 0.31]} round={0.006} m={M.cream} />
      <Block p={[-0.1, 0.31, 0.08]} s={[0.022, 0.66, 0.022]} r={[0, 0, -0.31]} round={0.006} m={M.cream} />
      <Block p={[0.1, 0.31, -0.08]} s={[0.022, 0.66, 0.022]} r={[0, 0, 0.31]} round={0.006} m={M.cream} />
      <Block p={[-0.1, 0.31, -0.08]} s={[0.022, 0.66, 0.022]} r={[0, 0, -0.31]} round={0.006} m={M.cream} />
      <group ref={wheel} position={[0, 0.62, 0]}>
        <Cyl p={[0, 0, 0]} rt={0.035} rb={0.035} h={0.2} r={[Math.PI / 2, 0, 0]} m={M.gold} />
        <mesh position={[0, 0, 0.05]} material={M.red} castShadow>
          <torusGeometry args={[0.34, 0.012, 10, 64]} />
        </mesh>
        <mesh position={[0, 0, -0.05]} material={M.red} castShadow>
          <torusGeometry args={[0.34, 0.012, 10, 64]} />
        </mesh>
        {SPOKES.map((i) => (
          <Block key={i} p={[0, 0, 0]} s={[0.008, 0.68, 0.008]} r={[0, 0, (i / SPOKES.length) * Math.PI]} round={0.003} m={M.gold} />
        ))}
        {GONDOLAS.map((_, i) => {
          const a = (i / GONDOLAS.length) * Math.PI * 2
          return <Block key={i} p={[Math.cos(a) * 0.34, Math.sin(a) * 0.34, 0]} s={[0.07, 0.06, 0.13]} m={i % 2 ? M.red : M.redDeep} round={0.012} />
        })}
      </group>
    </group>
  )
}

export function Vienna() {
  return (
    <group>
      <group position={[-0.4, 0, -0.28]} rotation={[0, 0.3, 0]}>
        <House p={[0, 0, -0.05]} w={0.46} h={0.28} d={0.28} roof={M.green} rotY={Math.PI / 2} />
        <Block p={[0, 0.26, 0.3]} s={[0.16, 0.52, 0.16]} />
        <Block p={[0, 0.3, 0.381]} s={[0.05, 0.14, 0.01]} round={0.003} m={M.goldSoft} />
        <Cyl p={[0, 0.84, 0.3]} rt={0} rb={0.1} h={0.64} seg={8} r={[0, Q / 2, 0]} />
        <Cyl p={[0, 1.2, 0.3]} rt={0.003} rb={0.012} h={0.1} seg={8} m={M.gold} />
      </group>
      <FerrisWheel p={[0.38, 0, -0.38]} />
      <MarketStall p={[-0.67, 0, 0.4]} rot={0.6} snow />
      <MarketStall p={[0.67, 0, 0.32]} rot={-0.6} snow />
      <Tree p={[0, 0, 0.42]} h={0.72} snow />
      <Tree p={[-0.32, 0, 0.7]} h={0.3} snow />
      <Snowman p={[0.82, 0, -0.04]} />
      <Lamp p={[-0.06, 0, 0.84]} />
      <Sleigh p={[0.51, 0, 0.75]} rot={-0.25} />
      <Gift p={[0.27, 0, 0.53]} size={0.14} green />
    </group>
  )
}
