import { redirect } from "next/navigation";
import { CardResult } from "@/components/card-result";
import { SearchForm } from "@/components/search-form";
import { getSingleCardRedirect, searchCards } from "@/lib/search";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q ?? "";
  const cards = await searchCards(query);
  const redirectSlug = getSingleCardRedirect(cards, query);

  if (redirectSlug) {
    redirect(`/cards/${redirectSlug}`);
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-8 max-w-2xl">
        <SearchForm initialQuery={query} />
      </div>

      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Search results</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {cards.length > 0
              ? `${cards.length} canonical ${cards.length === 1 ? "card" : "cards"} found for "${query}".`
              : `No cards found for "${query}".`}
          </p>
        </div>
      </div>

      {cards.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {cards.map((card) => (
            <CardResult key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed bg-card px-6 py-12 text-center">
          <h2 className="text-lg font-medium">Nothing in the stack yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Try a card name, champion, region, type, or set code. If the database is empty, run the card importer first.
          </p>
        </div>
      )}
    </section>
  );
}
