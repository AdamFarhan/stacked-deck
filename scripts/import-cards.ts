import { PrismaClient } from "@prisma/client";
import { extractRiftcodexCards, mapRiftcodexCard } from "../src/lib/riftcodex";

const prisma = new PrismaClient();
const BATCH_SIZE = 50;

async function main() {
  const provider = process.env.CARD_DATA_PROVIDER ?? "riftcodex";
  if (provider !== "riftcodex") {
    throw new Error(`Unsupported CARD_DATA_PROVIDER: ${provider}`);
  }

  const run = await prisma.importRun.create({
    data: {
      provider,
      status: "running",
    },
  });

  try {
    const sourceCards = await fetchRiftcodexCards();
    const mappedRecords = sourceCards.map(mapRiftcodexCard);
    const cardsBySlug = uniqueBy(mappedRecords.map((record) => record.card), (card) => card.slug);
    const setsByCode = uniqueBy(
      mappedRecords.flatMap((record) => (record.set ? [record.set] : [])),
      (set) => set.code,
    );

    const existingCards = await prisma.card.findMany({
      where: { slug: { in: [...cardsBySlug.keys()] } },
      select: { id: true, slug: true },
    });
    const existingCardSlugs = new Set(existingCards.map((card) => card.slug));
    const newCards = [...cardsBySlug.values()].filter((card) => !existingCardSlugs.has(card.slug));
    const updateCards = [...cardsBySlug.values()].filter((card) => existingCardSlugs.has(card.slug));

    if (newCards.length > 0) {
      await prisma.card.createMany({
        data: newCards,
        skipDuplicates: true,
      });
    }

    await runBatches(updateCards, (card) =>
      prisma.card.update({
        where: { slug: card.slug },
        data: card,
      }),
    );

    const existingSets = await prisma.set.findMany({
      where: { code: { in: [...setsByCode.keys()] } },
      select: { id: true, code: true },
    });
    const existingSetCodes = new Set(existingSets.map((set) => set.code));
    const newSets = [...setsByCode.values()].filter((set) => !existingSetCodes.has(set.code));
    const updateSets = [...setsByCode.values()].filter((set) => existingSetCodes.has(set.code));

    if (newSets.length > 0) {
      await prisma.set.createMany({
        data: newSets,
        skipDuplicates: true,
      });
    }

    await runBatches(updateSets, (set) =>
      prisma.set.update({
        where: { code: set.code },
        data: { name: set.name },
      }),
    );

    const [allCards, allSets, existingPrintings] = await Promise.all([
      prisma.card.findMany({
        where: { slug: { in: [...cardsBySlug.keys()] } },
        select: { id: true, slug: true },
      }),
      prisma.set.findMany({
        where: { code: { in: [...setsByCode.keys()] } },
        select: { id: true, code: true },
      }),
      prisma.printing.findMany({
        where: {
          provider: "riftcodex",
          providerCardId: { in: mappedRecords.map((record) => record.printing.providerCardId) },
        },
        select: { id: true, providerCardId: true },
      }),
    ]);

    const cardIdsBySlug = new Map(allCards.map((card) => [card.slug, card.id]));
    const setIdsByCode = new Map(allSets.map((set) => [set.code, set.id]));
    const existingPrintingIds = new Set(existingPrintings.map((printing) => printing.providerCardId));
    const printingRows = mappedRecords.map((record) => ({
      ...record.printing,
      cardId: cardIdsBySlug.get(record.card.slug) ?? "",
      setId: record.set ? setIdsByCode.get(record.set.code) ?? null : null,
    }));
    const newPrintings = printingRows.filter((printing) => !existingPrintingIds.has(printing.providerCardId));
    const updatePrintings = printingRows.filter((printing) => existingPrintingIds.has(printing.providerCardId));

    for (const batch of chunk(newPrintings, BATCH_SIZE * 4)) {
      await prisma.printing.createMany({
        data: batch,
        skipDuplicates: true,
      });
    }

    await runBatches(updatePrintings, (printing) =>
      prisma.printing.update({
        where: {
          provider_providerCardId: {
            provider: printing.provider,
            providerCardId: printing.providerCardId,
          },
        },
        data: printing,
      }),
    );

    await prisma.importRun.update({
      where: { id: run.id },
      data: {
        status: "completed",
        finishedAt: new Date(),
        cardsSeen: sourceCards.length,
        cardsCreated: newCards.length,
        cardsUpdated: updateCards.length,
        printingsCreated: newPrintings.length,
        printingsUpdated: updatePrintings.length,
      },
    });

    console.log(
      `Imported ${sourceCards.length} Riftbound records: ${newCards.length} cards created, ${updateCards.length} cards updated, ${newPrintings.length} printings created, ${updatePrintings.length} printings updated.`,
    );
  } catch (error) {
    await prisma.importRun.update({
      where: { id: run.id },
      data: {
        status: "failed",
        finishedAt: new Date(),
        errorMessage: error instanceof Error ? error.message : String(error),
      },
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

function uniqueBy<T>(items: T[], getKey: (item: T) => string) {
  const map = new Map<string, T>();
  for (const item of items) {
    map.set(getKey(item), item);
  }
  return map;
}

function chunk<T>(items: T[], size: number) {
  const batches: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size));
  }
  return batches;
}

async function runBatches<T>(items: T[], run: (item: T) => Promise<unknown>) {
  for (const batch of chunk(items, BATCH_SIZE)) {
    await Promise.all(batch.map(run));
  }
}

async function fetchRiftcodexCards() {
  const baseUrl = process.env.RIFTCODEX_API_BASE_URL ?? "https://api.riftcodex.com";
  const cards = [];
  const limit = 250;
  let page = 1;
  let total = Number.POSITIVE_INFINITY;

  while (cards.length < total) {
    const url = new URL("/cards", baseUrl.replace(/\/api\/?$/, ""));
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("page", String(page));

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`RiftCodex request failed with ${response.status} ${response.statusText}`);
    }

    const payload = await response.json();
    const pageCards = extractRiftcodexCards(payload);
    cards.push(...pageCards);

    total =
      typeof payload === "object" && payload !== null && "total" in payload && typeof payload.total === "number"
        ? payload.total
        : pageCards.length < limit
          ? cards.length
          : total;

    if (pageCards.length === 0) {
      break;
    }

    page += 1;
  }

  return cards;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
