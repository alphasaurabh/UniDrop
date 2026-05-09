import type { SupabaseClient } from "@supabase/supabase-js";

import { LISTING_IMAGE_BUCKET } from "@/features/marketplace/constants";
import type { Listing, ListingFilters, ListingImage, ListingSeller } from "@/features/marketplace/types";

type SupabaseLike = SupabaseClient;

type RawListingImage = Omit<ListingImage, "publicUrl">;

type RawListing = Omit<Listing, "images" | "seller"> & {
  images: RawListingImage[] | null;
  seller: ListingSeller | ListingSeller[] | null;
};

type SavedListingRow = {
  listing: RawListing | null;
};

type SavedIdRow = {
  listing_id: string;
};

const listingSelect = `
  id,
  seller_id,
  title,
  description,
  category,
  condition,
  price,
  negotiable,
  location,
  contact_preference,
  status,
  created_at,
  updated_at,
  sold_at,
  seller:profiles!listings_seller_id_fkey(
    id,
    username,
    full_name,
    avatar_url
  ),
  images:listing_images(
    id,
    listing_id,
    storage_path,
    sort_order
  )
`;

function getSeller(seller: RawListing["seller"]) {
  return Array.isArray(seller) ? seller[0] ?? null : seller;
}

function withPublicImageUrls(supabase: SupabaseLike, listing: RawListing): Listing {
  const images = listing.images ?? [];

  return {
    ...listing,
    seller: getSeller(listing.seller),
    images: images
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((image) => ({
        ...image,
        publicUrl: supabase.storage
          .from(LISTING_IMAGE_BUCKET)
          .getPublicUrl(image.storage_path).data.publicUrl,
      })),
  };
}

export async function getListings(
  supabase: SupabaseLike,
  filters: ListingFilters = {},
): Promise<Listing[]> {
  let query = supabase
    .from("listings")
    .select(listingSelect)
    .eq("status", "active");

  if (filters.q) {
    const search = filters.q.replace(/[%_,]/g, "");
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`);
  }

  if (filters.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }

  if (filters.condition && filters.condition !== "all") {
    query = query.eq("condition", filters.condition);
  }

  if (filters.sort === "price-low") {
    query = query.order("price", { ascending: true });
  } else if (filters.sort === "price-high") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as unknown as RawListing[]).map((listing) =>
    withPublicImageUrls(supabase, listing),
  );
}

export async function getListingById(
  supabase: SupabaseLike,
  listingId: string,
): Promise<Listing | null> {
  const { data, error } = await supabase
    .from("listings")
    .select(listingSelect)
    .eq("id", listingId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? withPublicImageUrls(supabase, data as unknown as RawListing) : null;
}

export async function getMyListings(supabase: SupabaseLike): Promise<Listing[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("listings")
    .select(listingSelect)
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as unknown as RawListing[]).map((listing) =>
    withPublicImageUrls(supabase, listing),
  );
}

export async function getSavedListings(supabase: SupabaseLike): Promise<Listing[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("saved_listings")
    .select(`listing:listings(${listingSelect})`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as unknown as SavedListingRow[])
    .map((row) => row.listing)
    .filter((listing): listing is RawListing => Boolean(listing))
    .map((listing) => ({ ...withPublicImageUrls(supabase, listing), isSaved: true }));
}

export async function getSavedListingIds(supabase: SupabaseLike) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Set<string>();
  }

  const { data, error } = await supabase
    .from("saved_listings")
    .select("listing_id")
    .eq("user_id", user.id);

  if (error) {
    return new Set<string>();
  }

  return new Set(((data ?? []) as unknown as SavedIdRow[]).map((row) => row.listing_id));
}

export async function getRelatedListings(
  supabase: SupabaseLike,
  listing: Listing,
  limit = 3,
): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select(listingSelect)
    .eq("status", "active")
    .eq("category", listing.category)
    .neq("id", listing.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return [];
  }

  return ((data ?? []) as unknown as RawListing[]).map((item) =>
    withPublicImageUrls(supabase, item),
  );
}
