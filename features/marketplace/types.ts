import type {
  ContactPreference,
  ListingCategory,
  ListingCondition,
} from "@/features/marketplace/constants";

export type ListingStatus = "active" | "sold";

export type ListingImage = {
  id: string;
  listing_id: string;
  storage_path: string;
  sort_order: number;
  publicUrl: string;
};

export type ListingSeller = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
};

export type Listing = {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  category: ListingCategory;
  condition: ListingCondition;
  price: number;
  negotiable: boolean;
  location: string;
  contact_preference: ContactPreference;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
  sold_at: string | null;
  seller: ListingSeller | null;
  images: ListingImage[];
  isSaved?: boolean;
};

export type ListingFilters = {
  q?: string;
  category?: string;
  condition?: string;
  sort?: string;
};
