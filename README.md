# SentryScan

A website security scanner: point it at a domain and it runs **real, live** checks —
HTTP security headers, a TLS handshake to inspect the certificate, passive exposed-path
checks (`.env`, `.git`, etc.), and a DNS/CAA lookup — then scores and reports the results.

## Run it locally

```bash
npm install
cp .env.example .env
npx prisma db push   # creates the local SQLite database
npm run dev
```

Open http://localhost:3000. The landing page has a demo terminal animation (clearly
labeled "illustrative"); the real scanner lives at `/scan`.

## What's real vs. what's scaffolded

**Real and working:**
- All four scan modules (`lib/scanner/*`) make genuine network calls — `fetch` for headers,
  Node's `tls` module for the certificate, passive `GET`s for exposed paths, `dns/promises`
  for resolution. Nothing is mocked.
- Retry-with-backoff and per-module timeouts (`lib/scanner/retry.ts`).
- Input validation with Zod, structured logging, and error handling that degrades per-module
  (one failed check doesn't kill the whole scan).
- Scan history is persisted to a local SQLite database via Prisma.

**Scaffolded for growth, not wired up:**
- Pricing page shows Free / Pro / Team tiers — only Free (the scanner itself) is functional.
  No billing/auth is included.
- No automated test suite yet (unit/integration/E2E) — this build prioritized a working MVP
  over full test coverage. `lib/scanner/*` is written as pure, testable functions, so adding
  Vitest/Playwright on top is straightforward when you're ready.
- Postgres: the schema is written for easy migration — change the `datasource` in
  `prisma/schema.prisma` from `sqlite` to `postgresql`, point `DATABASE_URL` at a real
  instance, and re-run `npx prisma db push`.

## Responsible use

Only scan domains you own or are authorized to test. Every check here is passive and
read-only (standard requests a browser already makes) — nothing attempts to bypass auth
or exploit a vulnerability — but running any automated scanner against a site you don't
control can violate its terms of service or, in some jurisdictions, the law.

## Stack

Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS · Radix primitives ·
Framer Motion · React Query · Zod · Prisma + SQLite
