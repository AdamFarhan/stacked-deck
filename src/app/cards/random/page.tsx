import { notFound, redirect } from "next/navigation";
import { getRandomCard } from "@/lib/search";

export const dynamic = "force-dynamic";

export default async function RandomCardPage() {
  const card = await getRandomCard();

  if (!card) {
    notFound();
  }

  redirect(`/cards/${card.slug}`);
}
