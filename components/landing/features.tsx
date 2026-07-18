"use client";

import { motion } from "framer-motion";
import { FileWarning, Lock, Radar, Network } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: FileWarning,
    title: "HTTP header audit",
    description:
      "Checks for CSP, HSTS, X-Frame-Options, Referrer-Policy, and Permissions-Policy — the headers that stop clickjacking, XSS, and downgrade attacks.",
  },
  {
    icon: Lock,
    title: "TLS certificate health",
    description:
      "Opens a real TLS session on port 443 to verify trust, protocol version, and days until expiry — before your cert lapses on a Friday night.",
  },
  {
    icon: Radar,
    title: "Exposed-path detection",
    description:
      "Passively checks whether .env files, .git directories, and other sensitive paths are unintentionally publicly reachable.",
  },
  {
    icon: Network,
    title: "DNS & CAA review",
    description:
      "Resolves the domain and reviews CAA records so you know exactly which certificate authorities are allowed to issue for it.",
  },
];

export function Features() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-xl">
        <p className="mono-tag">what gets checked</p>
        <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Four passive checks. Zero guesswork.
        </h2>
        <p className="mt-4 text-ink-muted">
          Every scan runs live against the target — no cached data, no canned results.
        </p>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <Card className="h-full transition-colors hover:border-signal/40">
              <CardContent className="p-6">
                <f.icon className="h-5 w-5 text-signal" strokeWidth={2} />
                <CardTitle className="mt-4">{f.title}</CardTitle>
                <CardDescription className="mt-2">{f.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
