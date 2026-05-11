"use client";

import { PackageSearch } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ListingCard } from "@/components/marketplace/listing-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { Listing, PaginationMeta } from "@/features/marketplace/types";
import type { ListingFilters } from "@/features/marketplace/types";

type ListingsGridProps = {
  initialListings: Listing[];
  initialPagination: PaginationMeta;
  initialFilters: ListingFilters;
  onLoadMore: (filters: ListingFilters) => Promise<{ listings: Listing[]; pagination: PaginationMeta }>;
};

export function ListingsGrid({
  initialListings,
  initialPagination,
  initialFilters,
  onLoadMore,
}: ListingsGridProps) {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState(initialListings);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset listings when search params change (filters/sort)
  useEffect(() => {
    // If page param is not in search params, we're on page 1
    if (!searchParams.get("page")) {
      setListings(initialListings);
      setPagination(initialPagination);
      setError(null);
    }
  }, [searchParams, initialListings, initialPagination]);

  const handleLoadMore = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const nextFilters = {
        ...initialFilters,
        page: pagination.page + 1,
      };

      const result = await onLoadMore(nextFilters);
      setListings((prev) => [...prev, ...result.listings]);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more listings");
    } finally {
      setIsLoading(false);
    }
  }, [initialFilters, pagination.page, onLoadMore]);

  const isEmpty = listings.length === 0 && pagination.page === 1;

  return (
    <div className="space-y-8">
      {error ? (
        <div className="surface-panel border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {isEmpty ? (
        <EmptyState
          icon={<PackageSearch className="size-8" />}
          title="No listings found"
          description="Try a different search or category, or be the first to publish a product."
        />
      ) : (
        <>
          {/* Listing count badge */}
          {pagination.total > 0 ? (
            <div className="flex items-center gap-2">
              <Badge variant="soft">
                Showing {listings.length} of {pagination.total} listings
              </Badge>
            </div>
          ) : null}

          {/* Grid */}
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}

            {/* Loading skeletons */}
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="overflow-hidden rounded-[1.25rem] border border-border/70 bg-card/80 shadow-soft backdrop-blur-xl"
                >
                  <Skeleton className="h-56 w-full rounded-none sm:h-64" />
                  <div className="space-y-4 p-5">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              ))}
          </div>

          {/* Load more button */}
          {pagination.hasMore && !isLoading && (
            <div className="flex justify-center pt-8">
              <Button
                onClick={handleLoadMore}
                disabled={isLoading}
                variant="outline"
                size="lg"
              >
                Load more listings ({listings.length}/{pagination.total})
              </Button>
            </div>
          )}

          {/* End of results message */}
          {!pagination.hasMore && listings.length > 0 && (
            <div className="flex justify-center pt-8">
              <p className="text-sm text-muted-foreground">
                You&apos;ve reached the end. Showing all {pagination.total} listings.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
