import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
// @ts-ignore: global CSS import type declarations may be missing in this environment
import "./globals.css";
import { Providers } from "./providers";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "SentryScan — Website Security Scanning",
  description:
    "Run a real security scan on any website: HTTP headers, TLS certificate health, and exposed-path checks in under a minute.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <Providers>
<div className="py-6 my-4 border-y-2 border-dashed border-base-border text-center">
  <p className="text-xl font-display font-bold tracking-widest uppercase text-ink-main">
      — Developed by Abdualrhman Alenezi —
  </p>
</div>
          {children}
        </Providers>
      </body>
    </html>
  );
}