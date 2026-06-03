import { z } from "zod";
import { isExcludedSet } from "@/lib/excluded-sets";
import { compactSearchText, normalizeText, slugify } from "@/lib/text";

export const riftcodexCardSchema = z.object({
  id: z.string(),
  name: z.string(),
  riftbound_id: z.string().nullable().optional(),
  tcgplayer_id: z.string().nullable().optional(),
  collector_number: z.number().int().nullable().optional(),
  attributes: z
    .object({
      energy: z.number().int().nullable().optional(),
      might: z.number().int().nullable().optional(),
      power: z.number().int().nullable().optional(),
    })
    .nullable()
    .optional(),
  classification: z
    .object({
      type: z.string().nullable().optional(),
      supertype: z.string().nullable().optional(),
      rarity: z.string().nullable().optional(),
      domain: z.array(z.string()).nullable().optional(),
    })
    .nullable()
    .optional(),
  text: z
    .object({
      rich: z.string().nullable().optional(),
      plain: z.string().nullable().optional(),
      flavour: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  set: z
    .object({
      set_id: z.string().nullable().optional(),
      id: z.string().nullable().optional(),
      label: z.string(),
    })
    .nullable()
    .optional(),
  media: z
    .object({
      image_url: z.string().url().nullable().optional(),
      artist: z.string().nullable().optional(),
      accessibility_text: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  tags: z.array(z.string()).nullable().optional(),
  orientation: z.string().nullable().optional(),
  metadata: z
    .object({
      clean_name: z.string().nullable().optional(),
      updated_on: z.string().nullable().optional(),
      alternate_art: z.boolean().nullable().optional(),
      overnumbered: z.boolean().nullable().optional(),
      signature: z.boolean().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export type RiftcodexCard = z.infer<typeof riftcodexCardSchema>;

export const riftcodexSetSchema = z.object({
  id: z.string(),
  set_id: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  label: z.string().nullable().optional(),
  card_count: z.number().int().nullable().optional(),
  published_on: z.string().nullable().optional(),
});

export type RiftcodexSet = z.infer<typeof riftcodexSetSchema>;
export type RiftcodexSetImport = {
  code: string;
  name: string;
  cardCount: number | null;
  releaseDate: Date | null;
};

export function filterImportableRiftcodexCards(cards: RiftcodexCard[]) {
  return cards.filter(
    (card) =>
      !isExcludedSet({
        code: card.set?.set_id ?? card.set?.id,
        name: card.set?.label,
      }),
  );
}

export function extractRiftcodexCards(payload: unknown): RiftcodexCard[] {
  const candidate =
    Array.isArray(payload)
      ? payload
      : typeof payload === "object" && payload !== null && "cards" in payload
        ? (payload as { cards: unknown }).cards
        : typeof payload === "object" && payload !== null && "items" in payload
          ? (payload as { items: unknown }).items
        : typeof payload === "object" && payload !== null && "data" in payload
          ? (payload as { data: unknown }).data
          : [];

  return z.array(riftcodexCardSchema).parse(candidate);
}

export function extractRiftcodexSets(payload: unknown): RiftcodexSet[] {
  const candidate =
    Array.isArray(payload)
      ? payload
      : typeof payload === "object" && payload !== null && "sets" in payload
        ? (payload as { sets: unknown }).sets
        : typeof payload === "object" && payload !== null && "items" in payload
          ? (payload as { items: unknown }).items
          : typeof payload === "object" && payload !== null && "data" in payload
            ? (payload as { data: unknown }).data
            : [];

  return z.array(riftcodexSetSchema).parse(candidate);
}

export function filterImportableRiftcodexSets(sets: RiftcodexSet[]) {
  return sets.filter(
    (set) =>
      !isExcludedSet({
        code: set.set_id ?? set.id,
        name: set.label ?? set.name,
      }),
  );
}

export function mapRiftcodexSet(source: RiftcodexSet): RiftcodexSetImport {
  const code = (source.set_id ?? source.id).toUpperCase();

  return {
    code,
    name: source.label ?? source.name ?? code,
    cardCount: source.card_count ?? null,
    releaseDate: parseRiftcodexDate(source.published_on),
  };
}

export function mergeRiftcodexSets(
  cardSets: Iterable<{ code: string; name: string }>,
  endpointSets: RiftcodexSetImport[],
) {
  const setsByCode = new Map<string, RiftcodexSetImport>();

  for (const set of cardSets) {
    setsByCode.set(set.code, {
      code: set.code,
      name: set.name,
      cardCount: null,
      releaseDate: null,
    });
  }

  for (const set of endpointSets) {
    const existing = setsByCode.get(set.code);
    if (!existing) continue;

    setsByCode.set(set.code, {
      code: set.code,
      name: set.name || existing.name || set.code,
      cardCount: set.cardCount,
      releaseDate: set.releaseDate,
    });
  }

  return setsByCode;
}

export function mapRiftcodexCard(source: RiftcodexCard) {
  const cleanName = source.metadata?.clean_name ?? source.name.replace(/\s+-\s+/g, " ");
  const normalizedName = normalizeText(cleanName);
  const type = source.classification?.type ?? null;
  const supertype = source.classification?.supertype ?? null;
  const domains = source.classification?.domain ?? [];
  const tags = source.tags ?? [];
  const rulesTextPlain = source.text?.plain ?? null;
  const rulesTextHtml = source.text?.rich ?? null;
  const flavorText = source.text?.flavour ?? null;
  const searchText = compactSearchText([source.name, cleanName, tags, rulesTextPlain]);

  return {
    set: source.set
      ? {
          code: (source.set.set_id ?? source.set.id ?? "UNK").toUpperCase(),
          name: source.set.label,
        }
      : null,
    card: {
      slug: slugify(cleanName),
      name: source.name,
      cleanName,
      normalizedName,
      type,
      supertype,
      domains,
      energy: source.attributes?.energy ?? null,
      might: source.attributes?.might ?? null,
      power: source.attributes?.power ?? null,
      rulesTextPlain,
      rulesTextHtml,
      flavorText,
      tags,
      orientation: source.orientation ?? null,
      accessibilityText: source.media?.accessibility_text ?? null,
      searchText,
    },
    printing: {
      provider: "riftcodex",
      providerCardId: source.id,
      riftboundId: source.riftbound_id ?? null,
      tcgplayerId: source.tcgplayer_id ?? null,
      collectorNumber: source.collector_number ?? null,
      rarity: source.classification?.rarity ?? null,
      imageUrl: source.media?.image_url ?? null,
      imageWidth: 744,
      imageHeight: 1039,
      imageSource: source.media?.image_url ? "riot-cms" : null,
      imageAltText: source.media?.accessibility_text ?? source.name,
      artist: source.media?.artist ?? null,
      alternateArt: source.metadata?.alternate_art ?? false,
      overnumbered: source.metadata?.overnumbered ?? false,
      signature: source.metadata?.signature ?? false,
      providerUpdatedAt: source.metadata?.updated_on ? new Date(source.metadata.updated_on) : null,
      rawSource: source,
    },
  };
}

function parseRiftcodexDate(value: string | null | undefined) {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
