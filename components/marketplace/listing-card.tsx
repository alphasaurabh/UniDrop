"use client";

import { Heart, MapPin, Tag } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export function ListingCard({
  listing,
  compact = false,
  showSeller = true,
}: ListingCardProps) {
  const coverImage = listing.images[0]?.publicUrl;
  const sellerName = listing.seller?.full_name || listing.seller?.username || "GBU Student";

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className="group overflow-hidden rounded-[1.25rem] border border-border/70 bg-card/80 shadow-soft backdrop-blur-xl"
    >
      <Link href={`/marketplace/${listing.id}`} className="block">
        <div className="relative overflow-hidden bg-muted/70">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={listing.title}
              width={900}
              height={650}
              className={cn(
                "aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105",
                compact && "aspect-[4/3]",
              )}
            />
          ) : (
            <div className={cn("flex aspect-[4/3] w-full items-center justify-center bg-muted/70", compact && "aspect-[4/3]") }>
              <Tag className="size-10 text-muted-foreground" />
            </div>
          )}
          <div className="absolute left-4 top-4 flex gap-2">
            <Badge className="bg-background/80 text-foreground shadow-soft backdrop-blur-xl">{formatListingConditionLabel(listing.condition)}</Badge>
            <Badge variant="soft">{formatPostedTime(listing.created_at)}</Badge>
          </div>
          {listing.status === "sold" ? (
            <div className="absolute inset-0 grid place-items-center bg-background/55 backdrop-blur-md">
              <Badge className="px-4 py-2 text-sm">Sold</Badge>
            </div>
          ) : null}
        </div>
      </Link>

      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <Link href={`/marketplace/${listing.id}`} className="min-w-0">
            <h3 className="line-clamp-1 font-display text-lg font-semibold tracking-tight">
              {listing.title}
            </h3>
            {showSeller ? (
              <p className="mt-1 text-sm text-muted-foreground">by {sellerName}</p>
            ) : null}
          </Link>
          <p className="shrink-0 text-lg font-semibold text-foreground">
            {formatPrice(listing.price)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">{listing.location_text}</span>
          </span>
          <span className="shrink-0">{listing.category?.name ?? listing.category_id}</span>
        </div>
        <form action={toggleSaveListing.bind(null, listing.id, Boolean(listing.isSaved))}>
          <Button type="submit" variant="outline" size="sm" className="w-full">
            <Heart
              className={cn(
                "size-4",
                listing.isSaved && "fill-rose-500 text-rose-500",
              )}
            />
            {listing.isSaved ? "Saved" : "Save"}
          </Button>
        </form>
      </div>
    </motion.article>
  );
}
