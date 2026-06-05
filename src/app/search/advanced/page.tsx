import { AdvancedSearchForm } from "@/components/advanced-search-form";
import { CardResult } from "@/components/card-result";
import {
  advancedSearchCards,
  getSets,
  hasAdvancedSearchCriteria,
  parseAdvancedSearchParams,
} from "@/lib/search";

export const dynamic = "force-dynamic";

export default async function AdvancedSearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseAdvancedSearchParams(params);
  const [sets, cards] = await Promise.all([
    getSets(),
    advancedSearchCards(filters),
  ]);
  const hasCriteria = hasAdvancedSearchCriteria(filters);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-normal">
          Advanced search
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search all Riftbound cards
        </p>
      </div>

      <div className="rounded-lg border bg-card p-4 shadow-sm sm:p-6">
        <AdvancedSearchForm
          filters={filters}
          sets={sets.map((set) => ({ code: set.code, name: set.name }))}
        />
      </div>

      <div className="mt-8">
        {hasCriteria && (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {cards.length} {cards.length === 1 ? "card" : "cards"} found.
            </p>
            {cards.length > 0 ? (
              <div className="grid grid-cols-2 items-start gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {cards.map((card) => (
                  <CardResult key={card.id} card={card} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No cards match your filters"
                description="Try changing a filter or widening one of the ranges."
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-dashed bg-card px-6 py-12 text-center">
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
