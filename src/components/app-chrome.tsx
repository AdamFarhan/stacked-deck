"use client";

import { List, Menu, Shuffle, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      {!isHome ? (
        <header className="sticky top-0 z-40 border-b border-[var(--brand-purple-dark)] bg-[var(--brand-purple-light)] text-white">
          <div className="relative mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-3 sm:gap-4">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 text-lg font-semibold tracking-normal"
              aria-label="Stacked Deck"
            >
              <img
                src="/logo-white.png"
                alt=""
                className="h-auto w-9"
                width="512"
                height="386"
              />
              <span className="font-beaufort hidden text-xl font-bold sm:inline">
                Stacked Deck
              </span>
            </Link>
            <div className="min-w-0 flex-1 sm:px-4">
              <SearchForm variant="header" />
            </div>
            <nav className="hidden items-center gap-4 text-sm text-white/80 sm:flex">
              <Link href="/search/advanced" className="hover:text-white">
                Advanced
              </Link>
              <Link href="/sets" className="hover:text-white">
                Sets
              </Link>
              <Link href="/cards/random" className="hover:text-white">
                Random
              </Link>
            </nav>
            <Drawer
              direction="left"
              open={isMenuOpen}
              onOpenChange={setIsMenuOpen}
            >
              <DrawerTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-navigation-drawer"
                  className="h-9 w-9 shrink-0 text-white hover:bg-white/10 hover:text-white focus-visible:ring-white/50 sm:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent
                id="mobile-navigation-drawer"
                className="sm:hidden"
              >
                <DrawerHeader className="flex flex-row items-center justify-between gap-4 border-b p-4 text-left">
                  <div className="flex items-center gap-3">
                    <img
                      src="/logo-black.png"
                      alt=""
                      className="h-auto w-10"
                      width="512"
                      height="386"
                    />
                    <DrawerTitle className="font-beaufort font-bold">
                      Stacked Deck
                    </DrawerTitle>
                    <DrawerDescription className="sr-only">
                      Mobile navigation menu
                    </DrawerDescription>
                  </div>
                  <DrawerClose asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Close navigation menu"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </DrawerClose>
                </DrawerHeader>
                <nav className="grid gap-1 p-2 text-sm">
                  <DrawerClose asChild>
                    <Link
                      href="/search/advanced"
                      className="inline-flex items-center gap-2 rounded-md px-3 py-2 font-medium hover:bg-accent"
                    >
                      <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                      Advanced
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link
                      href="/sets"
                      className="inline-flex items-center gap-2 rounded-md px-3 py-2 font-medium hover:bg-accent"
                    >
                      <List className="h-4 w-4" aria-hidden="true" />
                      Sets
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link
                      href="/cards/random"
                      className="inline-flex items-center gap-2 rounded-md px-3 py-2 font-medium hover:bg-accent"
                    >
                      <Shuffle className="h-4 w-4" aria-hidden="true" />
                      Random
                    </Link>
                  </DrawerClose>
                </nav>
              </DrawerContent>
            </Drawer>
          </div>
        </header>
      ) : null}
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-5 text-muted-foreground">
          Stacked Deck is a noncommercial fan project and is not affiliated with
          Riot Games. Riftbound and associated card images are owned by Riot
          Games. Card data is imported from public community APIs and cached for
          search.
        </div>
      </footer>
    </div>
  );
}
