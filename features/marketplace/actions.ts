"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  LISTING_CONDITIONS,
  LISTING_IMAGE_BUCKET,
  formatListingConditionLabel,
  isListingCondition,
} from "@/features/marketplace/constants";
import { ensureUserProfile, type SupabaseClientLike } from "@/features/auth/profile";
import { createActivityEntry } from "@/features/activity/actions";
import { createClient } from "@/lib/supabase/server";

type ValidListingInput = {
  title: string;
  description: string;
  category_id: string;
  condition: string;
  price: number;
  is_negotiable: boolean;
  location_text: string;
  contact_whatsapp: string;
};

type UploadedListingImageInput = {
  image_url: string;
  display_order: number;
};

type ListingValidationResult =
  | { status: "success"; data: ValidListingInput }
  | { status: "error"; message: string };

function getString(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function parsePrice(value: string) {
  const price = Number(value);
  return Number.isFinite(price) ? Math.round(price) : Number.NaN;
}

function parseUploadedImages(formData: FormData) {
  const rawValue = getString(formData, "uploaded_images");

  if (!rawValue) {
    return [] as UploadedListingImageInput[];
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (!Array.isArray(parsed)) {
      return [] as UploadedListingImageInput[];
    }

    return parsed
      .map((item) => ({
        image_url:
          typeof item === "object" && item !== null && "image_url" in item
            ? String((item as { image_url?: unknown }).image_url ?? "")
            : "",
        display_order:
          typeof item === "object" && item !== null && "display_order" in item
            ? Number((item as { display_order?: unknown }).display_order ?? 0)
            : 0,
      }))
      .filter((item) => Boolean(item.image_url));
  } catch {
    return [] as UploadedListingImageInput[];
  }
}

function getStoragePathFromPublicUrl(imageUrl: string) {
  try {
    const url = new URL(imageUrl);
    const marker = `/storage/v1/object/public/${LISTING_IMAGE_BUCKET}/`;
    const index = url.pathname.indexOf(marker);

    if (index === -1) {
      return null;
    }

    return decodeURIComponent(url.pathname.slice(index + marker.length));
  } catch {
    return null;
  }
}

async function cleanupUploadedImages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  images: UploadedListingImageInput[],
) {
  const paths = images
    .map((image) => getStoragePathFromPublicUrl(image.image_url))
    .filter((path): path is string => Boolean(path));

  if (paths.length > 0) {
    await supabase.storage.from(LISTING_IMAGE_BUCKET).remove(paths);
  }
}

function isValidWhatsapp(value: string) {
  const normalized = value.replace(/[\s()-]/g, "");
  return /^\+?[0-9]{8,15}$/.test(normalized);
}

function normalizeWhatsapp(value: string) {
  return value.replace(/[\s()-]/g, "");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 48);
}

function randomDigits() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function createUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  title: string,
) {
  const base = slugify(title) || "listing";

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const candidate = `${base}-${randomDigits()}`;
    const { data, error } = await supabase
      .from("listings")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return candidate;
    }
  }

  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

function encodeMessage(message: string) {
  return encodeURIComponent(message);
}

async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const user = data.user;

  console.log("[UniDrop][marketplace] auth.getUser()", {
    userId: user?.id ?? null,
    email: user?.email ?? null,
    error: error?.message ?? null,
  });

  if (error) {
    throw new Error(`UniDrop could not read the authenticated session: ${error.message}`);
  }

  if (!user) {
    throw new Error("UniDrop could not read the authenticated session: no user was returned.");
  }

  return { supabase, user };
}

async function requireListingContext() {
  const { supabase, user } = await requireUser();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id,college_id,username,full_name,avatar_url,role")
    .eq("id", user.id)
    .maybeSingle();

  console.log("[UniDrop][marketplace] profiles lookup", {
    userId: user.id,
    profileId: profile?.id ?? null,
    profile,
    error: error?.message ?? null,
    collegeId: profile?.college_id ?? null,
  });

  if (error) {
    throw new Error(`UniDrop could not verify your campus profile: ${error.message}`);
  }

  if (profile?.college_id) {
    return { supabase, user, profileId: profile.id, collegeId: profile.college_id };
  }

  try {
    const result = await ensureUserProfile(supabase as unknown as SupabaseClientLike, user);
    console.log("[UniDrop][marketplace] ensureUserProfile()", {
      userId: user.id,
      collegeId: result.collegeId,
      username: result.username,
    });
    return { supabase, user, profileId: user.id, collegeId: result.collegeId };
  } catch (ensureError) {
    console.error("[UniDrop][marketplace] ensureUserProfile() failed", {
      userId: user.id,
      error:
        ensureError instanceof Error
          ? { message: ensureError.message, stack: ensureError.stack }
          : ensureError,
    });

    throw ensureError instanceof Error
      ? ensureError
      : new Error("UniDrop could not verify your campus profile.");
  }
}

function validateListing(
  formData: FormData,
  uploadedImages: UploadedListingImageInput[],
  requireImage: boolean,
): ListingValidationResult {
  const title = getString(formData, "title");
  const description = getString(formData, "description");
  const categoryId = getString(formData, "category_id");
  const condition = getString(formData, "condition");
  const price = parsePrice(getString(formData, "price"));
  const locationText = getString(formData, "location_text");
  const contactWhatsapp = normalizeWhatsapp(getString(formData, "contact_whatsapp"));
  const isNegotiable = formData.get("is_negotiable") === "on";

  if (title.length < 4) {
    return { status: "error", message: "Use a clear product title with at least 4 characters." };
  }

  if (title.length > 120) {
    return { status: "error", message: "Keep the title within 120 characters." };
  }

  if (description.length < 20) {
    return { status: "error", message: "Add a description with at least 20 characters." };
  }

  if (description.length > 5000) {
    return { status: "error", message: "Keep the description within 5,000 characters." };
  }

  if (!categoryId) {
    return { status: "error", message: "Choose a category." };
  }

  if (!isListingCondition(condition)) {
    return {
      status: "error",
      message: `Choose one of: ${LISTING_CONDITIONS.map(formatListingConditionLabel).join(", ")}.`,
    };
  }

  if (!Number.isFinite(price) || price < 0) {
    return { status: "error", message: "Enter a valid price." };
  }

  if (locationText.length < 2) {
    return { status: "error", message: "Add your hostel or pickup location." };
  }

  if (locationText.length > 120) {
    return { status: "error", message: "Keep the location within 120 characters." };
  }

  if (!isValidWhatsapp(contactWhatsapp)) {
    return { status: "error", message: "Enter a valid WhatsApp number with country code." };
  }

  if (requireImage && uploadedImages.length === 0) {
    return { status: "error", message: "Upload at least one product image." };
  }

  if (uploadedImages.length > 8) {
    return { status: "error", message: "Upload up to 8 images." };
  }

  return {
    status: "success",
    data: {
      title,
      description,
      category_id: categoryId,
      condition,
      price,
      is_negotiable: isNegotiable,
      location_text: locationText,
      contact_whatsapp: contactWhatsapp,
    },
  };
}

export async function createListing(formData: FormData) {
  const { supabase, user, profileId, collegeId } = await requireListingContext();
  const uploadedImages = parseUploadedImages(formData);
  const validation = validateListing(formData, uploadedImages, true);

  if (validation.status === "error") {
    await cleanupUploadedImages(supabase, uploadedImages);
    redirect(`/sell?error=${encodeMessage(validation.message)}`);
  }

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("id", validation.data.category_id)
    .maybeSingle();

  if (categoryError || !category) {
    await cleanupUploadedImages(supabase, uploadedImages);
    redirect(`/sell?error=${encodeMessage("Choose a valid category.")}`);
  }

  const slug = await createUniqueSlug(supabase, validation.data.title);
  const listingInsertPayload = {
    seller_id: profileId,
    college_id: collegeId,
    category_id: validation.data.category_id,
    slug,
    title: validation.data.title,
    description: validation.data.description,
    price: validation.data.price,
    condition: validation.data.condition,
    is_negotiable: validation.data.is_negotiable,
    status: "active",
    location_text: validation.data.location_text,
    contact_whatsapp: validation.data.contact_whatsapp,
    views_count: 0,
  };

  console.log("[UniDrop][marketplace] createListing insert payload", {
    authUserId: user.id,
    profileId,
    collegeId,
    listingInsertPayload,
  });

  const { data: listing, error } = await supabase
    .from("listings")
    .insert(listingInsertPayload)
    .select("id")
    .single();

  if (error || !listing) {
    console.error("[UniDrop][marketplace] createListing insert error", {
      authUserId: user.id,
      profileId,
      collegeId,
      error: error?.message ?? null,
      listingInsertPayload,
    });
    await cleanupUploadedImages(supabase, uploadedImages);
    redirect(`/sell?error=${encodeMessage(error?.message ?? "UniDrop could not publish your listing.")}`);
  }

  const { error: imageError } = await supabase.from("listing_images").insert(
    uploadedImages.map((image) => ({
      listing_id: listing.id,
      image_url: image.image_url,
      display_order: image.display_order,
    })),
  );

  if (imageError) {
    await supabase.from("listings").delete().eq("id", listing.id).eq("seller_id", user.id);
    await cleanupUploadedImages(supabase, uploadedImages);
    redirect(`/sell?error=${encodeMessage(imageError.message)}`);
  }

  // Create activity entry for new listing
  await createActivityEntry(supabase, user.id, listing.id, "listing_created");

  revalidatePath("/marketplace");
  revalidatePath("/account");
  redirect(`/marketplace/${listing.id}?message=${encodeMessage("Listing published successfully.")}`);
}

export async function updateListing(listingId: string, formData: FormData) {
  const { supabase, user } = await requireUser();
  const uploadedImages = parseUploadedImages(formData);
  const validation = validateListing(formData, uploadedImages, false);

  if (validation.status === "error") {
    await cleanupUploadedImages(supabase, uploadedImages);
    redirect(`/account/listings/${listingId}/edit?error=${encodeMessage(validation.message)}`);
  }

  const { data: existing, error: existingError } = await supabase
    .from("listings")
    .select("id,seller_id")
    .eq("id", listingId)
    .eq("seller_id", user.id)
    .maybeSingle();

  if (existingError || !existing) {
    await cleanupUploadedImages(supabase, uploadedImages);
    redirect("/account?error=Listing not found.");
  }

  const removedImageIds = getString(formData, "removedImageIds")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const { data: currentImages, error: currentImagesError } = await supabase
    .from("listing_images")
    .select("id,image_url,display_order")
    .eq("listing_id", listingId)
    .order("display_order", { ascending: true });

  if (currentImagesError) {
    await cleanupUploadedImages(supabase, uploadedImages);
    redirect(`/account/listings/${listingId}/edit?error=${encodeMessage(currentImagesError.message)}`);
  }

  const remainingImages = (currentImages ?? []).filter((image) => !removedImageIds.includes(image.id));
  const finalImageCount = remainingImages.length + uploadedImages.length;

  if (finalImageCount === 0) {
    await cleanupUploadedImages(supabase, uploadedImages);
    redirect(`/account/listings/${listingId}/edit?error=${encodeMessage("Keep at least one product image.")}`);
  }

  const { error } = await supabase
    .from("listings")
    .update({
      title: validation.data.title,
      description: validation.data.description,
      category_id: validation.data.category_id,
      condition: validation.data.condition,
      price: validation.data.price,
      is_negotiable: validation.data.is_negotiable,
      location_text: validation.data.location_text,
      contact_whatsapp: validation.data.contact_whatsapp,
    })
    .eq("id", listingId)
    .eq("seller_id", user.id);

  if (error) {
    await cleanupUploadedImages(supabase, uploadedImages);
    redirect(`/account/listings/${listingId}/edit?error=${encodeMessage(error.message)}`);
  }

  const { error: insertError } = await supabase.from("listing_images").insert(
    uploadedImages.map((image, index) => ({
      listing_id: listingId,
      image_url: image.image_url,
      display_order: remainingImages.length + index,
    })),
  );

  if (insertError) {
    await cleanupUploadedImages(supabase, uploadedImages);
    redirect(`/account/listings/${listingId}/edit?error=${encodeMessage(insertError.message)}`);
  }

  if (removedImageIds.length > 0) {
    const { data: removedImages } = await supabase
      .from("listing_images")
      .select("id,image_url")
      .eq("listing_id", listingId)
      .in("id", removedImageIds);

    await supabase.from("listing_images").delete().eq("listing_id", listingId).in("id", removedImageIds);

    const paths = (removedImages ?? [])
      .map((image: { image_url: string }) => getStoragePathFromPublicUrl(image.image_url))
      .filter((path): path is string => Boolean(path));

    if (paths.length > 0) {
      await supabase.storage.from(LISTING_IMAGE_BUCKET).remove(paths);
    }
  }

  revalidatePath("/marketplace");
  revalidatePath(`/marketplace/${listingId}`);
  revalidatePath("/account");
  redirect(`/marketplace/${listingId}?message=${encodeMessage("Listing updated.")}`);
}

export async function deleteListing(listingId: string) {
  const { supabase, user } = await requireUser();
  const { data: images } = await supabase
    .from("listing_images")
    .select("image_url")
    .eq("listing_id", listingId);

  const paths = (images ?? [])
    .map((image: { image_url: string }) => getStoragePathFromPublicUrl(image.image_url))
    .filter((path): path is string => Boolean(path));

  if (paths.length > 0) {
    await supabase.storage.from(LISTING_IMAGE_BUCKET).remove(paths);
  }

  await supabase.from("listings").delete().eq("id", listingId).eq("seller_id", user.id);

  revalidatePath("/marketplace");
  revalidatePath("/account");
  redirect("/account?message=Listing deleted.");
}

export async function markListingSold(listingId: string) {
  const { supabase, user } = await requireUser();

  await supabase
    .from("listings")
    .update({
      status: "sold",
    })
    .eq("id", listingId)
    .eq("seller_id", user.id);

  // Create activity entry for sold listing
  await createActivityEntry(supabase, user.id, listingId, "listing_sold");

  revalidatePath("/marketplace");
  revalidatePath(`/marketplace/${listingId}`);
  revalidatePath("/account");
  redirect("/account?message=Listing marked as sold.");
}

export async function toggleSaveListing(listingId: string, isSaved: boolean) {
  const { supabase, user } = await requireUser();

  if (isSaved) {
    await supabase
      .from("saved_listings")
      .delete()
      .eq("listing_id", listingId)
      .eq("user_id", user.id);
  } else {
    await supabase
      .from("saved_listings")
      .insert({
        listing_id: listingId,
        user_id: user.id,
      });
  }

  revalidatePath("/marketplace");
  revalidatePath(`/marketplace/${listingId}`);
  revalidatePath("/saved");
}

export async function loadMoreListings(filters: {
  q?: string;
  category?: string;
  condition?: string;
  sort?: string;
  page?: number;
}) {
  const supabase = await createClient();
  const { getListings } = await import("@/features/marketplace/queries");
  const { getSavedListingIds } = await import("@/features/marketplace/queries");

  const [result, savedIds] = await Promise.all([
    getListings(supabase, filters),
    getSavedListingIds(supabase),
  ]);

  const hydratedListings = result.listings.map((listing) => ({
    ...listing,
    isSaved: savedIds.has(listing.id),
  }));

  return {
    listings: hydratedListings,
    pagination: result.pagination,
  };
}