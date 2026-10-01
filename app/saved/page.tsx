import { ArrowUpRight, Heart } from "lucide-react";
import Link from "next/link";

import { ListingCard } from "@/components/marketplace/listing-card";
import { Container } from "@/components/ui/container";
import { getSavedListings } from "@/features/marketplace/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Saved",
};

export default async function SavedPage() {
  const supabase = await createClient();
  const savedListings = await getSavedListings(supabase);

  return (
    <Container className="pb-24 pt-8 lg:pb-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Your shortlist</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">The things you almost bought.</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Keep good finds close until the timing feels right.</p>
      </div>

      {savedListings.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {savedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="border-y border-border py-14 text-center"><Heart className="mx-auto size-8 text-primary" /><h2 className="mt-5 font-display text-2xl font-bold">Nothing saved yet.</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">When something catches your eye, tap the heart and it will wait here for you.</p><Link href="/marketplace" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-bold text-background">Explore campus <ArrowUpRight className="size-4" /></Link></div>
      )}
    </Container>
  );
}
