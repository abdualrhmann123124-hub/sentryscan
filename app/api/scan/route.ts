import { NextRequest, NextResponse } from "next/server";
import { scanTargetSchema } from "@/lib/validations";
import { runScan } from "@/lib/scanner";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

// TLS sockets and DNS require the Node.js runtime, not the Edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = scanTargetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid target." },
      { status: 422 }
    );
  }

  try {
    const report = await runScan(parsed.data.target);

    const saved = await prisma.scan.create({
      data: {
        target: report.target,
        hostname: report.hostname,
        score: report.score,
        findings: JSON.stringify(report.findings),
        meta: JSON.stringify(report.meta),
        errors: JSON.stringify(report.errors),
        durationMs: report.durationMs,
      },
    });

    return NextResponse.json({ id: saved.id, ...report });
  } catch (err) {
    logger.error("scan route failed", { error: (err as Error).message });
    return NextResponse.json(
      { error: "The scan could not be completed. The target may be unreachable." },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest) {
  const limitParam = req.nextUrl.searchParams.get("limit");
  const limit = Math.min(Math.max(Number(limitParam) || 10, 1), 50);

  const scans = await prisma.scan.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { id: true, target: true, hostname: true, score: true, createdAt: true },
  });

  return NextResponse.json({ scans });
}
