import { describe, expect, it } from "vitest";
import { getSingleCardRedirect, rankCards } from "@/lib/search";

const cards = [
  {
    slug: "master-yi-honed",
    name: "Master Yi - Honed",
    normalizedName: "master yi honed",
    searchText: "Master Yi Honed Unit Champion Body",
  },
  {
    slug: "master-yi-disciple",
    name: "Master Yi - Disciple",
    normalizedName: "master yi disciple",
    searchText: "Master Yi Disciple Unit Body",
  },
];

describe("search helpers", () => {
  it("redirects only when there is exactly one exact canonical match", () => {
    expect(getSingleCardRedirect(cards, "Master Yi - Honed")).toBe("master-yi-honed");
    expect(getSingleCardRedirect(cards, "Master Yi")).toBeNull();
  });

  it("ranks exact names before partial matches", () => {
    expect(rankCards(cards, "master yi honed")[0].slug).toBe("master-yi-honed");
  });
});
