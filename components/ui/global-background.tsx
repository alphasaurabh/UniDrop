export function GlobalBackground() {
  return (
    <div aria-hidden="true" className="global-bg fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      <div className="global-bg__base" />
      <div className="global-bg__grid" />
      <div className="global-bg__glow global-bg__glow--one" />
      <div className="global-bg__noise" />
      <div className="global-bg__vignette" />
    </div>
  );
}
