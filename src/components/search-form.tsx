"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchForm({
  initialQuery = "",
  size = "default",
}: {
  initialQuery?: string;
  size?: "default" | "large";
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full gap-2">
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search Riftbound cards"
        aria-label="Search Riftbound cards"
        autoFocus
        className={size === "large" ? "h-14 rounded-lg border-white/35 text-lg shadow-sm" : undefined}
      />
      <Button
        type="submit"
        size={size === "large" ? "lg" : "default"}
        aria-label="Search"
        className={size === "large" ? "border border-white/35 shadow-sm hover:border-white/50" : undefined}
      >
        <Search className="h-4 w-4" />
        Search
      </Button>
    </form>
  );
}
