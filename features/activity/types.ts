export type ActivityType = "listing_created" | "listing_sold" | "feedback_posted";

export type Feedback = {
  id: string;
  user_id: string;
  feedback_text: string;
  is_public: boolean;
  created_at: string;
  user?: {
    full_name: string | null;
    username: string;
    course: string | null;
    year: string | null;
  };
};

export type MarketplaceActivity = {
  id: string;
  user_id: string;
  listing_id: string | null;
  activity_type: ActivityType;
  created_at: string;
  user?: {
    full_name: string | null;
    username: string;
    course: string | null;
    year: string | null;
  };
  listing?: {
    id: string;
    title: string;
    status: string;
  };
};

export type ActivityItem = Feedback | MarketplaceActivity;

export function isFeedback(item: ActivityItem): item is Feedback {
  return "feedback_text" in item;
}

export function isMarketplaceActivity(item: ActivityItem): item is MarketplaceActivity {
  return "activity_type" in item;
}
