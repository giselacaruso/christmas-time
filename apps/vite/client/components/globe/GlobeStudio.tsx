import { useEffect, useMemo } from "react"
import { useThree } from "@react-three/fiber"
import { Environment, Lightformer } from "@react-three/drei"
import * as THREE from "three"
import { P } from "./palette"
import { R_GLASS } from "./shake"

const GLASS_SEAT = -1.06
const glassEnd = Math.acos(GLASS_SEAT / R_GLASS)
const neckRadius = Math.sqrt(R_GLASS * R_GLASS - GLASS_SEAT * GLASS_SEAT)
// Optically clear glass, not a second layer of the cream ceramic glaze.
const clearGlass = new THREE.Color(P.porcelain).lerp(new THREE.Color(1, 1, 1), 0.96)
const studioGround = new THREE.Color(P.porcelain).lerp(new THREE.Color(P.shadow), 0.3)

export function GlobeGlass() {
  const pixelRatio = useThree((state) => state.viewport.dpr)
  const edge = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uColor: { value: new THREE.Color(P.shadow).lerp(new THREE.Color(P.porcelain), 0.3) },
      uHighlight: { value: clearGlass.clone() },
      uPixelRatio: { value: pixelRatio },
    },
    vertexShader: `
      varying vec3 vGlassNormal;
      varying vec3 vGlassView;
      void main() {
        vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
        vGlassNormal = normalize(normalMatrix * normal);
        vGlassView = -viewPosition.xyz;
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform vec3 uHighlight;
      uniform float uPixelRatio;
      varying vec3 vGlassNormal;
      varying vec3 vGlassView;
      void main() {
        vec3 normal = normalize(vGlassNormal);
        float facing = abs(dot(normal, normalize(vGlassView)));
        // Facing squared is approximately linear in distance from a sphere's
        // silhouette. Its derivative keeps the contour below one CSS pixel,
        // instead of turning a fixed Fresnel threshold into a thick dark rim
        // when the canvas grows. Smooth coverage also avoids a jagged stroke.
        float tangentDistance = facing * facing;
        float edgePixels = tangentDistance / max(fwidth(tangentDistance), 0.00001);
        float hairline = 1.0 - smoothstep(0.12, 0.85, edgePixels / uPixelRatio);

        // The upper-left softbox breaks up the outline with a pale glint;
        // the opposite side carries a slightly stronger, warm reflection.
        // A very faint, wider falloff suggests glass thickness without
        // tinting the clear centre or forming a uniform shaded border.
        float litSide = smoothstep(-0.7, 0.85, dot(normal.xy, normalize(vec2(-0.7, 0.75))));
        float grazing = pow(1.0 - facing, 7.0);
        float shade = grazing * (1.0 - litSide) * 0.045;
        float opacity = hairline * mix(0.46, 0.23, litSide) + shade;
        vec3 reflection = mix(uColor, uHighlight, litSide * 0.42);
        gl_FragColor = vec4(reflection, opacity);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  }), [])
  edge.uniforms.uPixelRatio.value = pixelRatio
  useEffect(() => () => edge.dispose(), [edge])

  return (
    <group>
      {/* An open-bottom shell, not a complete sphere intersecting the plinth.
          Its real dielectric reflection replaces the old luminous outline. */}
      <mesh renderOrder={10}>
        <sphereGeometry args={[R_GLASS, 160, 112, 0, Math.PI * 2, 0, glassEnd]} />
        <meshPhysicalMaterial
          color={clearGlass}
          transmission={1}
          thickness={0.02}
          roughness={0.022}
          ior={1.46}
          metalness={0}
          clearcoat={0}
          envMapIntensity={0.98}
          specularIntensity={1}
          depthWrite={false}
          attenuationDistance={Infinity}
        />
      </mesh>
      <mesh material={edge} renderOrder={12}>
        <sphereGeometry args={[R_GLASS + 0.001, 160, 112, 0, Math.PI * 2, 0, glassEnd]} />
      </mesh>
      {/* The tiny rolled glass lip gives the shell actual thickness at its seat. */}
      <mesh position={[0, GLASS_SEAT + 0.012, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={11}>
        <torusGeometry args={[neckRadius, 0.012, 12, 144]} />
        <meshPhysicalMaterial color={clearGlass} transmission={1} thickness={0.012} roughness={0.018} ior={1.46} envMapIntensity={0.82} specularIntensity={0.9} depthWrite={false} />
      </mesh>
    </group>
  )
}

export function StudioLights() {
  return (
    <>
      <hemisphereLight args={[P.porcelain, P.shadow, 0.18]} />
      <directionalLight
        position={[-3.8, 6, 5]}
        intensity={2.3}
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
        <color attach="background" args={[studioGround]} />
        <Lightformer form="rect" intensity={4} color={P.porcelain} position={[-3.5, 4, 5]} scale={[2, 3, 1]} onUpdate={(light) => light.lookAt(0, 0, 0)} />
        <Lightformer form="rect" intensity={4} color={P.porcelain} position={[5, 1, 3]} scale={[1, 4, 1]} onUpdate={(light) => light.lookAt(0, 0, 0)} />
        <Lightformer form="rect" intensity={1.8} color={P.porcelain} position={[0, 6, 0]} scale={[5, 3, 1]} onUpdate={(light) => light.lookAt(0, 0, 0)} />
        <Lightformer form="rect" intensity={1.1} color={P.fill} position={[-2, 2, -4]} scale={[3, 4, 1]} onUpdate={(light) => light.lookAt(0, 0, 0)} />
        {/* Narrow studio flags make separate curved dark reflections, not a
            uniform dark ring, so the clear glass still reads on white. */}
        <Lightformer form="rect" intensity={0.16} color={P.shadow} position={[-5, 1.4, 0]} scale={[0.65, 3.6, 1]} onUpdate={(light) => light.lookAt(0, 0, 0)} />
        <Lightformer form="rect" intensity={0.22} color={P.shadow} position={[5, -0.3, -1]} scale={[1.1, 2.8, 1]} onUpdate={(light) => light.lookAt(0, 0, 0)} />
      </Environment>
    </>
  )
}

export function GroundShadow() {
  const { gl, size } = useThree()
  const viewport = useMemo(() => new THREE.Vector2(), [])
  viewport.set(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio())

  const contact = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uColor: { value: new THREE.Color(P.shadow) },
      uViewport: { value: viewport },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform vec2 uViewport;
      varying vec2 vUv;
      void main() {
        float r = length((vUv - 0.5) * 2.0);
        float penumbra = (1.0 - smoothstep(0.38, 0.78, r)) * 0.13;
        float contact = (1.0 - smoothstep(0.39, 0.49, r)) * 0.16;
        vec2 screenUv = gl_FragCoord.xy / uViewport;
        vec2 edge = min(screenUv, 1.0 - screenUv);
        float frameFade = smoothstep(0.0, 0.12, min(edge.x, edge.y));
        gl_FragColor = vec4(uColor, (penumbra + contact) * frameFade);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  }), [viewport])
  useEffect(() => () => contact.dispose(), [contact])

  return (
    <group>
      <mesh position={[0, -1.758, 0]} rotation={[-Math.PI / 2, 0, 0]} material={contact}>
        <planeGeometry args={[6, 6]} />
      </mesh>
      {/* A real shadow receiver: unlike a depth-capture contact pass, it does
          not mistake the transparent glass shell for a solid shadow caster. */}
      <mesh position={[0, -1.756, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <shadowMaterial
          color={P.shadow}
          transparent
          opacity={0.2}
          depthWrite={false}
          onBeforeCompile={(shader) => {
            shader.uniforms.uShadowViewport = { value: viewport }
            shader.vertexShader = shader.vertexShader
              .replace("#include <common>", "#include <common>\nvarying vec2 vFloorUv;")
              .replace("#include <begin_vertex>", "#include <begin_vertex>\nvFloorUv = uv;")
            shader.fragmentShader = shader.fragmentShader
              .replace("#include <common>", "#include <common>\nvarying vec2 vFloorUv;\nuniform vec2 uShadowViewport;")
              .replace("#include <tonemapping_fragment>", `
                float floorRadius = length((vFloorUv - 0.5) * 2.0);
                float floorFade = 1.0 - smoothstep(0.48, 0.88, floorRadius);
                vec2 screenUv = gl_FragCoord.xy / uShadowViewport;
                vec2 edge = min(screenUv, 1.0 - screenUv);
                float frameFade = smoothstep(0.0, 0.12, min(edge.x, edge.y));
                gl_FragColor.a *= floorFade * frameFade;
                #include <tonemapping_fragment>
              `)
          }}
        />
      </mesh>
    </group>
  )
}
