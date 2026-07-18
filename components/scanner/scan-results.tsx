"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ScanApiResponse } from "@/lib/scanner/client";
import type { Finding, Severity } from "@/lib/scanner/types";

const severityIcon: Record<Severity, typeof CheckCircle2> = {
  pass: CheckCircle2,
  info: Info,
  warn: AlertTriangle,
  fail: XCircle,
};

const categories: { key: Finding["category"]; label: string }[] = [
  { key: "headers", label: "Headers" },
  { key: "tls", label: "TLS" },
  { key: "exposure", label: "Exposure" },
  { key: "dns", label: "DNS" },
];

function scoreColor(score: number) {
  if (score >= 80) return "text-signal";
  if (score >= 50) return "text-warn";
  return "text-alert";
}

function FindingRow({ finding }: { finding: Finding }) {
  const Icon = severityIcon[finding.severity];
  return (
    <div className="flex items-start gap-3 border-b border-base-border py-4 last:border-0">
      <Icon
        className={`mt-0.5 h-4 w-4 shrink-0 ${
          finding.severity === "pass"
            ? "text-signal"
            : finding.severity === "info"
              ? "text-probe"
              : finding.severity === "warn"
                ? "text-warn"
                : "text-alert"
        }`}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-ink">{finding.title}</p>
          <Badge variant={finding.severity}>{finding.severity}</Badge>
        </div>
        <p className="mt-1 text-sm text-ink-muted">{finding.detail}</p>
      </div>
    </div>
  );
}

export function ScanResults({ report }: { report: ScanApiResponse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
        <Card className="flex items-center justify-center p-8 sm:w-48">
          <div className="text-center">
            <div className={`font-display text-5xl font-bold ${scoreColor(report.score)}`}>
              {report.score}
            </div>
            <div className="mt-1 font-mono text-xs uppercase tracking-wide text-ink-muted">/ 100</div>
          </div>
        </Card>
        <Card>
          <CardContent className="grid grid-cols-2 gap-4 p-6 text-sm sm:grid-cols-4">
            <div>
              <div className="text-ink-faint">Host</div>
              <div className="mt-1 truncate font-mono text-ink">{report.hostname}</div>
            </div>
            <div>
              <div className="text-ink-faint">Status</div>
              <div className="mt-1 font-mono text-ink">{report.meta.statusCode ?? "—"}</div>
            </div>
            <div>
              <div className="text-ink-faint">TLS issuer</div>
              <div className="mt-1 truncate font-mono text-ink">{report.meta.tlsIssuer ?? "—"}</div>
            </div>
            <div>
              <div className="text-ink-faint">Scan time</div>
              <div className="mt-1 font-mono text-ink">{(report.durationMs / 1000).toFixed(1)}s</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {report.errors.length > 0 && (
        <div className="mt-4 rounded-lg border border-warn/30 bg-warn/10 p-4 font-mono text-xs text-warn">
          {report.errors.map((e) => (
            <div key={e}>{e}</div>
          ))}
        </div>
      )}

      <Card className="mt-6">
        <CardContent className="p-6">
          <Tabs defaultValue="headers">
            <TabsList>
              {categories.map((c) => {
                const count = report.findings.filter((f) => f.category === c.key).length;
                return (
                  <TabsTrigger key={c.key} value={c.key}>
                    {c.label} ({count})
                  </TabsTrigger>
                );
              })}
            </TabsList>
            {categories.map((c) => (
              <TabsContent key={c.key} value={c.key}>
                {report.findings.filter((f) => f.category === c.key).length === 0 ? (
                  <p className="py-6 text-sm text-ink-muted">No findings in this category.</p>
                ) : (
                  report.findings
                    .filter((f) => f.category === c.key)
                    .map((f) => <FindingRow key={f.id} finding={f} />)
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
