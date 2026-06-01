import type { Card, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeText } from "@/lib/text";

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

export function getSingleCardRedirect(cards: Pick<Card, "slug" | "normalizedName">[], rawQuery: string) {
  const normalized = normalizeText(rawQuery);
  const exact = cards.filter((card) => card.normalizedName === normalized);
  return exact.length === 1 ? exact[0].slug : null;
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
    orderBy: { code: "asc" },
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
