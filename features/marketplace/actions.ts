"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  LISTING_CONDITIONS,
  LISTING_IMAGE_BUCKET,
  isListingCondition,
} from "@/features/marketplace/constants";
import { createClient } from "@/lib/supabase/server";

type ValidListingInput = {
  title: string;
  description: string;
  category: string; // holds category_id (UUID) from existing schema
  condition: string;
  price: number;
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

function getImages(formData: FormData) {
  return formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);
}

function encodeMessage(message: string) {
  return encodeURIComponent(message);
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/sell");
  }

  return { supabase, user };
}

function validateListing(
  formData: FormData,
  images: File[],
  requireImage: boolean,
): ListingValidationResult {
  const title = getString(formData, "title");
  const description = getString(formData, "description");
  const category = getString(formData, "category");
  const condition = getString(formData, "condition");
  const price = parsePrice(getString(formData, "price"));
  if (title.length < 4) {
    return { status: "error", message: "Use a clear product title with at least 4 characters." };
  }

  if (description.length < 20) {
    return { status: "error", message: "Add a description with at least 20 characters." };
  }

  if (!category) {
    return { status: "error", message: "Choose a category." };
  }

  if (!isListingCondition(condition)) {
    return { status: "error", message: `Choose one of: ${LISTING_CONDITIONS.join(", ")}.` };
  }

  if (!Number.isFinite(price) || price < 0) {
    return { status: "error", message: "Enter a valid price." };
  }

  if (requireImage && images.length === 0) {
    return { status: "error", message: "Upload at least one product image." };
  }

  if (images.length > 8) {
    return { status: "error", message: "Upload up to 8 images." };
  }

  const oversizedImage = images.find((image) => image.size > 5 * 1024 * 1024);

  if (oversizedImage) {
    return { status: "error", message: `${oversizedImage.name} is larger than 5 MB.` };
  }

  return {
    status: "success",
    data: {
      title,
      description,
      category,
      condition,
      price,
    },
  };
}

async function uploadListingImages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  listingId: string,
  userId: string,
  images: File[],
  startOrder = 0,
) {
  const rows = [];

  for (const [index, image] of images.entries()) {
    const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${userId}/${listingId}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage
      .from(LISTING_IMAGE_BUCKET)
      .upload(path, image, {
        contentType: image.type || "image/jpeg",
        upsert: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    rows.push({
      listing_id: listingId,
      storage_path: path,
      display_order: startOrder + index,
    });
  }

  if (rows.length === 0) {
    return;
  }

  const { error } = await supabase.from("listing_images").insert(rows);

  if (error) {
    throw new Error(error.message);
  }
}

export async function createListing(formData: FormData) {
  const { supabase, user } = await requireUser();
  const images = getImages(formData);
  const validation = validateListing(formData, images, true);

  if (validation.status === "error") {
    redirect(`/sell?error=${encodeMessage(validation.message)}`);
  }

  const { data: listing, error } = await supabase
    .from("listings")
    .insert({
      title: validation.data.title,
      description: validation.data.description,
      category_id: validation.data.category,
      condition: validation.data.condition,
      price: validation.data.price,
      seller_id: user.id,
      status: "active",
    })
    .select("id")
    .single();

  if (error || !listing) {
    redirect(`/sell?error=${encodeMessage(error?.message ?? "CampusLoop could not publish your listing.")}`);
  }

  try {
    await uploadListingImages(supabase, listing.id, user.id, images);
  } catch (uploadError) {
    await supabase.from("listings").delete().eq("id", listing.id).eq("seller_id", user.id);
    redirect(
      `/sell?error=${encodeMessage(
        uploadError instanceof Error ? uploadError.message : "CampusLoop could not upload your images.",
      )}`,
    );
  }

  revalidatePath("/marketplace");
  revalidatePath("/account");
  redirect(`/marketplace/${listing.id}?message=${encodeMessage("Listing published successfully.")}`);
}

export async function updateListing(listingId: string, formData: FormData) {
  const { supabase, user } = await requireUser();
  const images = getImages(formData);
  const validation = validateListing(formData, images, false);

  if (validation.status === "error") {
    redirect(`/account/listings/${listingId}/edit?error=${encodeMessage(validation.message)}`);
  }
  const listingInput = validation.data;

  const { data: existing, error: existingError } = await supabase
    .from("listings")
    .select("id,seller_id")
    .eq("id", listingId)
    .eq("seller_id", user.id)
    .maybeSingle();

  if (existingError || !existing) {
    redirect("/account?error=Listing not found.");
  }

  const removedImageIds = getString(formData, "removedImageIds")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (removedImageIds.length > 0) {
    const { data: removedImages } = await supabase
      .from("listing_images")
      .select("id,storage_path")
      .eq("listing_id", listingId)
      .in("id", removedImageIds);

    const paths = (removedImages ?? []).map((image: { storage_path: string }) => image.storage_path);

    if (paths.length > 0) {
      await supabase.storage.from(LISTING_IMAGE_BUCKET).remove(paths);
    }

    await supabase.from("listing_images").delete().eq("listing_id", listingId).in("id", removedImageIds);
  }

  const { error } = await supabase
    .from("listings")
    .update({
      title: listingInput.title,
      description: listingInput.description,
      category_id: listingInput.category,
      condition: listingInput.condition,
      price: listingInput.price,
    })
    .eq("id", listingId)
    .eq("seller_id", user.id);

  if (error) {
    redirect(`/account/listings/${listingId}/edit?error=${encodeMessage(error.message)}`);
  }

  const { count } = await supabase
    .from("listing_images")
    .select("id", { count: "exact", head: true })
    .eq("listing_id", listingId);

  if ((count ?? 0) + images.length === 0) {
    redirect(`/account/listings/${listingId}/edit?error=${encodeMessage("Keep at least one product image.")}`);
  }

  try {
    await uploadListingImages(supabase, listingId, user.id, images, count ?? 0);
  } catch (uploadError) {
    redirect(
      `/account/listings/${listingId}/edit?error=${encodeMessage(
        uploadError instanceof Error ? uploadError.message : "CampusLoop could not upload your images.",
      )}`,
    );
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
    .select("storage_path")
    .eq("listing_id", listingId);
  const paths = (images ?? []).map((image: { storage_path: string }) => image.storage_path);

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
