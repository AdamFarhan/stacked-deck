import { notFound } from "next/navigation";
import { CardResult } from "@/components/card-result";
import { getSetByCode } from "@/lib/search";

export const dynamic = "force-dynamic";

export default async function SetPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const set = await getSetByCode(code);

  if (!set) {
    notFound();
  }

  const uniqueCards = Array.from(
    new Map(
      set.printings.map((printing) => [
        printing.card.id,
        {
          ...printing.card,
          printings: [{ ...printing, set }],
        },
      ]),
    ).values(),
  );

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">{set.code}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal">{set.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{set.printings.length} printings imported</p>
      </div>
      <div className="mt-6 grid grid-cols-2 items-start gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {uniqueCards.map((card) => (
          <CardResult key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
