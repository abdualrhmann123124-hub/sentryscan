"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScanTerminal } from "./scan-terminal";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid-fade bg-grid pb-24 pt-20 sm:pt-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mono-tag"
          >
            website security, actually checked
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-4 text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Point it at a domain.
            <br />
            Get a real answer.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-lg text-balance text-lg text-ink-muted"
          >
            SentryScan inspects a live site's HTTP headers, TLS certificate, and common exposed
            paths — the same checks a security engineer would run by hand — and hands you a
            plain-English report in under a minute.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Button asChild size="lg">
              <Link href="/scan">
                Run a free scan <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <a href="#how-it-works" className="text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline">
              See what it checks
            </a>
          </motion.div>
          <p className="mt-6 font-mono text-xs text-ink-faint">
            no signup required for a single scan · results in ~15–30s
          </p>
        </div>
        <ScanTerminal />
      </div>
    </section>
  );
}
