"use client";

import { BadgeCheck, Heart, MapPin, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { formatListingConditionLabel } from "@/features/marketplace/constants";
import { toggleSaveListing } from "@/features/marketplace/actions";
import { formatPrice } from "@/features/marketplace/format";
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
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-elevated">
      <Link href={`/marketplace/${listing.id}`} className="block">
        <div className="relative overflow-hidden bg-muted">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={listing.title}
              width={900}
              height={650}
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className={cn(
                "aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105",
                compact ? "aspect-[4/3]" : "",
              )}
            />
          ) : (
            <div className={cn("flex aspect-[4/3] w-full items-center justify-center bg-muted/70", compact && "aspect-[4/3]")}>
              <Tag className="size-10 text-muted-foreground" />
            </div>
          )}
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge className="border-0 bg-card/95 text-foreground shadow-soft">{formatListingConditionLabel(listing.condition)}</Badge>
          </div>
          {/* Price overlay */}
          <div className="absolute bottom-3 left-3 rounded-lg bg-foreground px-3 py-1.5 text-base font-bold text-background shadow-soft">{formatPrice(listing.price)}</div>
          {/* Save button overlay */}
          <div className="absolute right-4 top-4">
            <button
              onClick={handleSaveClick}
              disabled={isPending}
              aria-label={isSaved ? "Unsave" : "Save"}
              className={cn("grid size-9 place-items-center rounded-full bg-card/95 shadow-soft transition hover:scale-105", isPending && "opacity-60")}
            >
              <Heart className={cn("size-4 transition-colors", isSaved && "fill-primary text-primary", !isSaved && "text-foreground")} />
            </button>
          </div>
          {listing.status === "sold" ? (
            <div className="absolute inset-0 grid place-items-center bg-background/65">
              <Badge className="px-4 py-2 text-sm">Sold</Badge>
            </div>
          ) : null}
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <Link href={`/marketplace/${listing.id}`} className="min-w-0 block">
          <h3 className="line-clamp-2 font-display text-[15px] font-bold leading-5 tracking-tight">
            {listing.title}
          </h3>
        </Link>
        {showSeller && listing.seller ? (
          <Link href={`/u/${listing.seller.username}`} className="block min-w-0 hover:opacity-80 transition">
            <p className="flex items-center gap-1 text-xs font-semibold text-foreground truncate">
              {sellerName}
              <BadgeCheck className="size-3.5 shrink-0 text-accent" />
            </p>
            {listing.seller.course || listing.seller.year ? (
              <p className="text-xs text-muted-foreground truncate">
                {[listing.seller.course, listing.seller.year].filter(Boolean).join(" · ")}
              </p>
            ) : null}
          </Link>
        ) : null}
        <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-3 text-xs text-muted-foreground">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0 text-primary" />
            <span className="truncate">{listing.location_text}</span>
          </span>
          <span className="shrink-0 text-xs">{listing.category?.name ?? listing.category_id}</span>
        </div>
      </div>
    </article>
  );
});

ListingCard.displayName = "ListingCard";
