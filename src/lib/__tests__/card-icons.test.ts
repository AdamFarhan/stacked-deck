import { describe, expect, it } from "vitest";
import { getTagIcon, normalizeTagValue } from "@/lib/card-icons";

describe("card icon registry", () => {
  it("normalizes tag values for lookup", () => {
    expect(normalizeTagValue("  Rare Gear  ")).toBe("rare gear");
  });

  it("resolves known card type, domain, and rarity icons", () => {
    expect(getTagIcon("Gear")).toMatchObject({
      path: "/riftbound-icons/card-types/gear.webp",
      mode: "mask",
    });
    expect(getTagIcon("Fury")).toMatchObject({
      path: "/riftbound-icons/domains/fury.webp",
      mode: "image",
    });
    expect(getTagIcon("Rare")).toMatchObject({
      path: "/riftbound-icons/rarities/rare.webp",
      mode: "image",
    });
    expect(getTagIcon("Showcase")).toMatchObject({
      path: "/riftbound-icons/rarities/showcase.webp",
      mode: "image",
    });
  });

  it("returns null when no matching icon exists", () => {
    expect(getTagIcon("Assault")).toBeNull();
  });
});
