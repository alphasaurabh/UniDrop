"use server";

import type { SupabaseLike } from "@/features/auth/profile";
import type { Feedback, MarketplaceActivity } from "./types";

export async function getPublicFeedbacks(
  supabase: SupabaseLike,
  limit: number = 10
): Promise<Feedback[]> {
  const { data, error } = await supabase
    .from("feedbacks")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  return error ? [] : ((data ?? []) as Feedback[]);
}

export async function getMarketplaceActivity(
  supabase: SupabaseLike,
  limit: number = 10
): Promise<MarketplaceActivity[]> {
  const { data, error } = await supabase
    .from("marketplace_activity")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  return error ? [] : ((data ?? []) as MarketplaceActivity[]);
}

export async function getActivityFeed(
  supabase: SupabaseLike,
  limit: number = 15
): Promise<(Feedback | MarketplaceActivity)[]> {
  const [feedbacks, activities] = await Promise.all([
    getPublicFeedbacks(supabase, Math.ceil(limit * 0.4)),
    getMarketplaceActivity(supabase, Math.ceil(limit * 0.6)),
  ]);

  const combined = [...feedbacks, ...activities].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA;
  });

  return combined.slice(0, limit);
}

export async function getUserFeedbacks(
  supabase: SupabaseLike,
  userId: string
): Promise<Feedback[]> {
  const { data, error } = await supabase
    .from("feedbacks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return error ? [] : ((data ?? []) as Feedback[]);
}
