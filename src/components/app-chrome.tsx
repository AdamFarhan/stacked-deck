"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      {!isHome ? (
        <header className="border-b border-[var(--brand-purple-dark)] bg-[var(--brand-purple-light)] text-white">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-semibold tracking-normal">
              Stacked Deck
            </Link>
            <nav className="flex items-center gap-4 text-sm text-white/80">
              <Link href="/sets" className="hover:text-white">
                Sets
              </Link>
            </nav>
          </div>
        </header>
      ) : null}
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-5 text-muted-foreground">
          Stacked Deck is a noncommercial fan project and is not affiliated with Riot Games. Riftbound and associated
          card images are owned by Riot Games. Card data is imported from public community APIs and cached for search.
        </div>
      </footer>
    </div>
  );
}
