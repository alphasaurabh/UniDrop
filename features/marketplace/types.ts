import type {
  ListingCondition,
} from "@/features/marketplace/constants";

export type ListingStatus = "active" | "sold";

export type ListingImage = {
  id: string;
  listing_id: string;
  image_url: string;
  display_order: number;
  publicUrl: string;
};

export type ListingSeller = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  course?: string | null;
  year?: string | null;
};

export type Listing = {
  id: string;
  seller_id: string;
  college_id: string;
  category_id: string;
  slug: string;
  title: string;
  description: string;
  category?: {
    id: string;
    name: string;
  } | null;
  condition: ListingCondition;
  price: number;
  is_negotiable: boolean;
  status: ListingStatus;
  location_text: string;
  contact_whatsapp: string;
  views_count: number;
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
  page?: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};
