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
        className={size === "large" ? "h-14 rounded-lg text-lg" : undefined}
      />
      <Button type="submit" size={size === "large" ? "lg" : "default"} aria-label="Search">
        <Search className="h-4 w-4" />
        Search
      </Button>
    </form>
  );
}
