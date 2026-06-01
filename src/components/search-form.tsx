"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, KeyboardEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchForm({
  initialQuery = "",
  size = "default",
  variant = "default",
}: {
  initialQuery?: string;
  size?: "default" | "large";
  variant?: "default" | "header";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const isHeader = variant === "header";

  useEffect(() => {
    if (isHeader) {
      setQuery(new URLSearchParams(window.location.search).get("q") ?? "");
    }
  }, [isHeader, pathname]);

  function submitQuery() {
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitQuery();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (isHeader && event.key === "Enter") {
      event.preventDefault();
      submitQuery();
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full gap-2">
      <div className="relative w-full">
        {isHeader ? (
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/65" />
        ) : null}
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={isHeader ? "Search cards" : "Search Riftbound cards"}
          aria-label="Search Riftbound cards"
          autoFocus={size === "large"}
          className={
            isHeader
              ? "h-9 border-white/25 bg-white/10 pl-9 text-white shadow-sm placeholder:text-white/60 focus-visible:ring-white/50"
              : size === "large"
                ? "h-14 rounded-lg border-white/35 text-lg shadow-sm"
                : undefined
          }
        />
      </div>
      {!isHeader ? (
        <Button
          type="submit"
          size={size === "large" ? "lg" : "default"}
          aria-label="Search"
          className={size === "large" ? "border border-white/35 shadow-sm hover:border-white/50" : undefined}
        >
          <Search className="h-4 w-4" />
          Search
        </Button>
      ) : (
        <button type="submit" className="sr-only">
          Search
        </button>
      )}
    </form>
  );
}
