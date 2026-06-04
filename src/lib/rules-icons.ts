import { normalizeText } from "@/lib/text";
import { availableRulesKeywordNames } from "@/lib/rules-icon-manifest";

export type RulesIconKind = "keyword" | "number" | "helper";

export type RulesIcon = {
  kind: RulesIconKind;
  path: string;
  label: string;
  mode: "image" | "mask";
  sourceUrl?: string;
};

export const baseRulesKeywords = [
  "ACTION",
  "ADD",
  "BANISH",
  "BUFF",
  "DEATHKNELL",
  "HIDDEN",
  "LEGION",
  "MIGHTY",
  "STUN",
  "TANK",
  "TEMPORARY",
  "ACCELERATE",
  "AMBUSH",
  "QUICK-DRAW",
  "UNIQUE",
  "VISION",
  "WEAPONMASTER",
  "EQUIP",
  "REACTION",
  "REPEAT",
] as const;

export const numberedRulesKeywords = [
  "ASSAULT",
  "DEFLECT",
  "PREDICT",
  "SHIELD",
  "HUNT",
] as const;

export const levelRulesKeyword = "LEVEL";
export const maxNumberedKeywordValue = 5;
export const maxLevelKeywordValue = 16;

const helperIcons = {
  rb_rune_rainbow: {
    kind: "helper",
    path: "/riftbound-icons/helper-icons/power.webp",
    label: "Rainbow Rune",
    mode: "image",
  },
  rb_rune_body: {
    kind: "helper",
    path: "/riftbound-icons/domains/body.webp",
    label: "Body Rune",
    mode: "image",
  },
  rb_rune_calm: {
    kind: "helper",
    path: "/riftbound-icons/domains/calm.webp",
    label: "Calm Rune",
    mode: "image",
  },
  rb_rune_chaos: {
    kind: "helper",
    path: "/riftbound-icons/domains/chaos.webp",
    label: "Chaos Rune",
    mode: "image",
  },
  rb_rune_fury: {
    kind: "helper",
    path: "/riftbound-icons/domains/fury.webp",
    label: "Fury Rune",
    mode: "image",
  },
  rb_rune_mind: {
    kind: "helper",
    path: "/riftbound-icons/domains/mind.webp",
    label: "Mind Rune",
    mode: "image",
  },
  rb_rune_order: {
    kind: "helper",
    path: "/riftbound-icons/domains/order.webp",
    label: "Order Rune",
    mode: "image",
  },
  rb_exhaust: {
    kind: "helper",
    path: "/riftbound-icons/helper-icons/tap.webp",
    label: "Exhaust",
    mode: "mask",
  },
  rb_might: {
    kind: "helper",
    path: "/riftbound-icons/helper-icons/might.webp",
    label: "Might",
    mode: "mask",
  },
} satisfies Record<string, RulesIcon>;

const keywordSourceNames: Record<string, string> = {
  reaction: "Reaction",
};

const availableKeywordIcons = buildKeywordIconMap([...availableRulesKeywordNames]);
const seededKeywordIcons = buildKeywordIconMap(getSeededKeywordNames());

export function normalizeRulesToken(value: string) {
  return normalizeText(value);
}

export function keywordFilename(value: string) {
  return `${normalizeRulesToken(value).replace(/\s+/g, "-")}.svg`;
}

export function keywordSourceUrl(value: string) {
  const sourceName = keywordSourceNames[normalizeRulesToken(value)] ?? value;

  return `https://cdn.piltoverarchive.com/description_keywords/${encodeURIComponent(sourceName)}.svg`;
}

export function numberSourceUrl(value: number) {
  return `https://cdn.piltoverarchive.com/icons/${value}.svg`;
}

export function getRulesKeywordIcon(value: string): RulesIcon | null {
  return availableKeywordIcons[normalizeRulesToken(value)] ?? null;
}

export function getSeededRulesKeywordIcon(value: string): RulesIcon | null {
  return seededKeywordIcons[normalizeRulesToken(value)] ?? null;
}

export function getRulesColonIcon(value: string): RulesIcon | null {
  const normalized = value.trim().toLowerCase();
  const energyMatch = normalized.match(/^rb_energy_([0-9])$/);

  if (energyMatch) {
    const number = energyMatch[1];
    return {
      kind: "number",
      path: `/riftbound-icons/numbers/${number}.svg`,
      label: number,
      mode: "mask",
      sourceUrl: numberSourceUrl(Number(number)),
    };
  }

  return helperIcons[normalized as keyof typeof helperIcons] ?? null;
}

export function getRulesIconForToken(type: "bracket" | "colon", value: string) {
  return type === "bracket" ? getRulesKeywordIcon(value) : getRulesColonIcon(value);
}

export function getSeededKeywordNames() {
  return [
    ...baseRulesKeywords,
    ...numberedRulesKeywords.flatMap((keyword) => expandNumberedKeyword(keyword, maxNumberedKeywordValue)),
    ...expandNumberedKeyword(levelRulesKeyword, maxLevelKeywordValue),
  ];
}

export function expandNumberedKeyword(keyword: string, maxValue: number) {
  return [
    keyword,
    ...Array.from({ length: maxValue }, (_, index) => `${keyword} ${index + 1}`),
  ];
}

function buildKeywordIconMap(keywords: string[]) {
  const icons: Record<string, RulesIcon> = {};

  for (const keyword of keywords) {
    icons[normalizeRulesToken(keyword)] = {
      kind: "keyword",
      path: `/riftbound-icons/description-keywords/${keywordFilename(keyword)}`,
      label: keyword,
      mode: "image",
      sourceUrl: keywordSourceUrl(keyword),
    };
  }

  return icons;
}
