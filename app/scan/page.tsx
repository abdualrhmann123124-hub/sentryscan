"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { ScanForm } from "@/components/scanner/scan-form";
import { ScanResults } from "@/components/scanner/scan-results";
import type { ScanApiResponse } from "@/lib/scanner/client";

export default function ScanPage() {
  const [report, setReport] = useState<ScanApiResponse | null>(null);

  return (
    <div className="min-h-screen bg-grid-fade bg-grid">
      <header className="border-b border-base-border/60">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-signal" strokeWidth={2.25} />
            <span className="font-display text-base font-semibold tracking-tight">
              Sentry<span className="text-signal">Scan</span>
            </span>
          </Link>
          <Link href="/" className="text-sm text-ink-muted hover:text-ink">
            ← back home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <p className="mono-tag">run a scan</p>
        <h1 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Enter a domain to scan
        </h1>
        <p className="mt-3 max-w-xl text-ink-muted">
          Runs live HTTP header, TLS certificate, exposed-path, and DNS checks against the target.
        </p>

        <div className="mt-8">
          <ScanForm onResult={setReport} />
        </div>

        {report && (
          <div className="mt-10">
            <ScanResults report={report} />
          </div>
        )}
      </main>
    </div>
  );
}
