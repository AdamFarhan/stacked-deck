import { SearchForm } from "@/components/search-form";

export default function HomePage() {
  return (
    <section className="home-brand-gradient flex min-h-screen w-full flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-full max-w-3xl space-y-7">
        <div>
          <div className="flex items-center justify-center gap-4 sm:gap-5">
            <img
              src="/logo-white.png"
              alt="Stacked Deck logo"
              className="h-auto w-20 sm:w-28"
              width="512"
              height="386"
            />
            <h1 className="font-beaufort text-4xl font-bold tracking-normal text-white sm:text-6xl">Stacked Deck</h1>
          </div>
        </div>
        <div className="mx-auto w-full max-w-xl space-y-4">
          <SearchForm size="large" />
          <p className="text-lg font-light italic tracking-normal text-white/80">Just lucky, I guess.</p>
        </div>
      </div>
    </section>
  );
}
