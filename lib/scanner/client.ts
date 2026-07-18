import type { ScanReport } from "./types";

export interface ScanApiResponse extends ScanReport {
  id: string;
}

export interface ScanApiError {
  error: string;
}

export async function requestScan(target: string): Promise<ScanApiResponse> {
  const res = await fetch("/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error((data as ScanApiError).error ?? "Scan failed.");
  }

  return data as ScanApiResponse;
}
