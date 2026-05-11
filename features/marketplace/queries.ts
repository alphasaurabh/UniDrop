import type { SupabaseClient } from "@supabase/supabase-js";

import type { Listing, ListingFilters, ListingImage, ListingSeller, PaginationMeta } from "@/features/marketplace/types";
import { PAGINATION_LIMIT } from "@/features/marketplace/constants";

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
  college_id,
  category_id,
  slug,
  title,
  description,
  condition,
  price,
  is_negotiable,
  status,
  location_text,
  contact_whatsapp,
  views_count,
  created_at,
  updated_at,
  seller:profiles!listings_seller_id_fkey(
    id,
    username,
    full_name,
    avatar_url,
    course,
    year
  ),
  category:categories!listings_category_id_fkey(
    id,
    name
  ),
  images:listing_images(
    id,
    listing_id,
    image_url,
    display_order
  )
`;

function getSeller(seller: RawListing["seller"]) {
  return Array.isArray(seller) ? seller[0] ?? null : seller;
}

function getCategory(category: RawListing["category"]) {
  return Array.isArray(category) ? category[0] ?? null : category;
}

function withPublicImageUrls(supabase: SupabaseLike, listing: RawListing): Listing {
  const images = listing.images ?? [];

  return {
    ...listing,
    seller: getSeller(listing.seller),
    category: getCategory(listing.category),
    images: images
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((image) => {
        return {
          ...image,
          display_order: image.display_order ?? 0,
          publicUrl: image.image_url,
        };
      }),
  };
}

export async function getListings(
  supabase: SupabaseLike,
  filters: ListingFilters = {},
): Promise<{ listings: Listing[]; pagination: PaginationMeta }> {
  const page = Math.max(1, filters.page ?? 1);
  const limit = PAGINATION_LIMIT;
  const offset = (page - 1) * limit;

  const isUuid = (value: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

  let categoryIdFilter: string | null = null;

  if (filters.category && filters.category !== "all") {
    if (isUuid(filters.category)) {
      categoryIdFilter = filters.category;
    } else {
      const { data: categoryRow, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("name", filters.category)
        .maybeSingle();

      if (categoryError) {
        throw new Error(categoryError.message);
      }

      if (!categoryRow?.id) {
        return {
          listings: [],
          pagination: {
            page,
            limit,
            total: 0,
            hasMore: false,
          },
        };
      }

      categoryIdFilter = categoryRow.id;
    }
  }

  let countQuery = supabase.from("listings").select("id", { count: "exact" }).eq("status", "active");
  let dataQuery = supabase
    .from("listings")
    .select(listingSelect)
    .eq("status", "active");

  // Apply filters to both queries
  if (filters.q) {
    const search = filters.q.replace(/[%_,]/g, "");
    const orFilter = `title.ilike.%${search}%,description.ilike.%${search}%,location_text.ilike.%${search}%`;
    countQuery = countQuery.or(orFilter);
    dataQuery = dataQuery.or(orFilter);
  }

  if (categoryIdFilter) {
    countQuery = countQuery.eq("category_id", categoryIdFilter);
    dataQuery = dataQuery.eq("category_id", categoryIdFilter);
  }

  if (filters.condition && filters.condition !== "all") {
    countQuery = countQuery.eq("condition", filters.condition);
    dataQuery = dataQuery.eq("condition", filters.condition);
  }

  // Apply sorting
  if (filters.sort === "price-low") {
    dataQuery = dataQuery.order("price", { ascending: true });
  } else if (filters.sort === "price-high") {
    dataQuery = dataQuery.order("price", { ascending: false });
  } else {
    dataQuery = dataQuery.order("created_at", { ascending: false });
  }

  // Add pagination
  dataQuery = dataQuery.range(offset, offset + limit - 1);

  const [countResult, dataResult] = await Promise.all([countQuery, dataQuery]);

  if (countResult.error) {
    throw new Error(countResult.error.message);
  }

  if (dataResult.error) {
    throw new Error(dataResult.error.message);
  }

  const total = countResult.count ?? 0;
  const listings = ((dataResult.data ?? []) as unknown as RawListing[]).map((listing) =>
    withPublicImageUrls(supabase, listing),
  );

  return {
    listings,
    pagination: {
      page,
      limit,
      total,
      hasMore: offset + limit < total,
    },
  };
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

export async function getListingsBySellerUsername(
  supabase: SupabaseLike,
  sellerId: string,
): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select(listingSelect)
    .eq("seller_id", sellerId)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as unknown as RawListing[]).map((listing) =>
    withPublicImageUrls(supabase, listing),
  );
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
    .eq("category_id", listing.category_id)
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
