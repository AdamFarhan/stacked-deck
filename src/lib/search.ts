import type { Card, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeText } from "@/lib/text";

export const setListOrderBy = [
  { releaseDate: { sort: "desc", nulls: "last" } },
  { code: "asc" },
] satisfies Prisma.SetOrderByWithRelationInput[];

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

export async function searchCards(rawQuery: string, limit = 60): Promise<CardWithPrintings[]> {
  const query = rawQuery.trim();
  const normalized = normalizeText(query);

  if (!normalized) {
    return [];
  }

  const cards = await prisma.card.findMany({
    where: buildCardSearchWhere(normalized),
    include: {
      printings: {
        include: {
          set: true,
        },
        orderBy: [{ set: { code: "asc" } }, { collectorNumber: "asc" }],
      },
    },
    take: limit,
  });

  return rankCards(cards, normalized);
}

export function buildCardSearchWhere(normalizedQuery: string): Prisma.CardWhereInput {
  return {
    OR: [
      { normalizedName: { contains: normalizedQuery, mode: "insensitive" } },
      { searchText: { contains: normalizedQuery, mode: "insensitive" } },
    ],
  };
}

export function rankCards<T extends Pick<Card, "normalizedName" | "searchText" | "name">>(
  cards: T[],
  normalizedQuery: string,
) {
  return [...cards].sort((a, b) => {
    const scoreA = cardScore(a, normalizedQuery);
    const scoreB = cardScore(b, normalizedQuery);
    if (scoreA !== scoreB) return scoreB - scoreA;
    return a.name.localeCompare(b.name);
  });
}

export function cardScore(card: Pick<Card, "normalizedName" | "searchText">, normalizedQuery: string) {
  if (card.normalizedName === normalizedQuery) return 100;
  if (card.normalizedName.startsWith(normalizedQuery)) return 75;
  if (card.normalizedName.includes(normalizedQuery)) return 60;
  if (normalizeText(card.searchText).includes(normalizedQuery)) return 35;
  return 10;
}

export function getSingleCardRedirect(cards: Pick<Card, "slug">[]) {
  return cards.length === 1 ? cards[0].slug : null;
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

export function selectRandomCard<T extends RandomCard>(cards: T[], random = Math.random) {
  if (cards.length === 0) {
    return null;
  }

  return cards[Math.floor(random() * cards.length)] ?? null;
}

export function selectSeededRandomFlavorCard<T extends FlavorCard>(cards: T[], seed: string) {
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
