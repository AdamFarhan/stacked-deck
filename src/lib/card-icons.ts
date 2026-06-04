import { normalizeText } from "@/lib/text";

export type TagIconMode = "image" | "mask";

export type TagIcon = {
  path: string;
  label: string;
  category: "card-type" | "domain" | "rarity" | "helper" | "tag";
  mode: TagIconMode;
};

const tagIcons = {
  battlefield: {
    path: "/riftbound-icons/card-types/battlefield.webp",
    label: "Battlefield",
    category: "card-type",
    mode: "mask",
  },
  gear: {
    path: "/riftbound-icons/card-types/gear.webp",
    label: "Gear",
    category: "card-type",
    mode: "mask",
  },
  legend: {
    path: "/riftbound-icons/card-types/legend.webp",
    label: "Legend",
    category: "card-type",
    mode: "mask",
  },
  rune: {
    path: "/riftbound-icons/card-types/rune.webp",
    label: "Rune",
    category: "card-type",
    mode: "mask",
  },
  spell: {
    path: "/riftbound-icons/card-types/spell.webp",
    label: "Spell",
    category: "card-type",
    mode: "mask",
  },
  unit: {
    path: "/riftbound-icons/card-types/unit.webp",
    label: "Unit",
    category: "card-type",
    mode: "mask",
  },
  body: {
    path: "/riftbound-icons/domains/body.webp",
    label: "Body",
    category: "domain",
    mode: "image",
  },
  calm: {
    path: "/riftbound-icons/domains/calm.webp",
    label: "Calm",
    category: "domain",
    mode: "image",
  },
  chaos: {
    path: "/riftbound-icons/domains/chaos.webp",
    label: "Chaos",
    category: "domain",
    mode: "image",
  },
  fury: {
    path: "/riftbound-icons/domains/fury.webp",
    label: "Fury",
    category: "domain",
    mode: "image",
  },
  mind: {
    path: "/riftbound-icons/domains/mind.webp",
    label: "Mind",
    category: "domain",
    mode: "image",
  },
  order: {
    path: "/riftbound-icons/domains/order.webp",
    label: "Order",
    category: "domain",
    mode: "image",
  },
  common: {
    path: "/riftbound-icons/rarities/common.webp",
    label: "Common",
    category: "rarity",
    mode: "image",
  },
  epic: {
    path: "/riftbound-icons/rarities/epic.webp",
    label: "Epic",
    category: "rarity",
    mode: "image",
  },
  rare: {
    path: "/riftbound-icons/rarities/rare.webp",
    label: "Rare",
    category: "rarity",
    mode: "image",
  },
  showcase: {
    path: "/riftbound-icons/rarities/showcase.webp",
    label: "Showcase",
    category: "rarity",
    mode: "image",
  },
  uncommon: {
    path: "/riftbound-icons/rarities/uncommon.webp",
    label: "Uncommon",
    category: "rarity",
    mode: "image",
  },
  might: {
    path: "/riftbound-icons/helper-icons/might.webp",
    label: "Might",
    category: "helper",
    mode: "mask",
  },
  power: {
    path: "/riftbound-icons/helper-icons/power.webp",
    label: "Power",
    category: "helper",
    mode: "mask",
  },
  tap: {
    path: "/riftbound-icons/helper-icons/tap.webp",
    label: "Tap",
    category: "helper",
    mode: "mask",
  },
  add: {
    path: "/riftbound-icons/tags/add.svg",
    label: "Add",
    category: "tag",
    mode: "mask",
  },
} satisfies Record<string, TagIcon>;

export function normalizeTagValue(value: string) {
  return normalizeText(value);
}

export function getTagIcon(value: string): TagIcon | null {
  return tagIcons[normalizeTagValue(value) as keyof typeof tagIcons] ?? null;
}
