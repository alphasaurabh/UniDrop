import { Edit3, Package, Plus, Trash2 } from "lucide-react";

import { ListingCard } from "@/components/marketplace/listing-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  deleteListing,
  markListingSold,
} from "@/features/marketplace/actions";
import { getMyListings } from "@/features/marketplace/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Account",
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
    <Container className="py-8">
      {params.message ? (
        <p className="mb-6 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
          {params.message}
        </p>
      ) : null}
      {params.error ? (
        <p className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {params.error}
        </p>
      ) : null}

      <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <Badge variant="soft">Seller dashboard</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Manage your listings.</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Edit products, mark items as sold, or remove listings that are no longer available.
          </p>
        </div>
        <Button asChild href="/sell" size="lg">
          <Plus className="size-4" />
          New listing
        </Button>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <Package className="size-5 text-primary" />
          <p className="mt-5 text-3xl font-semibold">{listings.length}</p>
          <p className="text-sm text-muted-foreground">Total listings</p>
        </Card>
        <Card className="p-5">
          <Package className="size-5 text-primary" />
          <p className="mt-5 text-3xl font-semibold">{activeCount}</p>
          <p className="text-sm text-muted-foreground">Active</p>
        </Card>
        <Card className="p-5">
          <Package className="size-5 text-primary" />
          <p className="mt-5 text-3xl font-semibold">{soldCount}</p>
          <p className="text-sm text-muted-foreground">Sold</p>
        </Card>
      </div>

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
    </Container>
  );
}
