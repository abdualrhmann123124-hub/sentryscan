"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Line {
  text: string;
  tone?: "signal" | "probe" | "warn" | "alert" | "muted";
}

const SCRIPT: Line[] = [
  { text: "$ sentryscan run example.com", tone: "muted" },
  { text: "→ resolving DNS…", tone: "muted" },
  { text: "✓ resolved to 3 IPv4 addresses", tone: "signal" },
  { text: "→ requesting HTTP headers…", tone: "muted" },
  { text: "✗ missing Content-Security-Policy", tone: "alert" },
  { text: "✗ missing Strict-Transport-Security", tone: "alert" },
  { text: "→ opening TLS session on :443…", tone: "muted" },
  { text: "✓ certificate valid — 74 days remaining", tone: "signal" },
  { text: "⚠ TLS 1.1 still negotiable", tone: "warn" },
  { text: "→ probing known exposed paths…", tone: "muted" },
  { text: "✓ no .env or .git exposure found", tone: "signal" },
  { text: "score: 68 / 100", tone: "probe" },
];

const toneClass: Record<NonNullable<Line["tone"]>, string> = {
  signal: "text-signal",
  probe: "text-probe",
  warn: "text-warn",
  alert: "text-alert",
  muted: "text-ink-faint",
};

export function ScanTerminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [charsOnCurrent, setCharsOnCurrent] = useState<number>(0);

  useEffect(() => {
    if (visibleLines >= SCRIPT.length) {
      const resetTimer = setTimeout(() => {
        setVisibleLines(0);
        setCharsOnCurrent(0);
      }, 2600);
      return () => clearTimeout(resetTimer);
    }

    const currentLine = SCRIPT[visibleLines]!.text;
    if (charsOnCurrent < currentLine.length) {
      const t = setTimeout(() => setCharsOnCurrent((c) => c + 1), 18);
      return () => clearTimeout(t);
    }
    const advance = setTimeout(() => {
      setVisibleLines((v) => v + 1);
      setCharsOnCurrent(0);
    }, 260);
    return () => clearTimeout(advance);
  }, [visibleLines, charsOnCurrent]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative w-full overflow-hidden rounded-xl border border-base-border bg-base-raised shadow-[0_0_60px_-15px_rgba(61,242,165,0.15)]"
    >
      <div className="flex items-center gap-1.5 border-b border-base-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-alert/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warn/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-signal/70" />
        <span className="ml-3 font-mono text-[11px] text-ink-faint">sample scan — illustrative</span>
      </div>
      <div className="h-[280px] overflow-hidden px-5 py-4 font-mono text-[13px] leading-relaxed">
        {SCRIPT.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={toneClass[line.tone ?? "muted"]}>
            {line.text}
          </div>
        ))}
        {visibleLines < SCRIPT.length && (
          <div className={toneClass[SCRIPT[visibleLines]!.tone ?? "muted"]}>
            {SCRIPT[visibleLines]!.text.slice(0, charsOnCurrent)}
            <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-blink bg-signal align-middle" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
