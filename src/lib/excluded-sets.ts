const EXCLUDED_SET_CODES = new Set(["JDG", "JUDGE", "OPP", "PR"]);
const EXCLUDED_SET_NAME_PATTERNS = [/\bjudge\b/i, /\bpromos?\b/i, /\bpromotional\b/i];

export type SetIdentity = {
  code?: string | null;
  name?: string | null;
};

export function isExcludedSet(set: SetIdentity | null | undefined) {
  if (!set) return false;

  const code = set.code?.trim().toUpperCase();
  if (code && EXCLUDED_SET_CODES.has(code)) {
    return true;
  }

  const name = set.name?.trim();
  if (!name) {
    return false;
  }

  return EXCLUDED_SET_NAME_PATTERNS.some((pattern) => pattern.test(name));
}
