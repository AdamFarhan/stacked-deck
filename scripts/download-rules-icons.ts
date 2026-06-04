import { PrismaClient } from "@prisma/client";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  getSeededKeywordNames,
  keywordFilename,
  keywordSourceUrl,
  numberSourceUrl,
} from "../src/lib/rules-icons";
import { extractBracketTags } from "../src/lib/rules-text";

const projectRoot = process.cwd();
const keywordDir = path.join(projectRoot, "public/riftbound-icons/description-keywords");
const numberDir = path.join(projectRoot, "public/riftbound-icons/numbers");
const manifestPath = path.join(projectRoot, "src/lib/rules-icon-manifest.ts");
const excludedObservedTags = new Set([
  "CHANNEL",
  "CONQUER",
  "COUNTER",
  "DISCARD",
  "EXHAUST",
  "GANK",
  "HOLDING",
  "KILL",
  "MOVE",
  "READY",
  "RECALL",
  "RECYCLE",
  "SHOWDOWN",
  "TRASH",
  "BURST",
  "REPEAT",
]);

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const keywords = await getKeywordNames();
  const downloaded: Array<{ token: string; sourceUrl: string; path: string }> = [];
  const missing: string[] = [];

  if (!dryRun) {
    await Promise.all([mkdir(keywordDir, { recursive: true }), mkdir(numberDir, { recursive: true })]);
  }

  for (let number = 0; number <= 9; number += 1) {
    const sourceUrl = numberSourceUrl(number);
    const localPath = path.join(numberDir, `${number}.svg`);

    if (dryRun) {
      downloaded.push({ token: String(number), sourceUrl, path: localPath });
      continue;
    }

    if (await downloadSvg(sourceUrl, localPath)) {
      downloaded.push({ token: String(number), sourceUrl, path: localPath });
    } else {
      missing.push(sourceUrl);
    }
  }

  for (const keyword of keywords) {
    const sourceUrl = keywordSourceUrl(keyword);
    const localPath = path.join(keywordDir, keywordFilename(keyword));

    if (dryRun) {
      downloaded.push({ token: keyword, sourceUrl, path: localPath });
      continue;
    }

    if (await downloadSvg(sourceUrl, localPath)) {
      downloaded.push({ token: keyword, sourceUrl, path: localPath });
    } else {
      missing.push(sourceUrl);
    }
  }

  if (!dryRun) {
    await writeKeywordManifest(downloaded.map((asset) => asset.token));
  }

  console.log(`Prepared ${downloaded.length} rules icon assets.`);
  if (missing.length > 0) {
    console.log(`Skipped ${missing.length} missing assets.`);
  }
}

async function getKeywordNames() {
  const keywords = new Set(getSeededKeywordNames());

  for (const tag of await getObservedBracketTags()) {
    const normalizedTag = tag.toUpperCase();

    if (!excludedObservedTags.has(normalizedTag)) {
      keywords.add(normalizedTag);
    }
  }

  return [...keywords].sort((a, b) => a.localeCompare(b));
}

async function writeKeywordManifest(tokens: string[]) {
  const keywords = tokens
    .filter((token) => !/^[0-9]$/.test(token))
    .sort((a, b) => a.localeCompare(b));
  const content = `export const availableRulesKeywordNames = ${JSON.stringify(keywords, null, 2)} as const;\n`;

  await writeFile(manifestPath, content, "utf8");
}

async function getObservedBracketTags() {
  const prisma = new PrismaClient();

  try {
    const cards = await prisma.card.findMany({
      select: { rulesTextPlain: true },
      where: {
        rulesTextPlain: {
          not: null,
        },
      },
    });

    return cards.flatMap((card) => extractBracketTags(card.rulesTextPlain ?? ""));
  } catch (error) {
    console.warn(`Could not read observed rules tags; continuing with seeded tags. ${String(error)}`);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

async function downloadSvg(sourceUrl: string, localPath: string) {
  const response = await fetch(sourceUrl);

  if (!response.ok) {
    return false;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("svg") && !contentType.includes("xml")) {
    return false;
  }

  await writeFile(localPath, await response.text(), "utf8");
  return true;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
