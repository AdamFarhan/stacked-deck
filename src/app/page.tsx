import { SearchForm } from "@/components/search-form";
import { List } from "lucide-react";
import Link from "next/link";

const homeLinks = [
  {
    href: "/sets",
    label: "Sets",
    Icon: List,
  },
];

export default function HomePage() {
  return (
    <section className="home-brand-gradient flex min-h-screen w-full flex-col items-center px-4 py-16 text-center">
      <div className="flex w-full flex-1 items-center justify-center">
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
            <nav aria-label="Home navigation" className="flex flex-wrap items-center justify-center gap-2">
              {homeLinks.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <p className="pt-12 text-lg font-light italic tracking-normal text-white/80">Just lucky, I guess.</p>
    </section>
  );
}
