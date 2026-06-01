"use client";

import { Menu, X } from "lucide-react";
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
        <header className="border-b border-[var(--brand-purple-dark)] bg-[var(--brand-purple-light)] text-white">
          <div className="relative mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-3 sm:gap-4">
            <Link href="/" className="shrink-0 text-lg font-semibold tracking-normal" aria-label="Stacked Deck">
              <span className="sm:hidden">SD</span>
              <span className="hidden sm:inline">Stacked Deck</span>
            </Link>
            <div className="min-w-0 flex-1 sm:px-4">
              <SearchForm variant="header" />
            </div>
            <nav className="hidden items-center gap-4 text-sm text-white/80 sm:flex">
              <Link href="/sets" className="hover:text-white">
                Sets
              </Link>
            </nav>
            <Drawer direction="left" open={isMenuOpen} onOpenChange={setIsMenuOpen}>
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
              <DrawerContent id="mobile-navigation-drawer" className="sm:hidden">
                <DrawerHeader className="flex flex-row items-center justify-between gap-4 border-b p-4 text-left">
                  <div>
                    <DrawerTitle>Stacked Deck</DrawerTitle>
                    <DrawerDescription className="sr-only">Mobile navigation menu</DrawerDescription>
                  </div>
                  <DrawerClose asChild>
                    <Button type="button" variant="ghost" size="icon" aria-label="Close navigation menu">
                      <X className="h-5 w-5" />
                    </Button>
                  </DrawerClose>
                </DrawerHeader>
                <nav className="grid gap-1 p-2 text-sm">
                  <DrawerClose asChild>
                    <Link href="/sets" className="rounded-md px-3 py-2 font-medium hover:bg-accent">
                      Sets
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
          Stacked Deck is a noncommercial fan project and is not affiliated with Riot Games. Riftbound and associated
          card images are owned by Riot Games. Card data is imported from public community APIs and cached for search.
        </div>
      </footer>
    </div>
  );
}
