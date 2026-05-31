import { describe, expect, it } from "vitest";
import { normalizeText, slugify } from "@/lib/text";

describe("text helpers", () => {
  it("normalizes punctuation, whitespace, case, and diacritics", () => {
    expect(normalizeText("  Maître Yi - Honed!! ")).toBe("maitre yi honed");
  });

  it("creates stable slugs from normalized card names", () => {
    expect(slugify("Master Yi - Honed")).toBe("master-yi-honed");
  });
});
