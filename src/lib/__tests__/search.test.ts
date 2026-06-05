import { describe, expect, it } from "vitest";
import {
  buildAdvancedCardSearchWhere,
  buildCardSearchWhere,
  cardScore,
  getDefaultAdvancedSearchFilters,
  hashSeed,
  hasAdvancedSearchCriteria,
  getSingleCardRedirect,
  parseAdvancedSearchParams,
  rankCards,
  selectRandomCard,
  selectSeededRandomFlavorCard,
  setListOrderBy,
} from "@/lib/search";

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

  it("parses advanced search params from repeated URL values", () => {
    const params = new URLSearchParams();
    params.set("q", "Master Yi");
    params.append("domain", "Body");
    params.append("domain", "Calm");
    params.append("set", "unl");
    params.append("type", "Unit");
    params.append("rarity", "Rare");
    params.set("energyMin", "2");
    params.set("energyMax", "6");
    params.set("powerMin", "1");
    params.set("powerMax", "3");
    params.set("mightMin", "4");
    params.set("mightMax", "8");

    expect(parseAdvancedSearchParams(params)).toEqual({
      query: "Master Yi",
      domains: ["Body", "Calm"],
      sets: ["UNL"],
      types: ["Unit"],
      rarities: ["Rare"],
      energy: [2, 6],
      power: [1, 3],
      might: [4, 8],
    });
  });

  it("clamps and swaps advanced numeric ranges", () => {
    expect(
      parseAdvancedSearchParams({
        energyMin: "12",
        energyMax: "-4",
        powerMin: "50",
        powerMax: "2",
      }),
    ).toMatchObject({
      energy: [0, 12],
      power: [2, 4],
      might: [0, 12],
    });
  });

  it("detects active advanced search criteria", () => {
    expect(hasAdvancedSearchCriteria(getDefaultAdvancedSearchFilters())).toBe(false);
    expect(
      hasAdvancedSearchCriteria({
        ...getDefaultAdvancedSearchFilters(),
        domains: ["Body"],
      }),
    ).toBe(true);
    expect(
      hasAdvancedSearchCriteria({
        ...getDefaultAdvancedSearchFilters(),
        energy: [1, 12],
      }),
    ).toBe(true);
  });

  it("builds advanced text-only search filters", () => {
    expect(
      buildAdvancedCardSearchWhere({
        ...getDefaultAdvancedSearchFilters(),
        query: "master yi",
      }),
    ).toEqual({
      AND: [
        {
          OR: [
            { normalizedName: { contains: "master yi", mode: "insensitive" } },
            { searchText: { contains: "master yi", mode: "insensitive" } },
          ],
        },
      ],
    });
  });

  it("combines advanced category filters with AND semantics", () => {
    expect(
      buildAdvancedCardSearchWhere({
        ...getDefaultAdvancedSearchFilters(),
        domains: ["Body", "Calm"],
        sets: ["UNL", "SFD"],
        types: ["Unit", "Spell"],
        rarities: ["Rare", "Epic"],
      }),
    ).toEqual({
      AND: [
        { domains: { hasSome: ["Body", "Calm"] } },
        { type: { in: ["Unit", "Spell"], mode: "insensitive" } },
        {
          printings: {
            some: {
              set: {
                code: { in: ["UNL", "SFD"] },
              },
            },
          },
        },
        {
          printings: {
            some: {
              rarity: { in: ["Rare", "Epic"], mode: "insensitive" },
            },
          },
        },
      ],
    });
  });

  it("adds inclusive numeric range filters only when constrained", () => {
    expect(
      buildAdvancedCardSearchWhere({
        ...getDefaultAdvancedSearchFilters(),
        energy: [2, 7],
        power: [1, 4],
        might: [0, 6],
      }),
    ).toEqual({
      AND: [
        { energy: { gte: 2, lte: 7 } },
        { power: { gte: 1, lte: 4 } },
        { might: { gte: 0, lte: 6 } },
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

  it("returns no random card when the card pool is empty", () => {
    expect(selectRandomCard([])).toBeNull();
  });

  it("selects a runtime-random card from the card pool", () => {
    expect(selectRandomCard(cards, () => 0.75)?.slug).toBe("master-yi-disciple");
  });

  it("selects seeded flavor cards deterministically", () => {
    const flavorCards = [
      { slug: "aatrox", flavorText: "I am not defeated." },
      { slug: "ahri", flavorText: "The forest remembers." },
      { slug: "annie", flavorText: "Have you seen Tibbers?" },
    ];
    const seed = "2026-06-03";
    const expectedCard = flavorCards[hashSeed(seed) % flavorCards.length];

    expect(selectSeededRandomFlavorCard(flavorCards, seed)).toBe(expectedCard);
    expect(selectSeededRandomFlavorCard(flavorCards, seed)).toBe(expectedCard);
  });

  it("filters out cards without flavor text for seeded flavor selection", () => {
    const flavorCards = [
      { slug: "blank", flavorText: "" },
      { slug: "missing", flavorText: null },
      { slug: "spaces", flavorText: "   " },
      { slug: "flavorful", flavorText: "A proper bit of story." },
    ];

    expect(selectSeededRandomFlavorCard(flavorCards, "any-seed")?.slug).toBe("flavorful");
  });

  it("returns no seeded flavor card when no card has flavor text", () => {
    expect(
      selectSeededRandomFlavorCard(
        [
          { slug: "blank", flavorText: "" },
          { slug: "missing", flavorText: null },
          { slug: "spaces", flavorText: "   " },
        ],
        "2026-06-03",
      ),
    ).toBeNull();
  });
});
