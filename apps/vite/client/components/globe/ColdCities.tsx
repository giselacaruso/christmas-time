import * as THREE from "three"
import { M } from "./materials"
import { Ball, Block, Cyl, House, Lamp, Onion, Snowman, Tree, type V3 } from "./primitives"

const Q = Math.PI / 4
const LEGS: [number, number][] = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
]

export function Tower({ p, m, accent, scale = 1 }: { p: V3; m: THREE.Material; accent: THREE.Material; scale?: number }) {
  return (
    <group position={p} scale={scale}>
      {LEGS.map(([sx, sz], i) => (
        <group key={i} position={[sx * 0.27, 0.25, sz * 0.27]} rotation={[0, Math.atan2(sx, sz), 0]}>
          <Block p={[0, 0, 0]} s={[0.07, 0.6, 0.07]} r={[-0.556, 0, 0]} m={m} />
        </group>
      ))}
      <mesh position={[0, 0.02, 0.3]} material={m} castShadow>
        <torusGeometry args={[0.25, 0.018, 10, 32, Math.PI]} />
      </mesh>
      <mesh position={[0, 0.02, -0.3]} material={m} castShadow>
        <torusGeometry args={[0.25, 0.018, 10, 32, Math.PI]} />
      </mesh>
      <mesh position={[0.3, 0.02, 0]} rotation={[0, Math.PI / 2, 0]} material={m} castShadow>
        <torusGeometry args={[0.25, 0.018, 10, 32, Math.PI]} />
      </mesh>
      <mesh position={[-0.3, 0.02, 0]} rotation={[0, Math.PI / 2, 0]} material={m} castShadow>
        <torusGeometry args={[0.25, 0.018, 10, 32, Math.PI]} />
      </mesh>
      <Block p={[0, 0.5, 0]} s={[0.52, 0.05, 0.52]} m={accent} />
      <Cyl p={[0, 0.77, 0]} rt={0.075} rb={0.2} h={0.5} seg={4} r={[0, Q, 0]} m={m} />
      <Block p={[0, 1.03, 0]} s={[0.2, 0.035, 0.2]} m={accent} />
      <Cyl p={[0, 1.29, 0]} rt={0.022} rb={0.07} h={0.48} seg={4} r={[0, Q, 0]} m={m} />
      <Cyl p={[0, 1.6, 0]} rt={0.004} rb={0.014} h={0.14} seg={8} m={M.gold} />
    </group>
  )
}

export function NewYork() {
  return (
    <group>
      <group position={[0.02, 0, -0.28]}>
        <Block p={[0, 0.3, 0]} s={[0.44, 0.6, 0.36]} />
        <Block p={[0, 0.605, 0]} s={[0.44, 0.025, 0.36]} m={M.ivory} />
        <Block p={[0, 0.75, 0]} s={[0.32, 0.3, 0.27]} />
        <Block p={[0, 0.905, 0]} s={[0.32, 0.02, 0.27]} m={M.ivory} />
        <Block p={[0, 1.0, 0]} s={[0.22, 0.2, 0.19]} />
        <Block p={[0, 1.14, 0]} s={[0.14, 0.08, 0.12]} m={M.gold} />
        <Cyl p={[0, 1.24, 0]} rt={0.04} rb={0.06} h={0.12} />
        <Cyl p={[0, 1.42, 0]} rt={0.005} rb={0.022} h={0.24} m={M.gold} />
        <Block p={[-0.12, 0.3, 0.181]} s={[0.025, 0.52, 0.012]} m={M.gold} />
        <Block p={[0, 0.3, 0.181]} s={[0.025, 0.52, 0.012]} m={M.gold} />
        <Block p={[0.12, 0.3, 0.181]} s={[0.025, 0.52, 0.012]} m={M.gold} />
        <Block p={[0, 0.75, 0.136]} s={[0.025, 0.26, 0.01]} m={M.gold} />
      </group>

      <group position={[0.56, 0, -0.36]}>
        <Block p={[0, 0.38, 0]} s={[0.22, 0.76, 0.22]} />
        <Cyl p={[0, 0.84, 0]} rt={0.07} rb={0.11} h={0.14} seg={4} r={[0, Q, 0]} m={M.gold} />
        <Cyl p={[0, 0.98, 0]} rt={0.03} rb={0.07} h={0.14} seg={4} r={[0, Q, 0]} m={M.gold} />
        <Cyl p={[0, 1.12, 0]} rt={0.003} rb={0.015} h={0.16} seg={8} m={M.gold} />
      </group>

      <Block p={[-0.52, 0.28, -0.4]} s={[0.28, 0.56, 0.26]} m={M.red} />
      <Block p={[-0.52, 0.57, -0.4]} s={[0.28, 0.025, 0.26]} m={M.ivory} />
      <Block p={[-0.84, 0.19, -0.06]} s={[0.22, 0.38, 0.24]} m={M.green} />
      <Block p={[-0.84, 0.39, -0.06]} s={[0.22, 0.022, 0.24]} m={M.ivory} />
      <Block p={[0.86, 0.16, 0.02]} s={[0.2, 0.32, 0.22]} m={M.red} />
      <Block p={[0.86, 0.33, 0.02]} s={[0.2, 0.022, 0.22]} m={M.ivory} />

      <House p={[-0.6, 0, 0.32]} rotY={0.5} roof={M.ivory} />
      <House p={[0.62, 0, 0.32]} rotY={-0.5} roof={M.ivory} h={0.24} />

      <Tree p={[0, 0, 0.42]} h={0.72} snow />
      <Tree p={[-0.36, 0, 0.75]} h={0.3} snow />
      <Snowman p={[0.36, 0, 0.72]} />
      <Lamp p={[-0.12, 0, 0.88]} />
    </group>
  )
}

export function London() {
  return (
    <group>
      <group position={[-0.3, 0, -0.2]}>
        <Block p={[0, 0.5, 0]} s={[0.26, 1.0, 0.26]} />
        <Block p={[0, 0.3, 0.131]} s={[0.03, 0.56, 0.01]} m={M.goldSoft} />
        <Block p={[0, 1.1, 0]} s={[0.32, 0.22, 0.32]} />
        <Cyl p={[0, 1.1, 0.162]} rt={0.095} rb={0.095} h={0.015} r={[Math.PI / 2, 0, 0]} m={M.gold} />
        <Cyl p={[0, 1.1, 0.171]} rt={0.075} rb={0.075} h={0.006} r={[Math.PI / 2, 0, 0]} m={M.ivory} />
        <Block p={[0, 1.12, 0.176]} s={[0.008, 0.05, 0.004]} round={0.001} m={M.gold} />
        <Block p={[0.014, 1.1, 0.176]} s={[0.032, 0.008, 0.004]} round={0.001} m={M.gold} />
        <Cyl p={[0.162, 1.1, 0]} rt={0.095} rb={0.095} h={0.015} r={[0, 0, Math.PI / 2]} m={M.gold} />
        <Cyl p={[0.171, 1.1, 0]} rt={0.075} rb={0.075} h={0.006} r={[0, 0, Math.PI / 2]} m={M.ivory} />
        <Cyl p={[-0.162, 1.1, 0]} rt={0.095} rb={0.095} h={0.015} r={[0, 0, Math.PI / 2]} m={M.gold} />
        <Cyl p={[0, 1.1, -0.162]} rt={0.095} rb={0.095} h={0.015} r={[Math.PI / 2, 0, 0]} m={M.gold} />
        <Block p={[0, 1.27, 0]} s={[0.26, 0.12, 0.26]} m={M.green} />
        <Cyl p={[0, 1.47, 0]} rt={0} rb={0.19} h={0.3} seg={4} r={[0, Q, 0]} m={M.green} />
        <Cyl p={[0, 1.66, 0]} rt={0.004} rb={0.014} h={0.1} seg={8} m={M.gold} />
      </group>

      <group position={[0.32, 0, -0.42]}>
        <Block p={[0, 0.2, 0]} s={[0.72, 0.4, 0.22]} />
        <Block p={[0, 0.41, 0]} s={[0.72, 0.03, 0.22]} m={M.ivory} />
        <Block p={[0, 0.22, 0.112]} s={[0.64, 0.12, 0.01]} m={M.goldSoft} />
        {[-0.32, -0.16, 0, 0.16, 0.32].map((x) => (
          <Cyl key={x} p={[x, 0.49, 0.08]} rt={0} rb={0.025} h={0.14} seg={8} m={M.gold} />
        ))}
      </group>

      <group position={[0.3, 0, 0.36]} rotation={[0, -0.35, 0]}>
        <Block p={[0, 0.2, 0]} s={[0.5, 0.3, 0.18]} m={M.red} />
        <Block p={[0, 0.27, 0]} s={[0.505, 0.06, 0.185]} />
        <Block p={[0, 0.15, 0]} s={[0.505, 0.05, 0.185]} />
        <Block p={[0, 0.36, 0]} s={[0.48, 0.02, 0.16]} m={M.ivory} />
        <Cyl p={[0.15, 0.05, 0.08]} rt={0.05} rb={0.05} h={0.03} r={[Math.PI / 2, 0, 0]} m={M.greenDeep} />
        <Cyl p={[-0.15, 0.05, 0.08]} rt={0.05} rb={0.05} h={0.03} r={[Math.PI / 2, 0, 0]} m={M.greenDeep} />
        <Cyl p={[0.15, 0.05, -0.08]} rt={0.05} rb={0.05} h={0.03} r={[Math.PI / 2, 0, 0]} m={M.greenDeep} />
        <Cyl p={[-0.15, 0.05, -0.08]} rt={0.05} rb={0.05} h={0.03} r={[Math.PI / 2, 0, 0]} m={M.greenDeep} />
      </group>

      <group position={[-0.62, 0, 0.42]} rotation={[0, 0.4, 0]}>
        <Block p={[0, 0.17, 0]} s={[0.13, 0.34, 0.13]} m={M.red} />
        <Block p={[0, 0.35, 0]} s={[0.15, 0.03, 0.15]} m={M.red} />
        <Block p={[0, 0.37, 0]} s={[0.13, 0.014, 0.13]} m={M.ivory} />
        <Block p={[0, 0.21, 0.066]} s={[0.09, 0.16, 0.006]} round={0.002} />
      </group>

      <Tree p={[-0.74, 0, -0.12]} h={0.5} snow />
      <Tree p={[0.84, 0, 0.12]} h={0.36} snow />
      <Lamp p={[-0.26, 0, 0.6]} />
      <Lamp p={[0.78, 0, -0.2]} />
    </group>
  )
}

export function Paris() {
  return (
    <group>
      <Tower p={[0, 0, -0.22]} m={M.gold} accent={M.goldSoft} />
      <House p={[-0.64, 0, 0.14]} w={0.26} h={0.26} roof={M.ivory} rotY={0.55} />
      <House p={[-0.52, 0, -0.62]} w={0.3} h={0.34} roof={M.ivory} rotY={0.3} />
      <group position={[0.62, 0, 0.24]} rotation={[0, -0.5, 0]}>
        <House p={[0, 0, 0]} w={0.28} h={0.22} roof={M.ivory} />
        <Block p={[0, 0.16, 0.13]} s={[0.3, 0.018, 0.08]} r={[0.35, 0, 0]} m={M.red} />
        <Cyl p={[0.06, 0.04, 0.22]} rt={0.035} rb={0.035} h={0.01} m={M.ivory} />
        <Cyl p={[0.06, 0.02, 0.22]} rt={0.005} rb={0.005} h={0.04} m={M.gold} />
      </group>
      <Tree p={[0.34, 0, 0.62]} h={0.36} snow />
      <Tree p={[-0.3, 0, 0.62]} h={0.44} snow />
      <Lamp p={[0.04, 0, 0.64]} />
      <Lamp p={[0.6, 0, -0.5]} />
      <Snowman p={[0.82, 0, -0.22]} />
    </group>
  )
}

export function Moscow() {
  return (
    <group>
      <Block p={[0, 0.1, -0.15]} s={[0.9, 0.2, 0.55]} m={M.red} />
      <Block p={[0, 0.205, -0.15]} s={[0.9, 0.022, 0.55]} m={M.ivory} />
      <Block p={[0, 0.12, 0.128]} s={[0.84, 0.04, 0.01]} />
      <Block p={[0, 0.1, 0.128]} s={[0.12, 0.16, 0.012]} m={M.gold} />

      <Cyl p={[0, 0.55, -0.2]} rt={0.11} rb={0.12} h={0.7} />
      <Cyl p={[0, 0.9, -0.2]} rt={0.125} rb={0.125} h={0.03} m={M.gold} />
      <Cyl p={[0, 1.07, -0.2]} rt={0.02} rb={0.115} h={0.32} seg={8} m={M.green} />
      <Onion p={[0, 1.21, -0.2]} R={0.045} m={M.gold} />

      <Cyl p={[-0.3, 0.38, -0.02]} rt={0.08} rb={0.085} h={0.36} />
      <Onion p={[-0.3, 0.56, -0.02]} R={0.1} m={M.red} />
      <Cyl p={[0.3, 0.38, -0.02]} rt={0.08} rb={0.085} h={0.36} />
      <Onion p={[0.3, 0.56, -0.02]} R={0.1} m={M.green} />
      <Cyl p={[-0.28, 0.45, -0.38]} rt={0.07} rb={0.075} h={0.5} />
      <Onion p={[-0.28, 0.7, -0.38]} R={0.09} m={M.gold} />
      <Cyl p={[0.28, 0.45, -0.38]} rt={0.07} rb={0.075} h={0.5} />
      <Onion p={[0.28, 0.7, -0.38]} R={0.09} m={M.red} />
      <Cyl p={[0, 0.32, 0.1]} rt={0.065} rb={0.07} h={0.24} />
      <Onion p={[0, 0.44, 0.1]} R={0.08} m={M.green} />

      <Ball p={[-0.3, 0.6, -0.02]} r={0.07} s={[1.25, 0.35, 1.25]} m={M.ivory} />
      <Ball p={[0.28, 0.73, -0.38]} r={0.06} s={[1.25, 0.35, 1.25]} m={M.ivory} />

      <Tree p={[-0.7, 0, 0.34]} h={0.5} snow />
      <Tree p={[0.7, 0, 0.34]} h={0.45} snow />
      <Tree p={[-0.8, 0, -0.34]} h={0.4} snow />
      <Tree p={[0.8, 0, -0.3]} h={0.38} snow />
      <Snowman p={[0.3, 0, 0.62]} />
      <Lamp p={[-0.3, 0, 0.62]} />
    </group>
  )
}
