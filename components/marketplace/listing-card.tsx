"use client";

import { Heart, MapPin, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { formatListingConditionLabel } from "@/features/marketplace/constants";
import { toggleSaveListing } from "@/features/marketplace/actions";
import { formatPostedTime, formatPrice } from "@/features/marketplace/format";
import type { Listing } from "@/features/marketplace/types";
import { cn } from "@/lib/utils";

type ListingCardProps = {
  listing: Listing;
  compact?: boolean;
  showSeller?: boolean;
};

export const ListingCard = memo(function ListingCard({
  listing,
  compact = false,
  showSeller = true,
}: ListingCardProps) {
  const [isSaved, setIsSaved] = useState(listing.isSaved);
  const [isPending, startTransition] = useTransition();

  const coverImage = listing.images[0]?.publicUrl;
  const sellerName = listing.seller?.full_name || listing.seller?.username || "GBU Student";

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update
    setIsSaved(!isSaved);

    // Call server action in transition
    startTransition(async () => {
      await toggleSaveListing(listing.id, !isSaved);
    });
  };

  return (
    <article className="group overflow-hidden rounded-[1.25rem] border border-border/70 bg-card/88 shadow-soft transition-colors duration-200 hover:border-border/90 hover:shadow-elevated touch-target">
      <Link href={`/marketplace/${listing.id}`} className="block">
        <div className="relative overflow-hidden bg-muted/70">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={listing.title}
              width={900}
              height={650}
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className={cn(
                "aspect-[16/9] w-full object-cover transition-opacity duration-200 md:group-hover:opacity-95",
                compact ? "aspect-[4/3]" : "",
              )}
            />
          ) : (
            <div className={cn("flex aspect-[4/3] w-full items-center justify-center bg-muted/70", compact && "aspect-[4/3]")}>
              <Tag className="size-10 text-muted-foreground" />
            </div>
          )}
          <div className="absolute left-4 top-4 flex gap-2">
            <Badge className="bg-background/88 text-foreground shadow-soft">{formatListingConditionLabel(listing.condition)}</Badge>
            <Badge variant="soft">{formatPostedTime(listing.created_at)}</Badge>
          </div>
          {/* Price overlay */}
          <div className="absolute left-4 bottom-4 rounded-2xl bg-background/88 px-3 py-2 text-lg font-semibold shadow-soft">
            {formatPrice(listing.price)}
          </div>
          {/* Save button overlay */}
          <div className="absolute right-4 top-4">
            <button
              onClick={handleSaveClick}
              disabled={isPending}
              aria-label={isSaved ? "Unsave" : "Save"}
              className={cn("touch-target tap-highlight transition-opacity", isPending && "opacity-60")}
            >
              <Heart className={cn("size-5 transition-colors", isSaved && "fill-rose-500 text-rose-500", !isSaved && "text-white")} />
            </button>
          </div>
          {listing.status === "sold" ? (
            <div className="absolute inset-0 grid place-items-center bg-background/65">
              <Badge className="px-4 py-2 text-sm">Sold</Badge>
            </div>
          ) : null}
        </div>
      </Link>

      <div className="space-y-3 p-4 sm:p-5">
        <Link href={`/marketplace/${listing.id}`} className="min-w-0 block">
          <h3 className="line-clamp-2 font-display text-base font-semibold tracking-tight">
            {listing.title}
          </h3>
        </Link>
        {showSeller && listing.seller ? (
          <Link href={`/u/${listing.seller.username}`} className="block min-w-0 hover:opacity-80 transition">
            <p className="text-sm font-medium text-foreground truncate">
              {sellerName}
            </p>
            {listing.seller.course || listing.seller.year ? (
              <p className="text-xs text-muted-foreground truncate">
                {[listing.seller.course, listing.seller.year].filter(Boolean).join(" • ")}
              </p>
            ) : null}
          </Link>
        ) : null}
        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">{listing.location_text}</span>
          </span>
          <span className="shrink-0 text-xs">{listing.category?.name ?? listing.category_id}</span>
        </div>
      </div>
    </article>
  );
});

ListingCard.displayName = "ListingCard";
