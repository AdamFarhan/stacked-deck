import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardImage } from "@/components/card-image";
import { CardRulesText } from "@/components/card-rules-text";
import { Tag } from "@/components/tag";
import {
  getClassificationTag,
  getVisibleDomains,
  isBattlefieldCard,
} from "@/lib/cards";
import { getCardBySlug } from "@/lib/search";

export const dynamic = "force-dynamic";

export default async function CardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const card = await getCardBySlug(slug);

  if (!card) {
    notFound();
  }

  const primaryPrinting = card.printings[0];
  const visibleDomains = getVisibleDomains(card.domains);
  const classificationTag = getClassificationTag(card);

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:grid-cols-[260px_1fr] lg:grid-cols-[320px_1fr]">
      <div>
        <CardImage
          src={primaryPrinting?.imageUrl}
          alt={
            primaryPrinting?.imageAltText ?? card.accessibilityText ?? card.name
          }
          priority
          sideways={isBattlefieldCard(card.type)}
        />
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">
            {card.name}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {classificationTag ? (
              <Tag value={classificationTag.value} label={classificationTag.label} />
            ) : null}
            {visibleDomains.map((domain) => (
              <Tag key={domain} value={domain} />
            ))}
            {primaryPrinting?.rarity ? (
              <Tag value={primaryPrinting.rarity} />
            ) : null}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Card Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <dl className="grid grid-cols-3 gap-3 text-sm">
              <Stat label="Energy" value={card.energy} />
              <Stat label="Power" value={card.power} />
              <Stat label="Might" value={card.might} />
            </dl>

            {card.rulesTextPlain ? (
              <CardRulesText text={card.rulesTextPlain} />
            ) : card.rulesTextHtml ? (
              <div className="rich-text text-sm leading-6">
                {stripProviderHtml(card.rulesTextHtml)}
              </div>
            ) : null}

            {card.flavorText ? (
              <blockquote className="border-l-2 pl-4 text-sm italic text-muted-foreground">
                {card.flavorText}
              </blockquote>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Printings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Set</th>
                    <th className="px-3 py-2 font-medium">Number</th>
                    <th className="px-3 py-2 font-medium">Rarity</th>
                    <th className="px-3 py-2 font-medium">Artist</th>
                  </tr>
                </thead>
                <tbody>
                  {card.printings.map((printing) => (
                    <tr key={printing.id} className="border-t">
                      <td className="px-3 py-2">
                        {printing.set?.code ?? "Unknown"}
                      </td>
                      <td className="px-3 py-2">
                        {printing.collectorNumber ?? "—"}
                      </td>
                      <td className="px-3 py-2">{printing.rarity ?? "—"}</td>
                      <td className="px-3 py-2">{printing.artist ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-md border bg-background p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-xl font-semibold">{value ?? "—"}</dd>
    </div>
  );
}

function stripProviderHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}
