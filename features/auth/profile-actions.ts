"use server";

import type { ProfileUpdateData } from "@/features/auth/profile-types";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/features/auth/profile";

export async function getProfile(userId: string) {
  const { supabase, user } = await requireUser();

  if (user.id !== userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id,username,full_name,college_id,avatar_url,role,bio,course,year,hostel,linkedin_url,instagram_username")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Failed to fetch profile:", error.message || error);
    return null;
  }

  return data;
}

export async function getProfileByUsername(username: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id,username,full_name,bio,course,year,hostel,linkedin_url,instagram_username,college_id,created_at")
    .eq("username", username)
    .eq("public_profile", true)
    .single();

  if (error) {
    console.error("Failed to fetch public profile:", error);
    return null;
  }

  return data;
}

export async function getSellerProfile(sellerId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id,username,full_name,bio,course,year")
    .eq("id", sellerId)
    .single();

  if (error) {
    console.error("Failed to fetch seller profile:", error);
    return null;
  }

  return data;
}

export async function updateProfile(_userId: string, updates: ProfileUpdateData) {
  const { supabase, user } = await requireUser();
  const allowedUpdates: ProfileUpdateData = {
    full_name: updates.full_name,
    username: updates.username,
    bio: updates.bio,
    course: updates.course,
    year: updates.year,
    hostel: updates.hostel,
    linkedin_url: updates.linkedin_url,
    instagram_username: updates.instagram_username,
  };

  Object.keys(allowedUpdates).forEach((key) => {
    if (allowedUpdates[key as keyof ProfileUpdateData] === undefined) {
      delete allowedUpdates[key as keyof ProfileUpdateData];
    }
  });

  // Validate username uniqueness if being updated
  if (allowedUpdates.username) {
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", allowedUpdates.username)
      .neq("id", user.id)
      .single();

    if (existing) {
      return {
        error: "Username is already taken",
        success: false,
      };
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      ...allowedUpdates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Failed to update profile:", error);
    return {
      error: "Failed to update profile",
      success: false,
    };
  }

  return {
    success: true,
    error: null,
  };
}
