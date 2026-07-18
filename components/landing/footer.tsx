import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-base-border">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-start justify-between gap-8 rounded-xl border border-base-border bg-base-surface p-8 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-display text-xl font-semibold">Run your first scan</h3>
            <p className="mt-1 text-sm text-ink-muted">Takes about 20 seconds. No account needed.</p>
          </div>
          <Button asChild size="lg">
            <Link href="/scan">Scan a site</Link>
          </Button>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-signal" />
            <span className="font-display text-sm font-semibold">SentryScan</span>
          </div>
          <p className="font-mono text-xs text-ink-faint">
            for use on domains you own or are authorized to test.
          </p>
        </div>
      </div>
    </footer>
  );
}
