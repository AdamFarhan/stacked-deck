export function normalizeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function slugify(value: string) {
  const normalized = normalizeText(value);
  return normalized.length > 0 ? normalized.replace(/\s+/g, "-") : "untitled-card";
}

export function compactSearchText(parts: Array<string | null | undefined | string[]>) {
  return parts
    .flatMap((part) => (Array.isArray(part) ? part : [part]))
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(" ");
}
