import { describe, expect, it } from "vitest";
import { buildCardSearchWhere, cardScore, getSingleCardRedirect, rankCards, setListOrderBy } from "@/lib/search";

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
  it("redirects when a search returns exactly one card", () => {
    expect(getSingleCardRedirect([cards[0]])).toBe("master-yi-honed");
  });

  it("does not redirect when a search returns zero or multiple cards", () => {
    expect(getSingleCardRedirect([])).toBeNull();
    expect(getSingleCardRedirect(cards)).toBeNull();
  });

  it("ranks exact names before partial matches", () => {
    expect(rankCards(cards, "master yi honed")[0].slug).toBe("master-yi-honed");
  });

  it("searches by the full normalized phrase instead of individual terms", () => {
    expect(buildCardSearchWhere("master yi")).toEqual({
      OR: [
        { normalizedName: { contains: "master yi", mode: "insensitive" } },
        { searchText: { contains: "master yi", mode: "insensitive" } },
      ],
    });
  });

  it("scores multi-word text matches only when the full phrase is present", () => {
    expect(cardScore({ normalizedName: "student", searchText: "Master Yi Ionia" }, "master yi")).toBe(35);
    expect(cardScore({ normalizedName: "student", searchText: "Master of forms Yi follows" }, "master yi")).toBe(10);
  });

  it("sorts sets by newest release date first with undated sets last", () => {
    expect(setListOrderBy).toEqual([
      { releaseDate: { sort: "desc", nulls: "last" } },
      { code: "asc" },
    ]);
  });
});
