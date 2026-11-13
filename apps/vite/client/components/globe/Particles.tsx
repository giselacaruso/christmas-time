import { useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { Climate } from "../../data/cities"
import { flakeMaterial, glitterMaterial } from "./materials"
import { P } from "./palette"
import { RMAX, floorAt, type ShakeState } from "./shake"

const GLITTER = [P.gold, P.gold, P.goldSoft, P.gold, P.goldSoft, P.red, P.porcelain]

interface Props {
  climate: Climate
  density: number
  shake: MutableRefObject<ShakeState>
}

export function Particles({ climate, density, shake }: Props) {
  const snow = climate === "snow"
  const count = Math.round((snow ? 1450 : 650) * density)
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const geo = useMemo(
    () => (snow ? new THREE.IcosahedronGeometry(0.0048, 0) : new THREE.PlaneGeometry(0.011, 0.007)),
    [snow],
  )

  const d = useMemo(() => {
    const p = new Float32Array(count * 3)
    const v = new Float32Array(count * 3)
    const rot = new Float32Array(count * 3)
    const spin = new Float32Array(count * 3)
    const sc = new Float32Array(count)
    const rest = new Uint8Array(count)
    for (let i = 0; i < count; i++) {
      let x = 0
      let y = 0
      let z = 0
      for (let tries = 0; tries < 20; tries++) {
        x = (Math.random() * 2 - 1) * 1.35
        y = (Math.random() * 2 - 1) * 1.35
        z = (Math.random() * 2 - 1) * 1.35
        if (x * x + y * y + z * z < 1.35 * 1.35 && y > floorAt(x, z) + 0.05) break
      }
      p.set([x, y, z], i * 3)
      rot.set([Math.random() * 6, Math.random() * 6, Math.random() * 6], i * 3)
      spin.set([(Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6], i * 3)
      sc[i] = 0.45 + Math.pow(Math.random(), 1.6) * 0.85
    }
    return { p, v, rot, spin, sc, rest }
  }, [count])

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh || snow) return
    const c = new THREE.Color()
    for (let i = 0; i < count; i++) {
      c.set(GLITTER[Math.floor(Math.random() * GLITTER.length)])
      mesh.setColorAt(i, c)
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [count, snow])

  useFrame((state, raw) => {
    const mesh = ref.current
    if (!mesh) return
    const dt = Math.min(raw, 1 / 30)
    const s = shake.current
    const e = s.energy
    const ax = s.accel.x
    const ay = s.accel.y
    const g = snow ? 0.19 : 0.29
    const drag = Math.exp(-(snow ? 3.1 : 2.4) * dt)
    const t = state.clock.elapsedTime
    const jit = e * 2.6
    const { p, v, rot, spin, sc, rest } = d

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      let px = p[i3]
      let py = p[i3 + 1]
      let pz = p[i3 + 2]

      if (rest[i] && e > 0.35 && Math.random() < e * dt * 2.2) {
        rest[i] = 0
        v[i3] = (Math.random() - 0.5) * e * 0.6
        v[i3 + 1] = 0.3 + Math.random() * e * 0.55
        v[i3 + 2] = (Math.random() - 0.5) * e * 0.6
      }

      if (!rest[i]) {
        const flutterX = Math.sin(t * (snow ? 1.3 : 2.6) + i) * (snow ? 0.045 : 0.065)
        const flutterZ = Math.cos(t * 1.1 + i * 1.7) * 0.045
        v[i3] = (v[i3] + (-ax * 0.08 - pz * e * 0.8 + (Math.random() - 0.5) * jit + flutterX) * dt) * drag
        v[i3 + 1] = (v[i3 + 1] + (-g - ay * 0.08 + e * 0.32 + (Math.random() - 0.5) * jit) * dt) * drag
        v[i3 + 2] = (v[i3 + 2] + (px * e * 0.8 + (Math.random() - 0.5) * jit + flutterZ) * dt) * drag
        px += v[i3] * dt
        py += v[i3 + 1] * dt
        pz += v[i3 + 2] * dt

        const l = Math.sqrt(px * px + py * py + pz * pz)
        if (l > RMAX) {
          const k = RMAX / l
          px *= k
          py *= k
          pz *= k
          const nx = px / RMAX
          const ny = py / RMAX
          const nz = pz / RMAX
          const vn = v[i3] * nx + v[i3 + 1] * ny + v[i3 + 2] * nz
          if (vn > 0) {
            v[i3] -= nx * vn * 1.4
            v[i3 + 1] -= ny * vn * 1.4
            v[i3 + 2] -= nz * vn * 1.4
          }
        }

        const fy = floorAt(px, pz)
        if (py < fy) {
          py = fy
          if (e < 0.3) {
            rest[i] = 1
            v[i3] = 0
            v[i3 + 1] = 0
            v[i3 + 2] = 0
          } else {
            v[i3 + 1] = Math.abs(v[i3 + 1]) * 0.35
          }
        }
        rot[i3] += spin[i3] * dt
        rot[i3 + 1] += spin[i3 + 1] * dt
        rot[i3 + 2] += spin[i3 + 2] * dt
      }

      p[i3] = px
      p[i3 + 1] = py
      p[i3 + 2] = pz
      dummy.position.set(px, py, pz)
      dummy.rotation.set(rot[i3], rot[i3 + 1], rot[i3 + 2])
      const k = sc[i]
      if (snow) dummy.scale.set(k, k * 0.72, k)
      else dummy.scale.setScalar(k)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={ref} args={[geo, snow ? flakeMaterial : glitterMaterial, count]} frustumCulled={false} />
}
