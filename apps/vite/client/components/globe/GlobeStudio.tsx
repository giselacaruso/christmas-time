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

// Painted-light volume pass: curved softbox windows, a rim streak, Fresnel
// sheen, an inner wall contour and a warm caustic. These are the cues that
// make a real glass sphere read as round, not as a flat clear disc.
const volumeVertex = `
  varying vec3 vVolNormal;
  varying vec3 vVolView;
  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vVolNormal = normalize(normalMatrix * normal);
    vVolView = -viewPosition.xyz;
    gl_Position = projectionMatrix * viewPosition;
  }
`

const volumeFragment = `
  uniform vec3 uLight;
  uniform vec3 uDark;
  uniform vec3 uGold;
  uniform float uBack;
  varying vec3 vVolNormal;
  varying vec3 vVolView;

  float roundedRect(vec2 p, vec2 halfSize, float radius) {
    vec2 d = abs(p) - halfSize + radius;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
  }
  mat2 rot(float a) { float c = cos(a); float s = sin(a); return mat2(c, -s, s, c); }

  void main() {
    vec3 n = normalize(vVolNormal);
    vec3 v = normalize(vVolView);
    float facing = abs(dot(n, v));
    vec2 s = n.xy;
    float rr = length(s);
    float ang = atan(s.y, s.x);
    float aW = 0.0;
    float aD = 0.0;
    float aG = 0.0;

    if (uBack < 0.5) {
      // Main softbox window, bent along the sphere toward the rim.
      vec2 w = rot(0.62) * (s - vec2(-0.47, 0.47));
      w.y += w.x * w.x * 0.9;
      float win = roundedRect(w, vec2(0.085, 0.2), 0.05);
      aW += (1.0 - smoothstep(-0.015, 0.035, win)) * 0.62;
      aW += (1.0 - smoothstep(0.0, 0.22, win)) * 0.1;
      // Second, narrower pane beside it.
      vec2 w2 = rot(0.62) * (s - vec2(-0.27, 0.62));
      w2.y += w2.x * w2.x * 0.9;
      float pane = roundedRect(w2, vec2(0.035, 0.12), 0.03);
      aW += (1.0 - smoothstep(-0.01, 0.03, pane)) * 0.42;
      // Pin-point glints.
      vec2 g1 = s - vec2(-0.33, 0.3);
      aW += exp(-dot(g1, g1) / 0.0007) * 0.75;
      vec2 g2 = s - vec2(0.42, 0.58);
      aW += exp(-dot(g2, g2) / 0.0012) * 0.4;

      // Long curved reflection hugging the right rim.
      float arcBand = smoothstep(0.8, 0.86, rr) * (1.0 - smoothstep(0.9, 0.94, rr));
      float arcSpan = smoothstep(-0.85, -0.45, ang) * (1.0 - smoothstep(0.35, 0.8, ang));
      aW += arcBand * arcSpan * 0.5;
      // Thin upper-left rim reflection.
      float topBand = smoothstep(0.9, 0.935, rr) * (1.0 - smoothstep(0.955, 0.975, rr));
      float topSpan = smoothstep(1.55, 1.95, ang) * (1.0 - smoothstep(2.4, 2.85, ang));
      aW += topBand * topSpan * 0.55;

      // Fresnel sheen lifts the contents near the rim: the glass bulges.
      float fres = pow(1.0 - facing, 3.5);
      aW += fres * 0.3;

      // Inner wall contour: a faint second outline that gives the shell thickness.
      float wall = exp(-pow((rr - 0.958) / 0.012, 2.0));
      float shadedSide = 1.0 - smoothstep(-0.4, 0.8, dot(normalize(s + 1e-5), normalize(vec2(-0.7, 0.75))));
      aD += wall * (0.05 + shadedSide * 0.1);
      // Grazing darkening on the lower right — light falling off the curve.
      aD += pow(1.0 - facing, 6.0) * shadedSide * 0.12;
      // Thick-glass depth: a soft, all-round darkening that deepens toward
      // the rim (stronger on the shaded side) without a hard ring.
      float depthFall = smoothstep(0.62, 0.985, rr);
      aD += depthFall * depthFall * (0.09 + shadedSide * 0.08);

      // Warm caustic focusing toward the base, like light through water.
      float caustic = smoothstep(0.6, 0.9, rr) * smoothstep(-3.0, -2.6, ang) * (1.0 - smoothstep(-1.4, -1.0, ang));
      aG += caustic * 0.16;
    } else {
      // Far inside wall: mirrored, dimmer window and a soft warm bounce.
      vec2 w = rot(-0.5) * (s - vec2(0.5, -0.12));
      float win = roundedRect(w, vec2(0.08, 0.24), 0.06);
      aW += (1.0 - smoothstep(-0.02, 0.08, win)) * 0.2;
      float fres = pow(1.0 - facing, 3.0);
      aW += fres * 0.1;
      aG += smoothstep(0.55, 0.95, rr) * (1.0 - smoothstep(-0.8, 0.2, s.y)) * 0.07;
    }

    float alpha = clamp(aW + aD + aG, 0.0, 0.92);
    vec3 color = (uLight * aW + uDark * aD + uGold * aG) / max(aW + aD + aG, 1e-4);
    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

function makeVolume(back: boolean) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: back ? THREE.BackSide : THREE.FrontSide,
    uniforms: {
      uLight: { value: new THREE.Color(1, 1, 1) },
      uDark: { value: new THREE.Color(P.shadow).lerp(new THREE.Color(P.porcelain), 0.2) },
      uGold: { value: new THREE.Color(P.gold) },
      uBack: { value: back ? 1 : 0 },
    },
    vertexShader: volumeVertex,
    fragmentShader: volumeFragment,
  })
}

export function GlobeGlass() {
  const volumeFront = useMemo(() => makeVolume(false), [])
  const volumeBack = useMemo(() => makeVolume(true), [])
  useEffect(() => () => { volumeFront.dispose(); volumeBack.dispose() }, [volumeFront, volumeBack])
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
      {/* A thin dielectric shell: the page-matched 3D backdrop supplies real
          transmission, while studio reflections stay on the glass surface. */}
      <mesh renderOrder={10}>
        <sphereGeometry args={[R_GLASS, 160, 112, 0, Math.PI * 2, 0, glassEnd]} />
        <meshPhysicalMaterial
          color={clearGlass}
          transmission={1}
          thickness={0.34}
          roughness={0.012}
          ior={1.52}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.03}
          envMapIntensity={1.05}
          specularIntensity={1}
          depthWrite={false}
          attenuationDistance={Infinity}
        />
      </mesh>
      <mesh material={volumeBack} renderOrder={13}>
        <sphereGeometry args={[R_GLASS - 0.004, 128, 96, 0, Math.PI * 2, 0, glassEnd]} />
      </mesh>
      <mesh material={volumeFront} renderOrder={14}>
        <sphereGeometry args={[R_GLASS + 0.002, 160, 112, 0, Math.PI * 2, 0, glassEnd]} />
      </mesh>
      <mesh material={edge} renderOrder={15}>
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
