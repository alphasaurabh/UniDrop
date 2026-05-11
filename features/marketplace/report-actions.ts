"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ensureUserProfile } from "@/features/auth/profile";
import { isReportReason } from "@/features/marketplace/constants";
import type { CreateReportInput } from "@/features/marketplace/report-types";

type SupabaseLike = SupabaseClient;

type ReportResult = {
  status: "success" | "error" | "duplicate";
  message: string;
};

async function validateReportInput(
  input: unknown,
): Promise<
  | { status: "success"; data: CreateReportInput }
  | { status: "error"; message: string }
> {
  // Type guard for input
  if (typeof input !== "object" || input === null) {
    return { status: "error", message: "Invalid input" };
  }

  const data = input as Record<string, unknown>;

  // Validate listing_id
  const listing_id = String(data.listing_id ?? "").trim();
  if (!listing_id || listing_id.length === 0) {
    return { status: "error", message: "Listing ID is required" };
  }

  // Validate reason
  const reason = String(data.reason ?? "").trim().toLowerCase();
  if (!isReportReason(reason)) {
    return { status: "error", message: "Invalid report reason" };
  }

  // Validate description (optional, but validate if provided)
  const description = String(data.description ?? "").trim();
  if (description && description.length > 1000) {
    return { status: "error", message: "Description must be less than 1000 characters" };
  }

  return {
    status: "success",
    data: {
      listing_id,
      reason,
      description: description || undefined,
    },
  };
}

async function requireUser(): Promise<{ supabase: SupabaseLike; user: { id: string } }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  return { supabase, user: { id: user.id } };
}

async function checkIfListingExists(
  supabase: SupabaseLike,
  listingId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("listings")
    .select("id")
    .eq("id", listingId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return !!data;
}

async function checkDuplicateReport(
  supabase: SupabaseLike,
  listingId: string,
  userId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("reports")
    .select("id")
    .eq("listing_id", listingId)
    .eq("reporter_id", userId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "not found" error, which is expected
    throw new Error(error.message);
  }

  return !!data;
}

export async function reportListing(
  _prevState: unknown,
  formData: FormData,
): Promise<ReportResult> {
  try {
    const { supabase, user } = await requireUser();

    // Parse and validate input
    const listing_id = String(formData.get("listing_id") ?? "").trim();
    const reason = String(formData.get("reason") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    const validation = await validateReportInput({
      listing_id,
      reason,
      description: description || undefined,
    });

    if (validation.status !== "success") {
      return {
        status: "error",
        message: validation.message,
      };
    }

    // Check if listing exists
    const listingExists = await checkIfListingExists(supabase, validation.data.listing_id);
    if (!listingExists) {
      return {
        status: "error",
        message: "Listing not found",
      };
    }

    // Check for duplicate report
    const isDuplicate = await checkDuplicateReport(
      supabase,
      validation.data.listing_id,
      user.id,
    );
    if (isDuplicate) {
      return {
        status: "duplicate",
        message: "You have already reported this listing",
      };
    }

    // Create report
    const { error: insertError } = await supabase
      .from("reports")
      .insert({
        listing_id: validation.data.listing_id,
        reporter_id: user.id,
        reason: validation.data.reason,
        description: validation.data.description || null,
        status: "pending",
      });

    if (insertError) {
      // Check if it's a unique constraint violation (duplicate)
      if (insertError.code === "23505") {
        return {
          status: "duplicate",
          message: "You have already reported this listing",
        };
      }
      throw insertError;
    }

    return {
      status: "success",
      message: "Thank you for reporting. Our team will review your report shortly.",
    };
  } catch (error) {
    console.error("Report listing error:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to submit report",
    };
  }
}
