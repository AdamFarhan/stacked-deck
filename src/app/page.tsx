import { SearchForm } from "@/components/search-form";

export default function HomePage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-150px)] w-full max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-full space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Riftbound card search</p>
          <h1 className="text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">Stacked Deck</h1>
        </div>
        <SearchForm size="large" />
      </div>
    </section>
  );
}
