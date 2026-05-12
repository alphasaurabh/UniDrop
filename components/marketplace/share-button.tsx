"use client";

import { Share2 } from "lucide-react";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

type ShareButtonProps = {
  listingId: string;
  title: string;
  price: number;
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
};

export function ShareButton({
  listingId,
  title,
  price,
  variant = "default",
  size = "md",
  showLabel = true,
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const { addToast } = useToast();

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://unidrop.app";
  const listingUrl = `${baseUrl}/marketplace/${listingId}`;

  // Format price as INR
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

  // Share content
  const shareData = {
    title: "UniDrop Listing",
    text: `Check out this listing on UniDrop:\n${title} — ${formattedPrice}\n\n${listingUrl}`,
    url: listingUrl,
  };

  const handleShare = async () => {
    setIsSharing(true);

    try {
      // Check if Web Share API is available and supported
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        addToast("Shared successfully!", "success", 2000);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `${title} — ${formattedPrice}\n\n${listingUrl}`
        );
        addToast("Link copied to clipboard!", "success", 3000);
      }
    } catch (error) {
      // User cancelled share or clipboard error
      if ((error as Error).name !== "AbortError") {
        console.error("Share error:", error);
        addToast("Unable to share. Try copying the link.", "error", 3000);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-5 py-3 text-base gap-2",
  };

  const iconSize = {
    sm: "size-3.5",
    md: "size-4",
    lg: "size-5",
  };

  const variantClasses = {
    default: "bg-primary/90 text-primary-foreground hover:bg-primary shadow-soft backdrop-blur-sm",
    outline: "border border-border/70 bg-card/80 text-foreground hover:bg-card/90 shadow-soft backdrop-blur-sm",
  };

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "active:scale-95",
        sizeClasses[size],
        variantClasses[variant],
      )}
      aria-label={showLabel ? undefined : "Share listing"}
    >
      <Share2 className={cn("shrink-0", iconSize[size], isSharing && "animate-pulse")} />
      {showLabel && (
        <span className="font-semibold">
          {isSharing ? "Sharing..." : "Share"}
        </span>
      )}
    </button>
  );
}
