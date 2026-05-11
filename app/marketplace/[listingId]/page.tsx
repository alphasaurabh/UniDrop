import { CalendarDays, Heart, MapPin, MessageCircle, ShieldCheck, Tag } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ListingCard } from "@/components/marketplace/listing-card";
import { ReportDialog } from "@/components/marketplace/report-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { toggleSaveListing } from "@/features/marketplace/actions";
import { formatPostedTime, formatPrice } from "@/features/marketplace/format";
import {
  getListingById,
  getRelatedListings,
  getSavedListingIds,
} from "@/features/marketplace/queries";
import { formatListingConditionLabel } from "@/features/marketplace/constants";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

type ListingDetailPageProps = {
  params: Promise<{
    listingId: string;
  }>;
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function ListingDetailPage({
  params,
  searchParams,
}: ListingDetailPageProps) {
  const [{ listingId }, pageParams] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const listing = await getListingById(supabase, listingId);

  if (!listing) {
    notFound();
  }

  const [relatedListings, savedIds] = await Promise.all([
    getRelatedListings(supabase, listing),
    getSavedListingIds(supabase),
  ]);
  const isSaved = savedIds.has(listing.id);
  const coverImage = listing.images[0]?.publicUrl;

  return (
    <Container className="py-8">
      {pageParams.message ? (
        <p className="mb-6 surface-panel px-4 py-3 text-sm text-primary">
          {pageParams.message}
        </p>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-5">
          <div className="surface-elevated overflow-hidden">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={listing.title}
                width={1300}
                height={900}
                priority
                className="max-h-[680px] w-full object-cover"
              />
            ) : (
              <div className="grid aspect-[4/3] place-items-center bg-muted/60">
                <Tag className="size-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {listing.images.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {listing.images.slice(1, 5).map((image) => (
                <Image
                  key={image.id}
                  src={image.publicUrl}
                  alt={listing.title}
                  width={320}
                  height={240}
                  className="aspect-square rounded-[1rem] border border-border/70 object-cover shadow-soft"
                />
              ))}
            </div>
          ) : null}

          <Card className="p-6 sm:p-7">
            <h2 className="font-display text-xl font-semibold tracking-tight">Description</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-[15px]">
              {listing.description}
            </p>
          </Card>
        </section>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <Card className="p-6 sm:p-7">
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge>{formatListingConditionLabel(listing.condition)}</Badge>
              <Badge variant="soft">{listing.category?.name ?? listing.category_id}</Badge>
              {listing.is_negotiable ? <Badge variant="soft">Negotiable</Badge> : null}
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight">{listing.title}</h1>
            <p className="mt-4 text-4xl font-semibold tracking-tight">{formatPrice(listing.price)}</p>

            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                {listing.location_text}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="size-4 text-primary" />
                Posted {formatPostedTime(listing.created_at)}
              </p>
              <a
                className="flex items-center gap-2 text-primary hover:underline"
                href={`https://wa.me/${listing.contact_whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="size-4" />
                WhatsApp {listing.contact_whatsapp}
              </a>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <form action={toggleSaveListing.bind(null, listing.id, isSaved)} className="w-full">
                <Button type="submit" variant="outline" size="lg" className="w-full">
                  <Heart className={cn("size-4", isSaved && "fill-rose-500 text-rose-500")} />
                  {isSaved ? "Saved" : "Save listing"}
                </Button>
              </form>

              <ReportDialog listingId={listing.id} listingTitle={listing.title} />
            </div>
          </Card>

          <Card className="p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft">
                {(() => {
                  const name = listing.seller?.full_name || listing.seller?.username;
                  if (!name) return "G";
                  const parts = name.trim().split(/\s+/);
                  return parts.length > 1 
                    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
                    : name.slice(0, 1).toUpperCase();
                })()}
              </div>
              <div>
                <h2 className="font-display font-semibold">{listing.seller?.full_name || listing.seller?.username || "GBU Student"}</h2>
                <p className="text-sm text-muted-foreground">Verified CampusLoop seller</p>
              </div>
            </div>
            <div className="mt-5 flex items-start gap-3 rounded-[1rem] border border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
              Only verified Gautam Buddha University students can access this marketplace.
            </div>
          </Card>
        </aside>
      </div>

      {relatedListings.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Related listings</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedListings.map((related) => (
              <ListingCard
                key={related.id}
                listing={{
                  ...related,
                  isSaved: savedIds.has(related.id),
                }}
              />
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}
