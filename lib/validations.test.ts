import { describe, it, expect } from "vitest";
import { scanTargetSchema } from "./validations";

describe("scanTargetSchema", () => {
  it("accepts a bare domain and normalizes it to https", () => {
    const result = scanTargetSchema.parse({ target: "example.com" });
    expect(result.target).toBe("https://example.com");
  });

  it("accepts an already-qualified URL unchanged in scheme", () => {
    const result = scanTargetSchema.parse({ target: "http://example.com/path" });
    expect(result.target).toBe("http://example.com/path");
  });

  it("rejects empty input", () => {
    expect(() => scanTargetSchema.parse({ target: "" })).toThrow();
  });

  it("rejects garbage that isn't a valid hostname", () => {
    expect(() => scanTargetSchema.parse({ target: "not a domain" })).toThrow();
  });

  it("rejects javascript: and other non-http schemes", () => {
    expect(() => scanTargetSchema.parse({ target: "javascript:alert(1)" })).toThrow();
  });
});
