import Link from "next/link";
import type { CardWithPrintings } from "@/lib/search";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CardImage } from "@/components/card-image";

export function CardResult({ card }: { card: CardWithPrintings }) {
  const printing = card.printings[0];
  const imageAlt = printing?.imageAltText ?? card.accessibilityText ?? card.name;

  return (
    <Link href={`/cards/${card.slug}`} className="group block">
      <Card className="h-full overflow-hidden bg-black transition-shadow hover:shadow-md">
        <CardImage src={printing?.imageUrl} alt={imageAlt} className="rounded-b-none border-0" />
        <CardContent className="space-y-3 bg-card p-4">
          <div>
            <h2 className="line-clamp-2 text-base font-semibold leading-tight">{card.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {[card.supertype, card.type].filter(Boolean).join(" ") || "Riftbound card"}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {card.domains.map((domain) => (
              <Badge key={domain} variant="outline">
                {domain}
              </Badge>
            ))}
            {printing?.rarity ? <Badge>{printing.rarity}</Badge> : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
