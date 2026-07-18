import { Card, CardContent } from "@/components/ui/card";

// Placeholder testimonials for layout purposes — swap in real customer
// quotes (with permission) before this ships publicly.
const quotes = [
  {
    body: "We found out our staging subdomain still had an exposed .git directory within the first scan. Fixed it before anyone else did.",
    name: "Priya N.",
    role: "Platform engineer, placeholder co.",
  },
  {
    body: "Caught a TLS cert that was 9 days from expiring on a service nobody owned anymore. Cheap insurance.",
    name: "Marcus T.",
    role: "DevOps lead, placeholder co.",
  },
  {
    body: "The header report reads like something a security consultant would hand you — not a wall of raw JSON.",
    name: "Elena R.",
    role: "Founder, placeholder co.",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <p className="mono-tag">early feedback</p>
      <h2 className="mt-3 max-w-lg text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Illustrative quotes — swap for real ones at launch
      </h2>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {quotes.map((q) => (
          <Card key={q.name}>
            <CardContent className="flex h-full flex-col p-6">
              <p className="text-sm leading-relaxed text-ink">&ldquo;{q.body}&rdquo;</p>
              <div className="mt-6 font-mono text-xs text-ink-faint">
                {q.name} · {q.role}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
