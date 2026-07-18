import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "For a quick one-off check.",
    features: ["1 scan at a time", "All 4 scan modules", "Full report on-screen"],
    cta: "Run a scan",
    href: "/scan",
    highlighted: false,
    available: true,
  },
  {
    name: "Pro",
    price: "$19",
    cadence: "/ month",
    description: "For teams monitoring more than one domain.",
    features: ["Unlimited scans", "Scheduled re-scans", "Scan history & PDF export", "Email alerts on regressions"],
    cta: "Coming soon",
    href: "#",
    highlighted: true,
    available: false,
  },
  {
    name: "Team",
    price: "Custom",
    cadence: "",
    description: "For agencies scanning client portfolios.",
    features: ["Everything in Pro", "Multi-seat workspace", "API access", "Priority support"],
    cta: "Coming soon",
    href: "#",
    highlighted: false,
    available: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
      <p className="mono-tag">pricing</p>
      <h2 className="mt-3 max-w-lg text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Free today. Built to grow with you.
      </h2>
      <p className="mt-4 max-w-lg text-ink-muted">
        Only the Free tier is wired up in this build — Pro and Team are laid out and ready for
        billing to be connected.
      </p>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {tiers.map((t) => (
          <Card
            key={t.name}
            className={cn("relative", t.highlighted && "border-signal/60 shadow-[0_0_40px_-15px_rgba(61,242,165,0.25)]")}
          >
            {t.highlighted && (
              <span className="absolute -top-3 left-6 rounded-full bg-signal px-2.5 py-0.5 font-mono text-[11px] font-semibold text-base">
                planned
              </span>
            )}
            <CardContent className="flex h-full flex-col p-6">
              <h3 className="font-display text-lg font-semibold">{t.name}</h3>
              <p className="mt-1 text-sm text-ink-muted">{t.description}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold">{t.price}</span>
                <span className="text-sm text-ink-muted">{t.cadence}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild={t.available}
                disabled={!t.available}
                variant={t.highlighted ? "default" : "outline"}
                className="mt-6"
              >
                {t.available ? <a href={t.href}>{t.cta}</a> : <span>{t.cta}</span>}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
