import { Heart } from "lucide-react";

import { ListingCard } from "@/components/marketplace/listing-card";
import { EmptyState } from "@/components/ui/empty-state";
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
    <Container className="py-8">
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary">Saved</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Listings worth revisiting.</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Keep track of products you may want to buy later.
        </p>
      </div>

      {savedListings.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {savedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Heart className="size-8" />}
          title="No saved listings yet"
          description="Save items from the marketplace and they will appear here."
        />
      )}
    </Container>
  );
}
