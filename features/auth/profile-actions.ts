"use server";

import type { ProfileUpdateData } from "@/features/auth/profile-types";
import { createClient } from "@/lib/supabase/server";

export async function getProfile(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id,username,full_name,college_id,avatar_url,bio,course,year,hostel,linkedin_url,instagram_username")
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
    .select("id,username,full_name,bio,course,year,college_id")
    .eq("id", sellerId)
    .single();

  if (error) {
    console.error("Failed to fetch seller profile:", error);
    return null;
  }

  return data;
}

export async function updateProfile(userId: string, updates: ProfileUpdateData) {
  const supabase = await createClient();

  // Validate username uniqueness if being updated
  if (updates.username) {
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", updates.username)
      .neq("id", userId)
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
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

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
