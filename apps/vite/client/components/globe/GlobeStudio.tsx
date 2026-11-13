import { useEffect, useMemo } from "react"
import { Environment, Lightformer } from "@react-three/drei"
import * as THREE from "three"
import { P } from "./palette"
import { R_GLASS } from "./shake"

const GLASS_SEAT = -1.06
const glassEnd = Math.acos(GLASS_SEAT / R_GLASS)
const neckRadius = Math.sqrt(R_GLASS * R_GLASS - GLASS_SEAT * GLASS_SEAT)
// Optically clear glass, not a second layer of the cream ceramic glaze.
const clearGlass = new THREE.Color(P.porcelain).lerp(new THREE.Color(1, 1, 1), 0.96)

export function GlobeGlass() {
  return (
    <group>
      {/* An open-bottom shell, not a complete sphere intersecting the plinth.
          Its real dielectric reflection replaces the old luminous outline. */}
      <mesh renderOrder={10}>
        <sphereGeometry args={[R_GLASS, 160, 112, 0, Math.PI * 2, 0, glassEnd]} />
        <meshPhysicalMaterial
          color={clearGlass}
          transmission={1}
          thickness={0.018}
          roughness={0.008}
          ior={1.34}
          metalness={0}
          clearcoat={0}
          envMapIntensity={0.48}
          specularIntensity={0.58}
          depthWrite={false}
          attenuationDistance={Infinity}
        />
      </mesh>
      {/* The tiny rolled glass lip gives the shell actual thickness at its seat. */}
      <mesh position={[0, GLASS_SEAT + 0.012, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={11}>
        <torusGeometry args={[neckRadius, 0.012, 12, 144]} />
        <meshPhysicalMaterial color={clearGlass} transmission={1} thickness={0.012} roughness={0.018} ior={1.34} envMapIntensity={0.48} specularIntensity={0.58} depthWrite={false} />
      </mesh>
    </group>
  )
}

export function StudioLights() {
  return (
    <>
      <hemisphereLight args={[P.porcelain, P.shadow, 0.26]} />
      <directionalLight
        position={[-3.8, 6, 5]}
        intensity={2.5}
        color={P.porcelain}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-bias={-0.00008}
        shadow-normalBias={0.005}
        shadow-camera-left={-2.8}
        shadow-camera-right={2.8}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-camera-near={1}
        shadow-camera-far={17}
      />
      <directionalLight position={[4, 2, -3]} intensity={0.75} color={P.fill} />
      {/* Contrasting studio cards produce curved, rectangular reflections on
          the glass and broad, smooth highlights on the ceramic glaze. */}
      <Environment resolution={512} frames={1}>
        <color attach="background" args={[P.studio]} />
        <Lightformer form="rect" intensity={4.5} color={P.porcelain} position={[-4.5, 3.2, 4]} scale={[3, 4.5, 1]} onUpdate={(light) => light.lookAt(0, 0, 0)} />
        <Lightformer form="rect" intensity={3.2} color={P.porcelain} position={[5, 1, 2]} scale={[0.8, 5, 1]} onUpdate={(light) => light.lookAt(0, 0, 0)} />
        <Lightformer form="rect" intensity={1.8} color={P.porcelain} position={[0, 6, 0]} scale={[5, 3, 1]} onUpdate={(light) => light.lookAt(0, 0, 0)} />
        <Lightformer form="rect" intensity={1.1} color={P.fill} position={[-2, 2, -4]} scale={[3, 4, 1]} onUpdate={(light) => light.lookAt(0, 0, 0)} />
      </Environment>
    </>
  )
}

export function GroundShadow() {
  const contact = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uColor: { value: new THREE.Color(P.shadow) } },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float r = length((vUv - 0.5) * 2.0);
        float penumbra = (1.0 - smoothstep(0.38, 0.78, r)) * 0.13;
        float contact = (1.0 - smoothstep(0.39, 0.49, r)) * 0.16;
        gl_FragColor = vec4(uColor, penumbra + contact);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  }), [])
  useEffect(() => () => contact.dispose(), [contact])

  return (
    <group>
      <mesh position={[0, -1.758, 0]} rotation={[-Math.PI / 2, 0, 0]} material={contact}>
        <planeGeometry args={[7, 7]} />
      </mesh>
      {/* A real shadow receiver: unlike a depth-capture contact pass, it does
          not mistake the transparent glass shell for a solid shadow caster. */}
      <mesh position={[0, -1.756, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial color={P.shadow} transparent opacity={0.22} depthWrite={false} />
      </mesh>
    </group>
  )
}
