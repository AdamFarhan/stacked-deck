import { PrismaClient } from "@prisma/client";
import { isExcludedSet } from "../src/lib/excluded-sets";

const prisma = new PrismaClient();

async function main() {
  const sets = await prisma.set.findMany({
    select: {
      id: true,
      code: true,
      name: true,
    },
  });
  const excludedSets = sets.filter((set) => isExcludedSet(set));
  const excludedSetIds = excludedSets.map((set) => set.id);

  if (excludedSetIds.length === 0) {
    console.log("No excluded Promo/Judge sets found.");
    return;
  }

  const affectedPrintings = await prisma.printing.findMany({
    where: {
      setId: {
        in: excludedSetIds,
      },
    },
    select: {
      cardId: true,
    },
    distinct: ["cardId"],
  });
  const affectedCardIds = affectedPrintings.map((printing) => printing.cardId);

  const deletedPrintings = await prisma.printing.deleteMany({
    where: {
      setId: {
        in: excludedSetIds,
      },
    },
  });
  const deletedSets = await prisma.set.deleteMany({
    where: {
      id: {
        in: excludedSetIds,
      },
    },
  });
  const orphanedCards = await prisma.card.findMany({
    where: {
      id: {
        in: affectedCardIds,
      },
      printings: {
        none: {},
      },
    },
    select: {
      id: true,
    },
  });
  const deletedCards = await prisma.card.deleteMany({
    where: {
      id: {
        in: orphanedCards.map((card) => card.id),
      },
    },
  });

  console.log(
    [
      `Removed ${deletedSets.count} excluded sets: ${excludedSets.map((set) => `${set.code} (${set.name})`).join(", ")}`,
      `Removed ${deletedPrintings.count} printings from excluded sets.`,
      `Removed ${deletedCards.count} cards that had no remaining printings.`,
    ].join("\n"),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
