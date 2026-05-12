import { Plus } from "lucide-react";
import type { Metadata } from "next";

import { ListingsGrid } from "@/components/marketplace/listings-grid";
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getListings, getSavedListingIds } from "@/features/marketplace/queries";
import { loadMoreListings } from "@/features/marketplace/actions";
import { createClient } from "@/lib/supabase/server";
import { generateBreadcrumbSchema, embedStructuredData } from "@/lib/seo/structured-data";

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

export async function generateMetadata({ searchParams }: MarketplacePageProps): Promise<Metadata> {
  const params = await searchParams;
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://unidrop.app";

  // Get total count of listings
  const { count } = await supabase
    .from("listings")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  const searchQuery = params.q || "";
  const categoryFilter = params.category || "";
  const totalListings = count || 0;

  // Generate dynamic title and description based on filters
  let title = "Marketplace - Buy & Sell on UniDrop";
  let description =
    `Browse ${totalListings} verified listings from students on UniDrop. Find laptops, books, furniture, and more at your campus marketplace.`;

  if (categoryFilter) {
    title = `${categoryFilter} for Sale - UniDrop Student Marketplace`;
    description = `Browse ${totalListings} ${categoryFilter.toLowerCase()} listings on UniDrop. Buy affordable ${categoryFilter.toLowerCase()} from verified campus students.`;
  }

  if (searchQuery) {
    title = `${searchQuery} - Search Results on UniDrop Marketplace`;
    description = `Search results for "${searchQuery}" on UniDrop student marketplace. Find verified items from campus students.`;
  }

  if (categoryFilter && searchQuery) {
    title = `${searchQuery} in ${categoryFilter} - UniDrop Marketplace`;
    description = `${searchQuery} in ${categoryFilter} - Buy from verified campus students on UniDrop.`;
  }

  const url = new URL("/marketplace", baseUrl);
  if (searchQuery) url.searchParams.set("q", searchQuery);
  if (categoryFilter) url.searchParams.set("category", categoryFilter);

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Marketplace" },
  ]);

  return {
    title,
    description,
    keywords: [
      "marketplace",
      "buy and sell",
      "student marketplace",
      "campus marketplace",
      "college trading",
      categoryFilter || "items",
      searchQuery || "listings",
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: "website",
      url: url.toString(),
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    other: {
      ...embedStructuredData(breadcrumbs).other,
    },
  };
}


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
