"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/features/auth/profile";
import { createClient } from "@/lib/supabase/server";
import type { ActivityType } from "./types";

// Feedback Actions

export async function submitFeedback(formData: FormData) {
  const { supabase, user } = await requireUser();

  const feedbackText = String(formData.get("feedback_text") ?? "").trim();
  const isPublic = String(formData.get("is_public") ?? "true") === "true";

  if (!feedbackText || feedbackText.length < 10) {
    return {
      status: "error",
      message: "Feedback must be at least 10 characters long",
    };
  }

  if (feedbackText.length > 500) {
    return {
      status: "error",
      message: "Feedback must be less than 500 characters",
    };
  }

  const { error: feedbackError } = await supabase.from("feedbacks").insert({
    user_id: user.id,
    feedback_text: feedbackText,
    is_public: isPublic,
  });

  if (feedbackError) {
    return {
      status: "error",
      message: feedbackError.message,
    };
  }

  // Create activity entry if feedback is public
  if (isPublic) {
    await createActivityEntry(supabase, user.id, null, "feedback_posted");
  }

  revalidatePath("/");
  revalidatePath("/account");

  return {
    status: "success",
    message: "Thank you for your feedback!",
  };
}

export async function deleteFeedback(feedbackId: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("feedbacks")
    .delete()
    .eq("id", feedbackId)
    .eq("user_id", user.id);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidatePath("/");
  revalidatePath("/account");

  return {
    status: "success",
    message: "Feedback deleted",
  };
}

export async function updateFeedbackVisibility(
  feedbackId: string,
  isPublic: boolean
) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("feedbacks")
    .update({ is_public: isPublic })
    .eq("id", feedbackId)
    .eq("user_id", user.id);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidatePath("/");
  revalidatePath("/account");

  return {
    status: "success",
    message: "Feedback visibility updated",
  };
}

// Activity Actions

export async function createActivityEntry(
  supabase: any,
  userId: string,
  listingId: string | null,
  activityType: ActivityType
) {
  try {
    const { error } = await supabase.from("marketplace_activity").insert({
      user_id: userId,
      listing_id: listingId,
      activity_type: activityType,
    });

    if (error) {
      console.error("Error creating activity entry:", error);
    }

    revalidatePath("/");
  } catch (error) {
    console.error("Error in createActivityEntry:", error);
  }
}
