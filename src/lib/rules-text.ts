import { normalizeText } from "@/lib/text";

export type RulesTextToken =
  | { type: "text"; value: string }
  | { type: "lineBreak" }
  | { type: "keyword"; value: string }
  | { type: "colonIcon"; value: string }
  | { type: "hidden" };

const tokenPattern = /(\[[^\]]+\]|:rb_[a-z0-9_]+:|\r?\n)/gi;

export function getDisplayRulesText({
  plain,
  rich,
}: {
  plain?: string | null;
  rich?: string | null;
}) {
  return rich ? richRulesTextToPlainText(rich) : plain?.trim() || null;
}

export function richRulesTextToPlainText(html: string) {
  return decodeHtmlEntities(
    html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p\s*>/gi, "\n")
      .replace(/<p(?:\s[^>]*)?>/gi, "")
      .replace(/<\/(?:div|li)\s*>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
  );
}

export function parseRulesText(text: string): RulesTextToken[] {
  const tokens: RulesTextToken[] = [];
  let cursor = 0;

  for (const match of text.matchAll(tokenPattern)) {
    const rawToken = match[0];
    const index = match.index ?? 0;

    appendText(tokens, text.slice(cursor, index));
    appendToken(tokens, rawToken);
    cursor = index + rawToken.length;
  }

  appendText(tokens, text.slice(cursor));

  return tokens;
}

export function extractBracketTags(text: string) {
  const tags = new Set<string>();

  for (const token of parseRulesText(text)) {
    if (token.type === "keyword") {
      tags.add(token.value);
    }
  }

  return [...tags];
}

export function formatUnknownColonToken(value: string) {
  return normalizeText(value.replace(/^rb_/, "")).replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function appendText(tokens: RulesTextToken[], value: string) {
  if (value.length > 0) {
    tokens.push({ type: "text", value });
  }
}

function appendToken(tokens: RulesTextToken[], rawToken: string) {
  if (rawToken === "\n" || rawToken === "\r\n") {
    tokens.push({ type: "lineBreak" });
    return;
  }

  if (rawToken.startsWith("[") && rawToken.endsWith("]")) {
    const value = rawToken.slice(1, -1).trim();

    tokens.push(isHiddenBracketToken(value) ? { type: "hidden" } : { type: "keyword", value });
    return;
  }

  if (rawToken.startsWith(":") && rawToken.endsWith(":")) {
    tokens.push({ type: "colonIcon", value: rawToken.slice(1, -1) });
  }
}

function isHiddenBracketToken(value: string) {
  return value === ">" || value.toLowerCase() === "&gt;";
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&gt;/gi, ">")
    .replace(/&lt;/gi, "<")
    .replace(/&amp;/gi, "&")
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"');
}
