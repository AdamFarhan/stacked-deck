import { describe, expect, it } from "vitest";
import {
  extractBracketTags,
  formatUnknownColonToken,
  getDisplayRulesText,
  parseRulesText,
  richRulesTextToPlainText,
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

  it("converts rich provider rules text to plain text with line breaks", () => {
    const text = richRulesTextToPlainText(
      "<p>When you play this, gain 1 XP.<br />[Equip] &mdash; Spend 1 XP (Pay the cost: Attach this to a unit you control.)</p>",
    );

    expect(parseRulesText(text)).toEqual([
      { type: "text", value: "When you play this, gain 1 XP." },
      { type: "lineBreak" },
      { type: "keyword", value: "Equip" },
      {
        type: "text",
        value: " — Spend 1 XP (Pay the cost: Attach this to a unit you control.)",
      },
    ]);
  });

  it("prefers rich text over plain text for display rules text", () => {
    expect(
      getDisplayRulesText({
        plain: "When you play this, gain 1 XP.[Equip] — Spend 1 XP",
        rich: "<p>When you play this, gain 1 XP.<br />[Equip] — Spend 1 XP</p>",
      }),
    ).toBe("When you play this, gain 1 XP.\n[Equip] — Spend 1 XP");
  });
});
