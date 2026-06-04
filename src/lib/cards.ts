export function isBattlefieldCard(type?: string | null) {
  return type?.toLowerCase() === "battlefield";
}

export function getVisibleDomains(domains: string[]) {
  return domains.filter((domain) => domain.toLowerCase() !== "colorless");
}

export function getClassificationTag({
  supertype,
  type,
}: {
  supertype?: string | null;
  type?: string | null;
}) {
  if (!type) {
    return supertype ? { value: supertype, label: supertype } : null;
  }

  if (supertype && ["champion", "signature"].includes(supertype.toLowerCase())) {
    return { value: type, label: `${supertype} ${type}` };
  }

  return { value: type, label: type };
}
