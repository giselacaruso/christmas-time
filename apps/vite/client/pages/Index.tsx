/**
 * Throwaway placeholder for `/`. Replace this whole file; it is not a layout.
 *
 * Shown in the live frame before the agent's first write, OR when the agent
 * wrote real code but parked it at a side route (e.g. `/login`) and left `/`
 * untouched. No visible text: `data-mercury-placeholder` marks the second case
 * in the DOM (`document.querySelector("[data-mercury-placeholder]")`). Theme
 * tokens only, so it takes the design-system palette when one is compiled into
 * global.css. See AGENTS.md "Home route and page plan".
 * Height stays a Tailwind class: the viewport Vite plugin rewrites `vh` in
 * compiled CSS only, not in this inline <style>.
 */
const css = `
.mp{display:flex;align-items:center;justify-content:center;background:var(--background);
  --sk-1:color-mix(in srgb,var(--muted-foreground) 14%,var(--muted));--sk-2:color-mix(in srgb,var(--muted-foreground) 26%,var(--muted))}
.mp-stack{container-type:inline-size;position:relative;width:min(84%,640px);aspect-ratio:933/588}
.mp-card{position:absolute;width:77%;height:68.7%;left:calc(var(--x) - 38.5%);top:calc(var(--y) - 34.35%);transform:rotate(var(--r));
  background:var(--card);border:1px solid color-mix(in srgb,var(--border) 70%,transparent);border-radius:1.6cqw;
  box-shadow:0 .3cqw 1cqw rgb(0 0 0/.08),0 .15cqw .45cqw rgb(0 0 0/.04),0 0 .1cqw rgb(0 0 0/.08)}
.mp-c1{--x:48.1%;--y:40%;--r:3.65deg}.mp-c2{--x:58.4%;--y:53.2%;--r:4deg}.mp-c3{--x:42%;--y:56.6%;--r:-5.66deg}
.mp-sk{position:absolute;background:var(--sk-1);border-radius:1.1cqw}
.mp-img{left:61%;top:11.6%;width:35%;height:77%}
.mp-b1,.mp-b2{height:6.2%;border-radius:999px}
.mp-b1{left:9%;top:41.6%;width:29%;background:var(--sk-2)}.mp-b2{left:9.4%;top:53%;width:48.2%}
.mp-flip .mp-img{left:3.8%}.mp-flip .mp-b1{left:63%}.mp-flip .mp-b2{left:43.3%}
@media (max-width:640px){.mp-stack{width:94%}}
@media (prefers-reduced-motion:no-preference){
  .mp-sk{background-image:linear-gradient(100deg,transparent 35%,color-mix(in srgb,var(--card) 65%,transparent) 50%,transparent 65%);
    background-size:250% 100%;background-repeat:no-repeat;background-position:150% 0;animation:mp-shim 2.2s ease-in-out infinite}
  .mp-c2 .mp-sk{animation-delay:.15s}.mp-c3 .mp-sk{animation-delay:.3s}
  @keyframes mp-shim{to{background-position:-50% 0}}
}`;

export default function Index() {
  return (
    <main className="mp min-h-screen" data-mercury-placeholder="home" aria-busy="true">
      <style>{css}</style>
      <div className="mp-stack" aria-hidden="true">
        {["mp-c1 mp-flip", "mp-c2 mp-flip", "mp-c3"].map((c) => (
          <div key={c} className={`mp-card ${c}`}>
            <div className="mp-sk mp-img" />
            <div className="mp-sk mp-b1" />
            <div className="mp-sk mp-b2" />
          </div>
        ))}
      </div>
    </main>
  );
}
