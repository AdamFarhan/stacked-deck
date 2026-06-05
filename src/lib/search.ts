import type { Card, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeText } from "@/lib/text";

export const setListOrderBy = [
  { releaseDate: { sort: "desc", nulls: "last" } },
  { code: "asc" },
] satisfies Prisma.SetOrderByWithRelationInput[];

export const domainFilterOptions = [
  "Fury",
  "Body",
  "Order",
  "Calm",
  "Mind",
  "Chaos",
] as const;
export const typeFilterOptions = [
  "Battlefield",
  "Gear",
  "Legend",
  "Rune",
  "Spell",
  "Unit",
] as const;
export const rarityFilterOptions = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Showcase",
] as const;

export const numericFilterRanges = {
  energy: { min: 0, max: 12 },
  power: { min: 0, max: 4 },
  might: { min: 0, max: 12 },
} as const;

export type NumericFilterKey = keyof typeof numericFilterRanges;

export type AdvancedSearchFilters = {
  query: string;
  domains: string[];
  sets: string[];
  types: string[];
  rarities: string[];
  energy: [number, number];
  power: [number, number];
  might: [number, number];
};

export type CardWithPrintings = Prisma.CardGetPayload<{
  include: {
    printings: {
      include: {
        set: true;
      };
      orderBy: [{ set: { code: "asc" } }, { collectorNumber: "asc" }];
    };
  };
}>;

type RandomCard = Pick<Card, "slug">;
type FlavorCard = Pick<Card, "slug" | "flavorText">;

const cardInclude = {
  printings: {
    include: {
      set: true,
    },
    orderBy: [{ set: { code: "asc" } }, { collectorNumber: "asc" }],
  },
} satisfies Prisma.CardInclude;

export async function searchCards(
  rawQuery: string,
  limit = 60,
): Promise<CardWithPrintings[]> {
  const query = rawQuery.trim();
  const normalized = normalizeText(query);

  if (!normalized) {
    return [];
  }

  const cards = await prisma.card.findMany({
    where: buildCardSearchWhere(normalized),
    include: cardInclude,
    take: limit,
  });

  return rankCards(cards, normalized);
}

export async function advancedSearchCards(
  filters: AdvancedSearchFilters,
  limit = 120,
): Promise<CardWithPrintings[]> {
  if (!hasAdvancedSearchCriteria(filters)) {
    return [];
  }

  const normalized = normalizeText(filters.query);
  const cards = await prisma.card.findMany({
    where: buildAdvancedCardSearchWhere(filters),
    include: cardInclude,
    orderBy: normalized ? undefined : { name: "asc" },
    take: limit,
  });

  return normalized ? rankCards(cards, normalized) : cards;
}

export function buildCardSearchWhere(
  normalizedQuery: string,
): Prisma.CardWhereInput {
  return {
    OR: [
      { normalizedName: { contains: normalizedQuery, mode: "insensitive" } },
      { searchText: { contains: normalizedQuery, mode: "insensitive" } },
    ],
  };
}

export function getDefaultAdvancedSearchFilters(): AdvancedSearchFilters {
  return {
    query: "",
    domains: [],
    sets: [],
    types: [],
    rarities: [],
    energy: [numericFilterRanges.energy.min, numericFilterRanges.energy.max],
    power: [numericFilterRanges.power.min, numericFilterRanges.power.max],
    might: [numericFilterRanges.might.min, numericFilterRanges.might.max],
  };
}

export function parseAdvancedSearchParams(
  params: Record<string, string | string[] | undefined> | URLSearchParams,
): AdvancedSearchFilters {
  const defaults = getDefaultAdvancedSearchFilters();

  return {
    query: firstParam(params, "q")?.trim() ?? "",
    domains: uniqueParams(params, "domain"),
    sets: uniqueParams(params, "set").map((set) => set.toUpperCase()),
    types: uniqueParams(params, "type"),
    rarities: uniqueParams(params, "rarity"),
    energy: parseNumericRange(params, "energy", defaults.energy),
    power: parseNumericRange(params, "power", defaults.power),
    might: parseNumericRange(params, "might", defaults.might),
  };
}

export function hasAdvancedSearchCriteria(filters: AdvancedSearchFilters) {
  return Boolean(
    filters.query.trim() ||
    filters.domains.length ||
    filters.sets.length ||
    filters.types.length ||
    filters.rarities.length ||
    isConstrainedNumericFilter("energy", filters.energy) ||
    isConstrainedNumericFilter("power", filters.power) ||
    isConstrainedNumericFilter("might", filters.might),
  );
}

export function buildAdvancedCardSearchWhere(
  filters: AdvancedSearchFilters,
): Prisma.CardWhereInput {
  const normalizedQuery = normalizeText(filters.query);
  const and: Prisma.CardWhereInput[] = [];

  if (normalizedQuery) {
    and.push(buildCardSearchWhere(normalizedQuery));
  }

  if (filters.domains.length > 0) {
    and.push({ domains: { hasSome: filters.domains } });
  }

  if (filters.types.length > 0) {
    and.push({ type: { in: filters.types, mode: "insensitive" } });
  }

  if (filters.sets.length > 0) {
    and.push({
      printings: {
        some: {
          set: {
            code: { in: filters.sets.map((set) => set.toUpperCase()) },
          },
        },
      },
    });
  }

  if (filters.rarities.length > 0) {
    and.push({
      printings: {
        some: {
          rarity: { in: filters.rarities, mode: "insensitive" },
        },
      },
    });
  }

  for (const key of ["energy", "power", "might"] as const) {
    if (isConstrainedNumericFilter(key, filters[key])) {
      and.push({ [key]: buildNumericWhere(filters[key]) });
    }
  }

  return and.length > 0 ? { AND: and } : {};
}

export function rankCards<
  T extends Pick<Card, "normalizedName" | "searchText" | "name">,
>(cards: T[], normalizedQuery: string) {
  return [...cards].sort((a, b) => {
    const scoreA = cardScore(a, normalizedQuery);
    const scoreB = cardScore(b, normalizedQuery);
    if (scoreA !== scoreB) return scoreB - scoreA;
    return a.name.localeCompare(b.name);
  });
}

export function cardScore(
  card: Pick<Card, "normalizedName" | "searchText">,
  normalizedQuery: string,
) {
  if (card.normalizedName === normalizedQuery) return 100;
  if (card.normalizedName.startsWith(normalizedQuery)) return 75;
  if (card.normalizedName.includes(normalizedQuery)) return 60;
  if (normalizeText(card.searchText).includes(normalizedQuery)) return 35;
  return 10;
}

export function getSingleCardRedirect(cards: Pick<Card, "slug">[]) {
  return cards.length === 1 ? cards[0].slug : null;
}

function isConstrainedNumericFilter(
  key: NumericFilterKey,
  range: [number, number],
) {
  const defaults = numericFilterRanges[key];
  return range[0] > defaults.min || range[1] < defaults.max;
}

function buildNumericWhere(range: [number, number]) {
  return {
    gte: range[0],
    lte: range[1],
  };
}

function parseNumericRange(
  params: Record<string, string | string[] | undefined> | URLSearchParams,
  key: NumericFilterKey,
  defaultRange: [number, number],
): [number, number] {
  const bounds = numericFilterRanges[key];
  const rawMin = Number.parseInt(firstParam(params, `${key}Min`) ?? "", 10);
  const rawMax = Number.parseInt(firstParam(params, `${key}Max`) ?? "", 10);
  const min = clampNumber(
    Number.isFinite(rawMin) ? rawMin : defaultRange[0],
    bounds.min,
    bounds.max,
  );
  const max = clampNumber(
    Number.isFinite(rawMax) ? rawMax : defaultRange[1],
    bounds.min,
    bounds.max,
  );

  return min <= max ? [min, max] : [max, min];
}

function uniqueParams(
  params: Record<string, string | string[] | undefined> | URLSearchParams,
  key: string,
) {
  return [
    ...new Set(
      allParams(params, key)
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ];
}

function firstParam(
  params: Record<string, string | string[] | undefined> | URLSearchParams,
  key: string,
) {
  return allParams(params, key)[0];
}

function allParams(
  params: Record<string, string | string[] | undefined> | URLSearchParams,
  key: string,
) {
  if (params instanceof URLSearchParams) {
    return params.getAll(key);
  }

  const value = params[key];

  if (Array.isArray(value)) {
    return value;
  }

  return typeof value === "string" ? [value] : [];
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export async function getRandomCard() {
  const cardCount = await prisma.card.count();

  if (cardCount === 0) {
    return null;
  }

  const [card] = await prisma.card.findMany({
    orderBy: { slug: "asc" },
    skip: Math.floor(Math.random() * cardCount),
    take: 1,
  });

  return card ?? null;
}

export async function getSeededRandomFlavorCard(seed: string) {
  const cards = await prisma.card.findMany({
    orderBy: { slug: "asc" },
    select: {
      slug: true,
      flavorText: true,
    },
    where: {
      flavorText: {
        not: null,
      },
    },
  });

  return selectSeededRandomFlavorCard(cards, seed);
}

export function selectRandomCard<T extends RandomCard>(
  cards: T[],
  random = Math.random,
) {
  if (cards.length === 0) {
    return null;
  }

  return cards[Math.floor(random() * cards.length)] ?? null;
}

export function selectSeededRandomFlavorCard<T extends FlavorCard>(
  cards: T[],
  seed: string,
) {
  const flavorCards = cards.filter((card) => card.flavorText?.trim());

  if (flavorCards.length === 0) {
    return null;
  }

  return flavorCards[hashSeed(seed) % flavorCards.length] ?? null;
}

export function hashSeed(seed: string) {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export async function getCardBySlug(slug: string) {
  return prisma.card.findUnique({
    where: { slug },
    include: {
      printings: {
        include: {
          set: true,
        },
        orderBy: [{ set: { code: "asc" } }, { collectorNumber: "asc" }],
      },
    },
  });
}

export async function getSets() {
  return prisma.set.findMany({
    include: {
      _count: {
        select: {
          printings: true,
        },
      },
    },
    orderBy: setListOrderBy,
  });
}

export async function getSetByCode(code: string) {
  return prisma.set.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      printings: {
        include: {
          card: true,
        },
        orderBy: { collectorNumber: "asc" },
      },
    },
  });
}
