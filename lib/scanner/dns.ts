import dns from "node:dns/promises";
import { logger } from "@/lib/logger";
import type { Finding } from "./types";

export interface DnsScanResult {
  findings: Finding[];
  addresses: string[];
}

export async function scanDns(hostname: string): Promise<DnsScanResult> {
  const findings: Finding[] = [];
  let addresses: string[] = [];

  try {
    addresses = await dns.resolve4(hostname);
    findings.push({
      id: "dns-resolve",
      category: "dns",
      title: "DNS resolution",
      severity: "pass",
      detail: `Resolved to ${addresses.length} IPv4 address(es).`,
    });
  } catch (err) {
    findings.push({
      id: "dns-resolve",
      category: "dns",
      title: "DNS resolution",
      severity: "fail",
      detail: `Could not resolve hostname: ${(err as Error).message}.`,
    });
  }

  try {
    const caa = await dns.resolveCaa(hostname);
    if (caa.length === 0) {
      findings.push({
        id: "dns-caa",
        category: "dns",
        title: "CAA record",
        severity: "info",
        detail: "No CAA record found. Any certificate authority can issue certs for this domain.",
      });
    } else {
      findings.push({
        id: "dns-caa",
        category: "dns",
        title: "CAA record",
        severity: "pass",
        detail: `CAA record restricts issuance to: ${caa.map((r) => r.issue ?? r.issuewild).filter(Boolean).join(", ")}.`,
      });
    }
  } catch {
    findings.push({
      id: "dns-caa",
      category: "dns",
      title: "CAA record",
      severity: "info",
      detail: "No CAA record found. Any certificate authority can issue certs for this domain.",
    });
  }

  logger.info("dns scan complete", { hostname, addresses });
  return { findings, addresses };
}
