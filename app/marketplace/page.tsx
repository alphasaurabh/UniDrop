import { Plus } from "lucide-react";

import { ListingsGrid } from "@/components/marketplace/listings-grid";
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getListings, getSavedListingIds } from "@/features/marketplace/queries";
import { loadMoreListings } from "@/features/marketplace/actions";
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
    page?: string;
    message?: string;
  }>;
};

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  // Parse and validate page number
  const pageParam = params.page ? Math.max(1, parseInt(params.page, 10)) : 1;

  const filters = {
    q: params.q,
    category: params.category,
    condition: params.condition,
    sort: params.sort,
    page: pageParam,
  };

  const [result, savedIds, categories] = await Promise.all([
    getListings(supabase, filters),
    getSavedListingIds(supabase),
    // fetch categories from DB
    supabase.from("categories").select("id,name").order("name", { ascending: true }),
  ]);

  const categoryRows = (categories.data ?? []) as { id: string; name: string }[];
  const hydratedListings = result.listings.map((listing) => ({
    ...listing,
    isSaved: savedIds.has(listing.id),
  }));

  return (
    <Container className="mobile-safe">
      {params.message ? (
        <p className="mb-6 surface-panel px-4 py-3 text-sm text-primary rounded-xl">
          {params.message}
        </p>
      ) : null}

      <section className="surface-elevated mb-8 overflow-hidden p-5 sm:p-8">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Badge variant="soft" className="rounded-full px-3 py-1.5 text-xs">Campus marketplace</Badge>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-6xl">
              Discover what students are selling.
            </h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground">
              Browse verified campus listings, compare prices, save items, and explore a clean marketplace feed.
            </p>
          </div>
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-1">
            <Card className="px-3 py-3 sm:px-4 sm:py-4">
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Results</p>
              <p className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight">{result.pagination.total}</p>
            </Card>
            <Card className="px-3 py-3 sm:px-4 sm:py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Saved</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">{savedIds.size}</p>
            </Card>
            <Button asChild href="/sell" size="lg" className="self-stretch">
              <Plus className="size-4" />
              Sell product
            </Button>
          </div>
        </div>
      </section>

      <MarketplaceFilters categories={categoryRows} />

      <ListingsGrid
        initialListings={hydratedListings}
        initialPagination={result.pagination}
        initialFilters={filters}
        onLoadMore={loadMoreListings}
      />
    </Container>
  );
}
