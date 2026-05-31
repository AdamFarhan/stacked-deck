import { SearchForm } from "@/components/search-form";

export default function HomePage() {
  return (
    <section className="home-brand-gradient flex min-h-screen w-full flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-full max-w-3xl space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-white/75">Riftbound card search</p>
          <h1 className="text-4xl font-semibold tracking-normal text-white sm:text-5xl">Stacked Deck</h1>
        </div>
        <SearchForm size="large" />
      </div>
    </section>
  );
}
