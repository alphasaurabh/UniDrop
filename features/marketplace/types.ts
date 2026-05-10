import type {
  ListingCondition,
} from "@/features/marketplace/constants";

export type ListingStatus = "active" | "sold";

export type ListingImage = {
  id: string;
  listing_id: string;
  storage_path: string;
  display_order: number;
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
  category_id: string;
  category?: {
    id: string;
    name: string;
  } | null;
  condition: ListingCondition;
  price: number;
  negotiable?: boolean;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
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
