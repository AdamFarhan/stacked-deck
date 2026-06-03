import { describe, expect, it } from "vitest";
import { isExcludedSet } from "@/lib/excluded-sets";

describe("excluded set helpers", () => {
  it("excludes known promo and judge set codes", () => {
    expect(isExcludedSet({ code: "PR", name: "Promos" })).toBe(true);
    expect(isExcludedSet({ code: "opp", name: "Organized Play" })).toBe(true);
    expect(isExcludedSet({ code: "JDG", name: "Special Releases" })).toBe(true);
    expect(isExcludedSet({ code: "judge", name: "Special Releases" })).toBe(true);
  });

  it("excludes promo and judge set names", () => {
    expect(isExcludedSet({ code: "XYZ", name: "Riftbound Organized Play Promotional Cards" })).toBe(true);
    expect(isExcludedSet({ code: "XYZ", name: "Judge Gift Cards" })).toBe(true);
    expect(isExcludedSet({ code: "XYZ", name: "Worlds Promo Cards" })).toBe(true);
    expect(isExcludedSet({ code: "XYZ", name: "League Promos" })).toBe(true);
  });

  it("does not exclude normal sets", () => {
    expect(isExcludedSet({ code: "OGN", name: "Proving Grounds" })).toBe(false);
    expect(isExcludedSet({ code: "OGS", name: "Origins" })).toBe(false);
    expect(isExcludedSet(null)).toBe(false);
  });
});
