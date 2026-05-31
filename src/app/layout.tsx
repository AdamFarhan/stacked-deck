import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stacked Deck",
  description: "A Riftbound card search app.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col">
          <header className="border-b bg-background/80">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
              <Link href="/" className="text-lg font-semibold tracking-normal">
                Stacked Deck
              </Link>
              <nav className="flex items-center gap-4 text-sm text-muted-foreground">
                <Link href="/sets" className="hover:text-foreground">
                  Sets
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t">
            <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-5 text-muted-foreground">
              Stacked Deck is a noncommercial fan project and is not affiliated with Riot Games. Riftbound and
              associated card images are owned by Riot Games. Card data is imported from public community APIs and
              cached for search.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
