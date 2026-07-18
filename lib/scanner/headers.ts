import { withRetry } from "./retry";
import { logger } from "@/lib/logger";
import type { Finding } from "./types";

export interface HeaderScanResult {
  findings: Finding[];
  finalUrl: string | null;
  statusCode: number | null;
  server: string | null;
  rawHeaders: Record<string, string>;
}

const SECURITY_HEADERS: {
  key: string;
  title: string;
  onMissing: string;
  check?: (value: string) => { severity: Finding["severity"]; detail: string } | null;
}[] = [
  {
    key: "strict-transport-security",
    title: "HTTP Strict Transport Security (HSTS)",
    onMissing:
      "No Strict-Transport-Security header. Browsers can be tricked into downgrading this site to plain HTTP.",
  },
  {
    key: "content-security-policy",
    title: "Content Security Policy (CSP)",
    onMissing:
      "No Content-Security-Policy header. The site has no browser-level defense against injected scripts (XSS).",
  },
  {
    key: "x-frame-options",
    title: "X-Frame-Options",
    onMissing: "No X-Frame-Options header. The site can be embedded in an iframe, enabling clickjacking.",
  },
  {
    key: "x-content-type-options",
    title: "X-Content-Type-Options",
    onMissing:
      "No X-Content-Type-Options header. Browsers may MIME-sniff responses, which can enable content-type attacks.",
  },
  {
    key: "referrer-policy",
    title: "Referrer-Policy",
    onMissing: "No Referrer-Policy header. Full URLs (possibly with sensitive query params) may leak to third parties on outbound links.",
  },
  {
    key: "permissions-policy",
    title: "Permissions-Policy",
    onMissing: "No Permissions-Policy header. Browser features (camera, mic, geolocation) aren't explicitly restricted.",
  },
];

/**
 * Fetches the target and evaluates its response headers for common
 * security misconfigurations. This performs a real network request —
 * there is no mocked or canned response.
 */
export async function scanHeaders(url: string): Promise<HeaderScanResult> {
  const findings: Finding[] = [];

  const response = await withRetry(
    (signal) =>
      fetch(url, {
        redirect: "follow",
        signal,
        headers: { "User-Agent": "SentryScan/1.0 (+security-headers-check)" },
      }),
    { attempts: 3, timeoutMs: 8000 }
  );

  const rawHeaders: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    rawHeaders[key] = value;
  });

  for (const rule of SECURITY_HEADERS) {
    const value = rawHeaders[rule.key];
    if (!value) {
      findings.push({
        id: `header-${rule.key}`,
        category: "headers",
        title: rule.title,
        severity: "warn",
        detail: rule.onMissing,
      });
    } else {
      const custom = rule.check?.(value);
      findings.push({
        id: `header-${rule.key}`,
        category: "headers",
        title: rule.title,
        severity: custom?.severity ?? "pass",
        detail: custom?.detail ?? `Present: ${value}`,
      });
    }
  }

  // Information disclosure via Server / X-Powered-By
  const serverHeader = rawHeaders["server"] ?? null;
  if (serverHeader && /\d/.test(serverHeader)) {
    findings.push({
      id: "header-server-version",
      category: "headers",
      title: "Server version disclosure",
      severity: "info",
      detail: `Server header reveals version info: "${serverHeader}". This can help attackers target known vulnerabilities.`,
    });
  }
  if (rawHeaders["x-powered-by"]) {
    findings.push({
      id: "header-powered-by",
      category: "headers",
      title: "X-Powered-By disclosure",
      severity: "info",
      detail: `X-Powered-By header reveals the underlying framework: "${rawHeaders["x-powered-by"]}".`,
    });
  }

  if (!serverHeader) {
    findings.push({
      id: "header-server-hidden",
      category: "headers",
      title: "Server identity",
      severity: "pass",
      detail: "No Server header disclosed.",
    });
  }

  logger.info("headers scan complete", { url, status: response.status });

  return {
    findings,
    finalUrl: response.url || null,
    statusCode: response.status,
    server: serverHeader,
    rawHeaders,
  };
}
