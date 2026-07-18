import tls from "node:tls";
import { logger } from "@/lib/logger";
import type { Finding } from "./types";

export interface TlsScanResult {
  findings: Finding[];
  issuer: string | null;
  validTo: string | null;
  daysRemaining: number | null;
  protocol: string | null;
}

/**
 * Opens a real TLS connection to the host on port 443 and inspects the
 * negotiated certificate and protocol version. No canned certificate data.
 */
export function scanTls(hostname: string, timeoutMs = 8000): Promise<TlsScanResult> {
  return new Promise((resolve) => {
    const findings: Finding[] = [];
    let settled = false;

    const socket = tls.connect(
      {
        host: hostname,
        port: 443,
        servername: hostname,
        timeout: timeoutMs,
        rejectUnauthorized: false, // we want to inspect+report invalid certs, not throw on them
      },
      () => {
        if (settled) return;
        settled = true;

        const cert = socket.getPeerCertificate();
        const protocol = socket.getProtocol();
        const authorized = socket.authorized;

        let daysRemaining: number | null = null;
        if (cert?.valid_to) {
          const validTo = new Date(cert.valid_to);
          daysRemaining = Math.round((validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        }

        if (!authorized) {
          findings.push({
            id: "tls-trust",
            category: "tls",
            title: "Certificate trust",
            severity: "fail",
            detail: `Certificate is not trusted: ${socket.authorizationError ?? "unknown reason"}.`,
          });
        } else {
          findings.push({
            id: "tls-trust",
            category: "tls",
            title: "Certificate trust",
            severity: "pass",
            detail: "Certificate chains to a trusted root.",
          });
        }

        if (daysRemaining !== null) {
          if (daysRemaining < 0) {
            findings.push({
              id: "tls-expiry",
              category: "tls",
              title: "Certificate expiry",
              severity: "fail",
              detail: `Certificate expired ${Math.abs(daysRemaining)} day(s) ago.`,
            });
          } else if (daysRemaining < 14) {
            findings.push({
              id: "tls-expiry",
              category: "tls",
              title: "Certificate expiry",
              severity: "warn",
              detail: `Certificate expires in ${daysRemaining} day(s).`,
            });
          } else {
            findings.push({
              id: "tls-expiry",
              category: "tls",
              title: "Certificate expiry",
              severity: "pass",
              detail: `Certificate valid for ${daysRemaining} more day(s).`,
            });
          }
        }

        if (protocol && ["TLSv1", "TLSv1.1"].includes(protocol)) {
          findings.push({
            id: "tls-protocol",
            category: "tls",
            title: "TLS protocol version",
            severity: "warn",
            detail: `Negotiated ${protocol}, which is deprecated. TLS 1.2 or higher is recommended.`,
          });
        } else if (protocol) {
          findings.push({
            id: "tls-protocol",
            category: "tls",
            title: "TLS protocol version",
            severity: "pass",
            detail: `Negotiated ${protocol}.`,
          });
        }

        logger.info("tls scan complete", { hostname, protocol, daysRemaining });

        resolve({
          findings,
          issuer: cert?.issuer?.O ?? cert?.issuer?.CN ?? null,
          validTo: cert?.valid_to ?? null,
          daysRemaining,
          protocol: protocol ?? null,
        });
        socket.end();
      }
    );

    socket.on("error", (err) => {
      if (settled) return;
      settled = true;
      logger.warn("tls scan failed", { hostname, error: (err as Error).message });
      resolve({
        findings: [
          {
            id: "tls-connect",
            category: "tls",
            title: "TLS connection",
            severity: "fail",
            detail: `Could not establish a TLS connection on port 443: ${(err as Error).message}.`,
          },
        ],
        issuer: null,
        validTo: null,
        daysRemaining: null,
        protocol: null,
      });
    });

    socket.on("timeout", () => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve({
        findings: [
          {
            id: "tls-timeout",
            category: "tls",
            title: "TLS connection",
            severity: "fail",
            detail: "TLS connection timed out.",
          },
        ],
        issuer: null,
        validTo: null,
        daysRemaining: null,
        protocol: null,
      });
    });
  });
}
