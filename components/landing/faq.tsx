"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Does SentryScan attack or exploit the target site?",
    a: "No. Every check is passive and read-only: standard HTTP requests, a standard TLS handshake, and lookups of well-known public paths. Nothing attempts to bypass authentication or exploit a vulnerability.",
  },
  {
    q: "Can I scan any domain, or only ones I own?",
    a: "Technically the scanner works on any public domain, since every check it runs is the same read-only request a browser makes. That said, only scan domains you own or have permission to test — it's the responsible (and in many jurisdictions, legally required) way to use a tool like this.",
  },
  {
    q: "Where are scan results stored?",
    a: "Reports are saved to the local database this app is running against, keyed by an ID returned in the response. Nothing is sent to a third party.",
  },
  {
    q: "Why did a scan fail or time out?",
    a: "Usually the target blocked automated requests, is behind a firewall, or was briefly unreachable. The report will show exactly which module failed and why.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <p className="mono-tag text-center">faq</p>
      <h2 className="mt-3 text-balance text-center font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Common questions
      </h2>
      <Accordion.Root type="single" collapsible className="mt-10 divide-y divide-base-border border-y border-base-border">
        {faqs.map((f) => (
          <Accordion.Item key={f.q} value={f.q} className="py-1">
            <Accordion.Trigger className="group flex w-full items-center justify-between py-4 text-left font-medium text-ink">
              {f.q}
              <ChevronDown className="h-4 w-4 shrink-0 text-ink-muted transition-transform group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden pb-4 text-sm text-ink-muted data-[state=open]:animate-fade-up">
              {f.a}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
