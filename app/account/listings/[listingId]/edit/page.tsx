import { notFound, redirect } from "next/navigation";

import { ListingForm } from "@/components/marketplace/listing-form";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { updateListing } from "@/features/marketplace/actions";
import { getListingById } from "@/features/marketplace/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Edit listing",
};

type EditListingPageProps = {
  params: Promise<{
    listingId: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditListingPage({
  params,
  searchParams,
}: EditListingPageProps) {
  const [{ listingId }, pageParams] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const [
    listing,
    {
      data: { user },
    },
  ] = await Promise.all([getListingById(supabase, listingId), supabase.auth.getUser()]);

  if (!listing) {
    notFound();
  }

  if (!user || listing.seller_id !== user.id) {
    redirect("/account?error=You can only edit your own listings.");
  }

  return (
    <Container className="py-8">
      <div className="mb-8">
        <Badge variant="soft">Edit listing</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Update your product.</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Refresh photos, price, condition, and campus pickup details.
        </p>
      </div>

      <ListingForm
        action={updateListing.bind(null, listing.id)}
        listing={listing}
        error={pageParams.error}
      />
    </Container>
  );
}
