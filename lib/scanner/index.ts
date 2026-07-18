import { scanHeaders } from "./headers";
import { scanTls } from "./tls";
import { scanExposure } from "./exposure";
import { scanDns } from "./dns";
import { logger } from "@/lib/logger";
import type { Finding, ScanReport } from "./types";

const SEVERITY_WEIGHT: Record<Finding["severity"], number> = {
  pass: 0,
  info: 2,
  warn: 8,
  fail: 20,
};

function computeScore(findings: Finding[]): number {
  const penalty = findings.reduce((sum, f) => sum + SEVERITY_WEIGHT[f.severity], 0);
  return Math.max(0, Math.min(100, 100 - penalty));
}

export async function runScan(rawUrl: string): Promise<ScanReport> {
  const start = Date.now();
  const url = new URL(rawUrl);
  const hostname = url.hostname;
  const errors: string[] = [];

  logger.info("scan started", { hostname });

  const [headerResult, tlsResult, exposureResult, dnsResult] = await Promise.all([
    scanHeaders(url.toString()).catch((err) => {
      errors.push(`Header scan failed: ${(err as Error).message}`);
      return null;
    }),
    scanTls(hostname).catch((err) => {
      errors.push(`TLS scan failed: ${(err as Error).message}`);
      return null;
    }),
    scanExposure(url.toString()).catch((err) => {
      errors.push(`Exposure scan failed: ${(err as Error).message}`);
      return null;
    }),
    scanDns(hostname).catch((err) => {
      errors.push(`DNS scan failed: ${(err as Error).message}`);
      return null;
    }),
  ]);

  const findings: Finding[] = [
    ...(headerResult?.findings ?? []),
    ...(tlsResult?.findings ?? []),
    ...(exposureResult?.findings ?? []),
    ...(dnsResult?.findings ?? []),
  ];

  const report: ScanReport = {
    target: rawUrl,
    hostname,
    scannedAt: new Date().toISOString(),
    durationMs: Date.now() - start,
    score: computeScore(findings),
    findings,
    meta: {
      finalUrl: headerResult?.finalUrl ?? null,
      statusCode: headerResult?.statusCode ?? null,
      server: headerResult?.server ?? null,
      tlsIssuer: tlsResult?.issuer ?? null,
      tlsValidTo: tlsResult?.validTo ?? null,
      tlsDaysRemaining: tlsResult?.daysRemaining ?? null,
      ipAddresses: dnsResult?.addresses ?? [],
    },
    errors,
  };

  logger.info("scan finished", { hostname, score: report.score, durationMs: report.durationMs });

  return report;
}
