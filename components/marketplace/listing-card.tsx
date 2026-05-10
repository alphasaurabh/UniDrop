"use client";

import { Heart, MapPin, Tag } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const sellerName = listing.seller?.username ?? "GBU student";

  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="group overflow-hidden rounded-3xl border bg-card shadow-soft"
    >
      <Link href={`/marketplace/${listing.id}`} className="block">
        <div className="relative overflow-hidden bg-muted">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={listing.title}
              width={900}
              height={650}
              className={cn(
                "h-64 w-full object-cover transition duration-500 group-hover:scale-105",
                compact && "h-48",
              )}
            />
          ) : (
            <div className={cn("flex h-64 w-full items-center justify-center bg-muted", compact && "h-48")}>
              <Tag className="size-10 text-muted-foreground" />
            </div>
          )}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <Badge>{listing.condition}</Badge>
            <Badge variant="soft">{formatPostedTime(listing.created_at)}</Badge>
          </div>
          {listing.status === "sold" ? (
            <div className="absolute inset-0 grid place-items-center bg-white/70 backdrop-blur-sm">
              <Badge>Sold</Badge>
            </div>
          ) : null}
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <Link href={`/marketplace/${listing.id}`} className="min-w-0">
            <h3 className="line-clamp-1 text-base font-semibold tracking-tight">
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
            <span className="truncate">Campus pickup</span>
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
