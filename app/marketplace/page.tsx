import { PackageSearch, Plus } from "lucide-react";

import { ListingCard } from "@/components/marketplace/listing-card";
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Container } from "@/components/ui/container";
import { getListings, getSavedListingIds } from "@/features/marketplace/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Marketplace",
};

type MarketplacePageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    condition?: string;
    sort?: string;
    message?: string;
  }>;
};

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const [listings, savedIds, categories] = await Promise.all([
    getListings(supabase, params),
    getSavedListingIds(supabase),
    // fetch categories from DB
    supabase.from("categories").select("id,name").order("name", { ascending: true }),
  ]);
  const categoryRows = (categories.data ?? []) as { id: string; name: string }[];
  const hydratedListings = listings.map((listing) => ({
    ...listing,
    isSaved: savedIds.has(listing.id),
  }));

  return (
    <Container className="py-8">
      {params.message ? (
        <p className="mb-6 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
          {params.message}
        </p>
      ) : null}

      <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <Badge variant="soft">Campus marketplace</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Discover what GBU students are selling.
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Browse verified campus listings, compare prices, and save the items worth revisiting.
          </p>
        </div>
        <Button asChild href="/sell" size="lg">
          <Plus className="size-4" />
          Sell product
        </Button>
      </div>

      <MarketplaceFilters categories={categoryRows} />

      {hydratedListings.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {hydratedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<PackageSearch className="size-8" />}
          title="No listings found"
          description="Try a different search or category, or be the first to publish a product."
        />
      )}
    </Container>
  );
}
