import { useEffect, useLayoutEffect, useMemo } from "react"
import { useThree } from "@react-three/fiber"
import * as THREE from "three"

// CSS is not part of Three's transmission buffer. Reproduce the page's
// backdrop in that buffer, aligned in page space, so glass refracts the same
// gold gradient seen outside its silhouette instead of an opaque clear color.
export function GlobeBackdrop() {
  const { gl, size } = useThree()
  const material = useMemo(() => new THREE.ShaderMaterial({
    depthWrite: false,
    depthTest: false,
    toneMapped: false,
    uniforms: {
      uCanvasRect: { value: new THREE.Vector4(0, 0, 1, 1) },
      uPageSize: { value: new THREE.Vector2(1, 1) },
      uCenter: { value: new THREE.Vector2() },
      uStops: { value: new THREE.Vector2() },
      uStrength: { value: new THREE.Vector2() },
      uSurface: { value: new THREE.Vector3() },
      uGold: { value: new THREE.Vector3() },
    },
    vertexShader: `
      varying vec2 vBackdropUv;
      void main() {
        vBackdropUv = uv;
        gl_Position = vec4(position.xy, 1.0, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec4 uCanvasRect;
      uniform vec2 uPageSize;
      uniform vec2 uCenter;
      uniform vec2 uStops;
      uniform vec2 uStrength;
      uniform vec3 uSurface;
      uniform vec3 uGold;
      varying vec2 vBackdropUv;
      void main() {
        vec2 pagePoint = uCanvasRect.xy
          + vec2(vBackdropUv.x, 1.0 - vBackdropUv.y) * uCanvasRect.zw;
        vec2 center = uCenter * uPageSize;
        // CSS radial-gradient's default ellipse uses farthest-corner sizing.
        vec2 radii = max(abs(center), abs(uPageSize - center)) * sqrt(2.0);
        float radius = length((pagePoint - center) / max(radii, vec2(1.0)));
        float first = mix(uStrength.x, uStrength.y, clamp(radius / uStops.x, 0.0, 1.0));
        float second = uStrength.y * (1.0 - clamp(
          (radius - uStops.x) / (uStops.y - uStops.x), 0.0, 1.0));
        float opacity = radius < uStops.x ? first : second;
        // Interpolate in sRGB just like the CSS backdrop, then supply linear
        // light to Three's transmission target and normal output transform.
        vec3 srgb = mix(uSurface, uGold, opacity);
        vec3 linearColor = mix(srgb / 12.92,
          pow((srgb + 0.055) / 1.055, vec3(2.4)), step(vec3(0.04045), srgb));
        gl_FragColor = vec4(linearColor, 1.0);
        #include <colorspace_fragment>
      }
    `,
  }), [])

  useLayoutEffect(() => {
    const canvas = gl.domElement
    const page = canvas.closest<HTMLElement>(".christmas-editorial")
    if (!page) return
    const swatch = document.createElement("canvas")
    swatch.width = swatch.height = 1
    const context = swatch.getContext("2d")

    const syncBackdrop = () => {
      const rect = canvas.getBoundingClientRect()
      const bounds = page.getBoundingClientRect()
      const styles = getComputedStyle(page)
      const percent = (name: string) => parseFloat(styles.getPropertyValue(name)) / 100
      const color = (name: string, target: THREE.Vector3) => {
        if (!context) return
        context.clearRect(0, 0, 1, 1)
        context.fillStyle = styles.getPropertyValue(name).trim()
        context.fillRect(0, 0, 1, 1)
        const [r, g, b] = context.getImageData(0, 0, 1, 1).data
        target.set(r / 255, g / 255, b / 255)
      }
      material.uniforms.uCanvasRect.value.set(
        rect.left - bounds.left, rect.top - bounds.top, rect.width, rect.height,
      )
      material.uniforms.uPageSize.value.set(bounds.width, bounds.height)
      material.uniforms.uCenter.value.set(
        percent("--globe-gradient-x"), percent("--globe-gradient-y"),
      )
      material.uniforms.uStops.value.set(
        percent("--globe-gradient-middle"), percent("--globe-gradient-end"),
      )
      material.uniforms.uStrength.value.set(
        percent("--globe-gradient-peak"), percent("--globe-gradient-soft"),
      )
      color("--card", material.uniforms.uSurface.value)
      color("--accent", material.uniforms.uGold.value)
    }

    syncBackdrop()
    const resize = new ResizeObserver(syncBackdrop)
    resize.observe(page)
    resize.observe(canvas)
    // Keep alignment after responsive layout and design-system updates.
    const theme = new MutationObserver(syncBackdrop)
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] })
    window.addEventListener("resize", syncBackdrop)
    return () => {
      resize.disconnect()
      theme.disconnect()
      window.removeEventListener("resize", syncBackdrop)
    }
  }, [gl, material, size.width, size.height])

  useEffect(() => () => material.dispose(), [material])

  return (
    <mesh material={material} frustumCulled={false} renderOrder={-1000}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  )
}
