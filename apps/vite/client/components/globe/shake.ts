import * as THREE from "three"

export interface ShakeState {
  dragging: boolean
  startX: number
  startY: number
  lastX: number
  lastY: number
  offX: number
  offY: number
  spin: number
  energy: number
  accel: THREE.Vector3
}

export function createShake(): ShakeState {
  return {
    dragging: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    offX: 0,
    offY: 0,
    spin: 0,
    energy: 1.6,
    accel: new THREE.Vector3(),
  }
}

export const R_GLASS = 1.6
export const RMAX = 1.5
export const GROUND_Y = -0.85
export const GROUND_R = 1.33

export function floorAt(x: number, z: number) {
  const r2 = (x * x + z * z) / (GROUND_R * GROUND_R)
  return GROUND_Y + 0.16 * Math.sqrt(Math.max(0, 1 - r2)) + 0.012
}
