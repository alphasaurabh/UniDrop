import { Edit3, Package, Plus, Trash2 } from "lucide-react";
import type { Metadata } from "next";

import { ListingCard } from "@/components/marketplace/listing-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import {
  deleteListing,
  markListingSold,
} from "@/features/marketplace/actions";
import { getMyListings } from "@/features/marketplace/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Manage Listings - UniDrop Account",
  description: "View and manage your UniDrop listings. Edit, delete, or mark items as sold.",
  robots: {
    index: false,
    follow: false,
  },
};

type AccountPageProps = {
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const listings = await getMyListings(supabase);
  const activeCount = listings.filter((listing) => listing.status === "active").length;
  const soldCount = listings.filter((listing) => listing.status === "sold").length;

  return (
    <Container className="pb-24 pt-8 lg:pb-12">
      {params.message ? (
        <p className="mb-6 surface-panel px-4 py-3 text-sm text-primary">
          {params.message}
        </p>
      ) : null}
      {params.error ? (
        <p className="mb-6 surface-panel px-4 py-3 text-sm text-destructive">
          {params.error}
        </p>
      ) : null}

      <section className="mb-8 border-b border-border pb-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Badge variant="soft" className="border-0 bg-primary/10 px-4 py-2 text-primary">Your selling space</Badge>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">Manage your listings.</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Edit products, mark items as sold, or remove listings that are no longer available.
            </p>
          </div>
          <Button asChild href="/sell" size="lg">
            <Plus className="size-4" />
            New listing
          </Button>
        </div>

        <div className="mt-8 grid gap-4 border-y border-border py-5 md:grid-cols-3 md:divide-x md:divide-border">
          <div className="px-1 md:px-5">
            <Package className="size-5 text-primary" />
            <p className="mt-5 font-display text-3xl font-bold tracking-tight">{listings.length}</p>
            <p className="text-sm text-muted-foreground">Total listings</p>
          </div>
          <div className="px-1 md:px-5">
            <Package className="size-5 text-primary" />
            <p className="mt-5 font-display text-3xl font-bold tracking-tight">{activeCount}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
          <div className="px-1 md:px-5">
            <Package className="size-5 text-primary" />
            <p className="mt-5 font-display text-3xl font-bold tracking-tight">{soldCount}</p>
            <p className="text-sm text-muted-foreground">Sold</p>
          </div>
        </div>
      </section>

      {listings.length === 0 ? (
        <EmptyState
          icon={<Package className="size-6" />}
          title="No listings yet"
          description="Create your first listing to populate the seller dashboard and start tracking activity."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <div key={listing.id} className="space-y-3">
              <ListingCard listing={listing} showSeller={false} />
              <div className="grid grid-cols-3 gap-2">
                <Button asChild href={`/account/listings/${listing.id}/edit`} variant="outline" size="sm">
                  <Edit3 className="size-4" />
                  Edit
                </Button>
                <form action={markListingSold.bind(null, listing.id)}>
                  <Button type="submit" variant="outline" size="sm" className="w-full" disabled={listing.status === "sold"}>
                    Sold
                  </Button>
                </form>
                <form action={deleteListing.bind(null, listing.id)}>
                  <Button type="submit" variant="outline" size="sm" className="w-full text-destructive">
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
