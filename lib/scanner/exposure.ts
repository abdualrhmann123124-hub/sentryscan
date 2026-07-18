import { logger } from "@/lib/logger";
import type { Finding } from "./types";

interface PathCheck {
  path: string;
  label: string;
  severity: Finding["severity"];
  detail: string;
}

// Purely passive checks: a single GET to well-known, publicly-documented
// paths to see whether they're unintentionally publicly reachable.
// No payloads, no auth bypass attempts, no fuzzing.
const CHECKS: PathCheck[] = [
  {
    path: "/.env",
    label: "Environment file exposure",
    severity: "fail",
    detail: "A .env file is publicly reachable. This commonly contains secrets and credentials — take it down immediately.",
  },
  {
    path: "/.git/config",
    label: "Git repository exposure",
    severity: "fail",
    detail: "A .git directory is publicly reachable, which can expose full source history.",
  },
  {
    path: "/.well-known/security.txt",
    label: "security.txt",
    severity: "pass",
    detail: "A security.txt file was found, giving researchers a clear disclosure contact.",
  },
  {
    path: "/robots.txt",
    label: "robots.txt",
    severity: "info",
    detail: "robots.txt is present and may reveal paths not meant for public indexing.",
  },
  {
    path: "/wp-admin/",
    label: "WordPress admin panel",
    severity: "info",
    detail: "A WordPress admin login page is publicly reachable. Ensure it's protected (rate limiting, 2FA, IP allowlist).",
  },
];

export interface ExposureScanResult {
  findings: Finding[];
}

async function checkPath(baseUrl: string, check: PathCheck): Promise<Finding | null> {
  const target = new URL(check.path, baseUrl).toString();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(target, {
      method: "GET",
      redirect: "manual",
      signal: controller.signal,
      headers: { "User-Agent": "SentryScan/1.0 (+exposure-check)" },
    });
    clearTimeout(timer);

    const reachable = res.status >= 200 && res.status < 400;

    if (check.path === "/.well-known/security.txt" || check.path === "/robots.txt") {
      if (!reachable) return null; // absence of an optional file isn't a finding
      return {
        id: `exposure-${check.path}`,
        category: "exposure",
        title: check.label,
        severity: check.severity,
        detail: check.detail,
      };
    }

    if (!reachable) return null; // path not exposed — nothing to report

    return {
      id: `exposure-${check.path}`,
      category: "exposure",
      title: check.label,
      severity: check.severity,
      detail: check.detail,
    };
  } catch {
    return null; // network error on a single optional check shouldn't fail the whole scan
  }
}

export async function scanExposure(baseUrl: string): Promise<ExposureScanResult> {
  const results = await Promise.all(CHECKS.map((c) => checkPath(baseUrl, c)));
  const findings = results.filter((f): f is Finding => f !== null);
  logger.info("exposure scan complete", { baseUrl, findingCount: findings.length });
  return { findings };
}
