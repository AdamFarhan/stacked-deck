import Link from "next/link";
import type { CardWithPrintings } from "@/lib/search";
import { CardImage } from "@/components/card-image";
import { isBattlefieldCard } from "@/lib/cards";

export function CardResult({ card }: { card: CardWithPrintings }) {
  const printing = card.printings[0];
  const imageAlt =
    printing?.imageAltText ?? card.accessibilityText ?? card.name;

  return (
    <Link
      href={`/cards/${card.slug}`}
      className="group block focus-visible:outline-none"
    >
      <CardImage
        src={printing?.imageUrl}
        alt={imageAlt}
        className="transition duration-200 ease-out group-hover:-translate-y-1 group-hover:scale-[1.02] group-hover:shadow-xl group-focus-visible:-translate-y-1 group-focus-visible:scale-[1.02] group-focus-visible:shadow-xl group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2"
        sideways={isBattlefieldCard(card.type)}
      />
    </Link>
  );
}
