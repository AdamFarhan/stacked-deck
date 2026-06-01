export function isBattlefieldCard(type?: string | null) {
  return type?.toLowerCase() === "battlefield";
}

export function getVisibleDomains(domains: string[]) {
  return domains.filter((domain) => domain.toLowerCase() !== "colorless");
}
