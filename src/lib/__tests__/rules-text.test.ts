import { describe, expect, it } from "vitest";
import {
  extractBracketTags,
  formatUnknownColonToken,
  parseRulesText,
} from "@/lib/rules-text";

const sample =
  "[Action][>] :rb_energy_1::rb_rune_rainbow:, :rb_exhaust:: [Stun] an enemy unit attacking here. (It doesn't deal combat damage this turn.)";

describe("parseRulesText", () => {
  it("parses Riftbound rules text tokens", () => {
    expect(parseRulesText(sample)).toEqual([
      { type: "keyword", value: "Action" },
      { type: "hidden" },
      { type: "text", value: " " },
      { type: "colonIcon", value: "rb_energy_1" },
      { type: "colonIcon", value: "rb_rune_rainbow" },
      { type: "text", value: ", " },
      { type: "colonIcon", value: "rb_exhaust" },
      { type: "text", value: ": " },
      { type: "keyword", value: "Stun" },
      {
        type: "text",
        value: " an enemy unit attacking here. (It doesn't deal combat damage this turn.)",
      },
    ]);
  });

  it("extracts bracket tags and excludes hidden provider markers", () => {
    expect(extractBracketTags(sample)).toEqual(["Action", "Stun"]);
  });

  it("hides html-escaped arrow control markers", () => {
    expect(parseRulesText("[Action][&gt;]")).toEqual([
      { type: "keyword", value: "Action" },
      { type: "hidden" },
    ]);
  });

  it("formats unknown colon tokens into readable fallback labels", () => {
    expect(formatUnknownColonToken("rb_some_new_icon")).toBe("Some New Icon");
  });
});
