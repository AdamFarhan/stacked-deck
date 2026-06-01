import { describe, expect, it } from "vitest";
import { extractRiftcodexCards, mapRiftcodexCard } from "@/lib/riftcodex";

const payload = [
  {
    id: "69bc5bd9d308c64675ca881e",
    name: "Master Yi - Honed",
    riftbound_id: "ogs-009-024",
    tcgplayer_id: "653144",
    collector_number: 9,
    attributes: {
      energy: 7,
      might: 6,
      power: 1,
    },
    classification: {
      type: "Unit",
      supertype: "Champion",
      rarity: "Epic",
      domain: ["Body"],
    },
    text: {
      rich: "<p>[Ganking] (I can move from battlefield to battlefield.)<br />I enter ready.</p>",
      plain: "[Ganking] (I can move from battlefield to battlefield.)I enter ready.",
      flavour: "The focused mind can pierce through stone.",
    },
    set: {
      set_id: "OGS",
      label: "Proving Grounds",
    },
    media: {
      image_url:
        "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/0e16976cd6d7ee5a874be9351b428671990fbd25-744x1039.png",
      artist: "Kudos Productions",
      accessibility_text: "Riftbound Unit: Yi, Honed.",
    },
    tags: ["Master Yi", "Ionia"],
    orientation: "portrait",
    metadata: {
      clean_name: "Master Yi Honed",
      updated_on: "2026-03-19T20:26:01.125749+00:00",
      alternate_art: false,
      overnumbered: false,
      signature: false,
    },
  },
  {
    id: "69bc5bf3d308c64675ca8a19",
    name: "Master Yi - Honed",
    riftbound_id: "opp-009-024",
    tcgplayer_id: "680376",
    collector_number: 9,
    attributes: {
      energy: 7,
      might: 6,
      power: 1,
    },
    classification: {
      type: "Unit",
      supertype: "Champion",
      rarity: "Promo",
      domain: ["Body"],
    },
    text: {
      rich: "<p>[Ganking] (I can move from battlefield to battlefield.)<br />I enter ready.</p>",
      plain: "[Ganking] (I can move from battlefield to battlefield.)I enter ready.",
      flavour: "The focused mind can pierce through stone.",
    },
    set: {
      set_id: "OPP",
      label: "Riftbound Organized Play Promotional Cards",
    },
    media: {
      image_url:
        "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/0e16976cd6d7ee5a874be9351b428671990fbd25-744x1039.png",
      artist: "Kudos Productions",
      accessibility_text: "Riftbound Unit: Yi, Honed.",
    },
    tags: ["Master Yi", "Ionia"],
    orientation: "portrait",
    metadata: {
      clean_name: "Master Yi Honed",
      updated_on: "2026-03-19T20:26:27.751381+00:00",
      alternate_art: false,
      overnumbered: false,
      signature: false,
    },
  },
];

describe("RiftCodex mapping", () => {
  it("extracts provider payloads and maps duplicate printings to one canonical slug", () => {
    const cards = extractRiftcodexCards({ data: payload });
    const mapped = cards.map(mapRiftcodexCard);

    expect(mapped).toHaveLength(2);
    expect(mapped[0].card.slug).toBe("master-yi-honed");
    expect(mapped[1].card.slug).toBe("master-yi-honed");
    expect(mapped[0].set?.code).toBe("OGS");
    expect(mapped[1].set?.code).toBe("OPP");
    expect(mapped[0].printing.rarity).toBe("Epic");
    expect(mapped[1].printing.rarity).toBe("Promo");
  });

  it("builds search text from card name, tags, and rules text only", () => {
    const [mapped] = extractRiftcodexCards({ data: payload }).map(mapRiftcodexCard);

    expect(mapped.card.searchText).toContain("Master Yi - Honed");
    expect(mapped.card.searchText).toContain("Master Yi Honed");
    expect(mapped.card.searchText).toContain("Master Yi");
    expect(mapped.card.searchText).toContain("Ionia");
    expect(mapped.card.searchText).toContain("[Ganking]");
    expect(mapped.card.searchText).toContain("I enter ready.");

    expect(mapped.card.searchText).not.toContain("Unit");
    expect(mapped.card.searchText).not.toContain("Champion");
    expect(mapped.card.searchText).not.toContain("Body");
    expect(mapped.card.searchText).not.toContain("OGS");
    expect(mapped.card.searchText).not.toContain("Proving Grounds");
    expect(mapped.card.searchText).not.toContain("The focused mind can pierce through stone.");
    expect(mapped.card.searchText).not.toContain("Riftbound Unit: Yi, Honed.");
  });
});
