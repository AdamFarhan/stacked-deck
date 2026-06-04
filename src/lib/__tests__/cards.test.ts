import { describe, expect, it } from "vitest";
import { getClassificationTag, getVisibleDomains, isBattlefieldCard } from "@/lib/cards";

describe("isBattlefieldCard", () => {
  it("identifies Battlefield cards by type", () => {
    expect(isBattlefieldCard("Battlefield")).toBe(true);
    expect(isBattlefieldCard("battlefield")).toBe(true);
  });

  it("does not identify other or missing card types as Battlefields", () => {
    expect(isBattlefieldCard("Unit")).toBe(false);
    expect(isBattlefieldCard(null)).toBe(false);
    expect(isBattlefieldCard(undefined)).toBe(false);
  });
});

describe("getVisibleDomains", () => {
  it("removes Colorless from display domains", () => {
    expect(getVisibleDomains(["Body", "Colorless", "Mind"])).toEqual(["Body", "Mind"]);
    expect(getVisibleDomains(["colorless"])).toEqual([]);
  });

  it("keeps Riftbound domain names unchanged", () => {
    expect(getVisibleDomains(["Body", "Chaos", "Calm", "Fury", "Mind", "Order"])).toEqual([
      "Body",
      "Chaos",
      "Calm",
      "Fury",
      "Mind",
      "Order",
    ]);
  });
});

describe("getClassificationTag", () => {
  it("keeps Champion in the label while using the concrete type icon lookup", () => {
    expect(getClassificationTag({ supertype: "Champion", type: "Unit" })).toEqual({
      value: "Unit",
      label: "Champion Unit",
    });
  });

  it("keeps Signature in the label while using the concrete type icon lookup", () => {
    expect(getClassificationTag({ supertype: "Signature", type: "Spell" })).toEqual({
      value: "Spell",
      label: "Signature Spell",
    });
  });

  it("falls back to supertype when type is missing", () => {
    expect(getClassificationTag({ supertype: "Legend", type: null })).toEqual({
      value: "Legend",
      label: "Legend",
    });
  });
});
