import { describe, expect, it } from "vitest";
import {
  expandNumberedKeyword,
  getRulesColonIcon,
  getRulesKeywordIcon,
  getSeededRulesKeywordIcon,
  getSeededKeywordNames,
  keywordSourceUrl,
} from "@/lib/rules-icons";

describe("rules icon registry", () => {
  it("resolves downloaded keyword icons", () => {
    for (const keyword of [
      "Action",
      "Reaction",
      "Repeat",
      "Vision",
      "Weaponmaster",
      "Equip",
      "Shield 5",
      "Level 16",
    ]) {
      expect(getRulesKeywordIcon(keyword)).toMatchObject({ kind: "keyword" });
    }
  });

  it("keeps seeded keyword candidates even when CDN files are missing", () => {
    for (const keyword of ["Stun", "Unique", "Assault 5", "Deflect 5", "Predict 5", "Hunt 5"]) {
      expect(getSeededRulesKeywordIcon(keyword)).toMatchObject({ kind: "keyword" });
    }
  });

  it("resolves energy and helper colon icons", () => {
    expect(getRulesColonIcon("rb_energy_1")).toMatchObject({
      kind: "number",
      mode: "mask",
      path: "/riftbound-icons/numbers/1.svg",
    });
    expect(getRulesColonIcon("rb_rune_rainbow")).toMatchObject({
      mode: "image",
      path: "/riftbound-icons/helper-icons/power.webp",
    });
    expect(getRulesColonIcon("rb_rune_calm")).toMatchObject({
      mode: "image",
      path: "/riftbound-icons/domains/calm.webp",
    });
    expect(getRulesColonIcon("rb_exhaust")).toMatchObject({
      mode: "mask",
      path: "/riftbound-icons/helper-icons/tap.webp",
    });
    expect(getRulesColonIcon("rb_might")).toMatchObject({
      mode: "mask",
      path: "/riftbound-icons/helper-icons/might.webp",
    });
  });

  it("builds the expected keyword probe names and source URLs", () => {
    expect(expandNumberedKeyword("SHIELD", 5)).toEqual([
      "SHIELD",
      "SHIELD 1",
      "SHIELD 2",
      "SHIELD 3",
      "SHIELD 4",
      "SHIELD 5",
    ]);
    expect(getSeededKeywordNames()).toContain("LEVEL 16");
    expect(keywordSourceUrl("SHIELD 2")).toBe(
      "https://cdn.piltoverarchive.com/description_keywords/SHIELD%202.svg",
    );
    expect(keywordSourceUrl("REACTION")).toBe(
      "https://cdn.piltoverarchive.com/description_keywords/Reaction.svg",
    );
  });
});
