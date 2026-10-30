export function Progress({ percent }: { percent: number }) {
  // Visual bar uses a log-ish floor so tiny amounts are still visible.
  const visual = percent === 0 ? 0 : Math.max(1.5, percent);
  return (
    <section className="progress" aria-label="Mortgage paid">
      <div className="pct">
        {percent.toFixed(4)}
        <span>%</span>
      </div>
      <div className="label">of the mortgage paid by strangers</div>
      <div className="bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="fill" style={{ width: `${Math.min(100, visual)}%` }} />
      </div>
    </section>
  );
}
