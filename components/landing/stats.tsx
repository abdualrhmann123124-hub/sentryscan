// Placeholder launch metrics — replace with real numbers once you have usage data.
const stats = [
  { value: "4", label: "scan modules per run" },
  { value: "~20s", label: "median scan time" },
  { value: "0", label: "credentials required" },
  { value: "100%", label: "checks run live, not cached" },
];

export function Stats() {
  return (
    <section className="border-y border-base-border bg-base-raised/50">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-14 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center sm:text-left">
            <div className="font-display text-3xl font-semibold text-signal">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-wide text-ink-muted">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
