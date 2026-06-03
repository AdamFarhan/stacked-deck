import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getSets } from "@/lib/search";

export const dynamic = "force-dynamic";

export default async function SetsPage() {
  const sets = await getSets();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-normal">Sets</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sets.map((set) => (
          <Link
            key={set.id}
            href={`/sets/${set.code.toLowerCase()}`}
            className="block"
          >
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>{set.name}</CardTitle>
                <CardDescription>{set.code}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {formatReleaseDate(set.releaseDate)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {set._count.printings} cards
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {sets.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed bg-card px-6 py-12 text-center text-sm text-muted-foreground">
          No sets imported yet.
        </div>
      ) : null}
    </section>
  );
}

function formatReleaseDate(releaseDate: Date | null) {
  if (!releaseDate) {
    return "Release date unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(releaseDate);
}
