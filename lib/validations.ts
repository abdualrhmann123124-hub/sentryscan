import { z } from "zod";

/**
 * Accepts a bare domain or a full URL and normalizes it to an https:// URL.
 * Rejects anything that isn't a plausible public hostname.
 */
export const scanTargetSchema = z.object({
  target: z
    .string()
    .trim()
    .min(3, "Enter a domain or URL")
    .max(253, "That URL is too long")
    .transform((val) => (val.startsWith("http://") || val.startsWith("https://") ? val : `https://${val}`))
    .refine((val) => {
      try {
        const url = new URL(val);
        return /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(
          url.hostname
        );
      } catch {
        return false;
      }
    }, "Enter a valid domain, e.g. example.com"),
});

export type ScanTargetInput = z.infer<typeof scanTargetSchema>;
