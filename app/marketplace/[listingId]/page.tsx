import { CalendarDays, Heart, MapPin, MessageCircle, ShieldCheck, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ListingCard } from "@/components/marketplace/listing-card";
import { ReportDialog } from "@/components/marketplace/report-dialog";
import { ShareButton } from "@/components/marketplace/share-button";
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
import { generateListingSchema, embedStructuredData, generateBreadcrumbSchema } from "@/lib/seo/structured-data";

type ListingDetailPageProps = {
  params: Promise<{
    listingId: string;
  }>;
  searchParams: Promise<{
    message?: string;
  }>;
};

export async function generateMetadata({ params }: ListingDetailPageProps): Promise<Metadata> {
  const { listingId } = await params;
  const supabase = await createClient();
  const listing = await getListingById(supabase, listingId);

  if (!listing) {
    return {
      title: "Listing Not Found | UniDrop",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://unidrop.app";
  const price = (listing.price / 100).toFixed(0);
  const description = listing.description?.substring(0, 155) || `${listing.title} for ₹${price} on UniDrop student marketplace`;
  const image = listing.images?.[0]?.publicUrl || `${baseUrl}/og-image.png`;

  // Map condition to schema format
  const conditionMap: Record<string, "NewCondition" | "RefurbishedCondition" | "UsedCondition"> = {
    new: "NewCondition",
    like_new: "RefurbishedCondition",
    good: "UsedCondition",
    fair: "UsedCondition",
    poor: "UsedCondition",
  };

  const listingSchema = generateListingSchema({
    title: listing.title,
    description: listing.description,
    price: listing.price,
    condition: conditionMap[listing.condition] || "UsedCondition",
    seller: {
      name: listing.seller?.full_name || listing.seller?.username,
    },
    image: listing.images?.map((img) => img.publicUrl),
    url: `${baseUrl}/marketplace/${listingId}`,
  });

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Marketplace", url: `${baseUrl}/marketplace` },
    { name: listing.category?.name || "Items" },
    { name: listing.title },
  ]);

  return {
    title: `${listing.title} - Buy on UniDrop | ₹${price}`,
    description,
    keywords: [
      listing.title,
      listing.category?.name || "items",
      "student marketplace",
      "buy on campus",
      "GBU marketplace",
    ],
    openGraph: {
      title: `${listing.title} - UniDrop Student Marketplace`,
      description,
      type: "website",
      url: `${baseUrl}/marketplace/${listingId}`,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: listing.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${listing.title} - ₹${price}`,
      description,
      images: [image],
    },
    other: {
      ...embedStructuredData(listingSchema).other,
      ...embedStructuredData(breadcrumbs).other,
    },
  };
}

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
          {/* Mobile swipeable gallery */}
          <div className="lg:hidden">
            <div className="-mx-4 px-4">
              <div className="snap-x snap-mandatory flex overflow-x-auto gap-3 touch-pan-x">
                {listing.images.map((image) => (
                  <div key={image.id} className="snap-center flex-shrink-0 w-[86vw] sm:w-[72vw] rounded-2xl overflow-hidden">
                    <Image
                      src={image.publicUrl}
                      alt={listing.title}
                      width={1200}
                      height={800}
                      className="w-full h-[62vw] object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop / large image */}
          <div className="hidden lg:block surface-elevated overflow-hidden">
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
            <div className="hidden lg:grid grid-cols-4 gap-3">
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
              <div className="flex gap-3">
                <form action={toggleSaveListing.bind(null, listing.id, isSaved)} className="flex-1">
                  <Button type="submit" variant="outline" size="lg" className="w-full">
                    <Heart className={cn("size-4", isSaved && "fill-rose-500 text-rose-500")} />
                    {isSaved ? "Saved" : "Save listing"}
                  </Button>
                </form>
                <ShareButton
                  listingId={listing.id}
                  title={listing.title}
                  price={listing.price}
                  variant="outline"
                  size="lg"
                  showLabel={false}
                />
              </div>

              <ReportDialog listingId={listing.id} listingTitle={listing.title} />
            </div>
          </Card>

          <Card className="p-6 sm:p-7">
            <Link
              href={listing.seller?.username ? `/u/${listing.seller.username}` : "#"}
              className="group block"
            >
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
                  <h2 className="font-display font-semibold group-hover:text-primary transition">
                    {listing.seller?.full_name || listing.seller?.username || "GBU Student"}
                  </h2>
                  {listing.seller?.course || listing.seller?.year ? (
                    <p className="text-xs text-muted-foreground">
                      {[listing.seller?.course, listing.seller?.year].filter(Boolean).join(" • ")}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Verified UniDrop seller</p>
                  )}
                </div>
              </div>
            </Link>
            <div className="mt-5 flex items-start gap-3 rounded-[1rem] border border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
              Only verified Gautam Buddha University students can access UniDrop.
            </div>
          </Card>
        </aside>
      </div>

      {/* Mobile sticky contact/purchase bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="glass-nav pb-safe-bottom px-4 py-3">
          <div className="mx-auto max-w-3xl flex items-center gap-3">
            <a
              className="flex-1 rounded-lg bg-green-500/90 px-4 py-3 text-center text-sm font-semibold text-white shadow-elevated"
              href={`https://wa.me/${listing.contact_whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
            >
              Contact seller
            </a>
            <ShareButton
              listingId={listing.id}
              title={listing.title}
              price={listing.price}
              variant="outline"
              size="md"
              showLabel={false}
            />
            <form action={toggleSaveListing.bind(null, listing.id, isSaved)}>
              <Button type="submit" variant="outline" size="md" className="whitespace-nowrap">
                <Heart className={cn("size-4", isSaved && "fill-rose-500 text-rose-500")} />
                {isSaved ? "Saved" : "Save"}
              </Button>
            </form>
          </div>
        </div>
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
