export type Severity = "pass" | "info" | "warn" | "fail";

export interface Finding {
  id: string;
  category: "headers" | "tls" | "exposure" | "dns";
  title: string;
  severity: Severity;
  detail: string;
}

export interface ScanReport {
  target: string;
  hostname: string;
  scannedAt: string;
  durationMs: number;
  score: number;
  findings: Finding[];
  meta: {
    finalUrl: string | null;
    statusCode: number | null;
    server: string | null;
    tlsIssuer: string | null;
    tlsValidTo: string | null;
    tlsDaysRemaining: number | null;
    ipAddresses: string[];
  };
  errors: string[];
}
