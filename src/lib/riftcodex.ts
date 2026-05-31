import { z } from "zod";
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
  const searchText = compactSearchText([
    source.name,
    cleanName,
    type,
    supertype,
    domains,
    tags,
    rulesTextPlain,
    flavorText,
    source.set?.set_id,
    source.set?.id,
    source.set?.label,
  ]);

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
