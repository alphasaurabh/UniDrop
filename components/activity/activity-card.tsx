"use client";

import { MessageCircle, Plus, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/features/activity/format";
import type { Feedback, MarketplaceActivity, ActivityItem } from "@/features/activity/types";

type ActivityCardProps = {
  item: ActivityItem;
  compact?: boolean;
};

export function ActivityCard({ item, compact = false }: ActivityCardProps) {
  const isFeedback = "feedback_text" in item;

  if (isFeedback) {
    return <FeedbackCard feedback={item as Feedback} compact={compact} />;
  } else {
    return (
      <ActivityEventCard activity={item as MarketplaceActivity} compact={compact} />
    );
  }
}

function FeedbackCard({ feedback, compact }: { feedback: Feedback; compact: boolean }) {
  const userName =
    feedback.user?.full_name || feedback.user?.username || "Student";
  const userDetail = feedback.user?.course
    ? `${feedback.user.course}${feedback.user.year ? " • " + feedback.user.year : ""}`
    : undefined;

  return (
    <div className={cn(
      "rounded-[1.25rem] border border-border/70 bg-card/80 shadow-soft backdrop-blur-xl transition hover:shadow-elevated",
      compact ? "p-4 sm:p-5" : "p-6 sm:p-7"
    )}>
      <p className={cn(
        "leading-relaxed text-foreground/90",
        compact ? "text-sm" : "text-base"
      )}>
        "{feedback.feedback_text}"
      </p>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <p className={cn(
            "font-semibold text-foreground",
            compact ? "text-sm" : "text-base"
          )}>
            {userName}
          </p>
          {userDetail && (
            <p className="text-xs text-muted-foreground">{userDetail}</p>
          )}
        </div>
        <p className="text-xs text-muted-foreground shrink-0">
          {formatRelativeTime(feedback.created_at)}
        </p>
      </div>
    </div>
  );
}

function ActivityEventCard({
  activity,
  compact,
}: {
  activity: MarketplaceActivity;
  compact: boolean;
}) {
  const userName =
    activity.user?.full_name || activity.user?.username || "Student";
  const listingTitle = activity.listing?.title || "a listing";

  let icon = Plus;
  let title = "";
  let description = "";

  switch (activity.activity_type) {
    case "listing_created":
      icon = Plus;
      title = listingTitle ? `${userName} listed "${listingTitle}" for sale` : `${userName} posted a new listing`;
      description = "New listing";
      break;
    case "listing_sold":
      icon = CheckCircle;
      title = listingTitle ? `${userName} sold "${listingTitle}" successfully` : `${userName} completed a sale`;
      description = "Item sold";
      break;
    case "feedback_posted":
      icon = MessageCircle;
      title = `${userName} shared feedback about UniDrop`;
      description = "Feedback";
      break;
  }

  return (
    <div className={cn(
      "rounded-[1.25rem] border border-border/70 bg-card/80 shadow-soft backdrop-blur-xl transition hover:shadow-elevated",
      compact ? "p-4 sm:p-5" : "p-6 sm:p-7"
    )}>
      <div className="flex gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon && <icon className="size-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn(
            "font-semibold text-foreground line-clamp-2",
            compact ? "text-sm" : "text-base"
          )}>
            {title}
          </p>
          <div className="mt-2 flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">{description}</p>
            <p className="text-xs text-muted-foreground shrink-0">
              {formatRelativeTime(activity.created_at)}
            </p>
          </div>
        </div>
      </div>

      {activity.listing_id && activity.activity_type === "listing_created" && (
        <Link
          href={`/marketplace/${activity.listing_id}`}
          className="mt-3 inline-flex text-xs font-medium text-primary hover:underline"
        >
          View listing →
        </Link>
      )}
    </div>
  );
}
