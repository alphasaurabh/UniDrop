import type { User } from "@supabase/supabase-js";

import {
  ACTIVE_COLLEGE_LOOKUP_ERROR_MESSAGE,
  approvedColleges,
  findActiveCollegeForEmail,
  getEmailDomain,
  type ActiveCollege,
  type CollegeLookupClient,
} from "@/features/auth/colleges";

type ProfileWriteClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => PromiseLike<{
          data: { id: string } | null;
          error: { message: string } | null;
        }>;
      };
    };
    upsert: (
      values: Record<string, unknown>,
      options?: { onConflict?: string },
    ) => {
      select: (columns: string) => {
        single: () => PromiseLike<{
          data: unknown;
          error: { message: string } | null;
        }>;
      };
    };
  };
};

export type SupabaseClientLike = CollegeLookupClient & ProfileWriteClient;

function slugifyUsername(value: string) {
  return value
    .toLowerCase()
    .replace(/@.*/, "")
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 24);
}

function getUserFullName(user: User) {
  const metadataName =
    typeof user.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata.name === "string"
        ? user.user_metadata.name
        : "";

  return metadataName || user.email?.split("@")[0] || "CampusLoop Student";
}

export async function getApprovedCollege(
  supabase: SupabaseClientLike,
  email: string,
  collegeName = approvedColleges[0].name,
) {
  const college = await findActiveCollegeForEmail(supabase, email, collegeName);

  if (!college?.id) {
    throw new Error(ACTIVE_COLLEGE_LOOKUP_ERROR_MESSAGE);
  }

  return college;
}

export async function ensureUserProfile(supabase: SupabaseClientLike, user: User) {
  if (!user.email) {
    throw new Error("Only verified Gautam Buddha University email accounts are allowed.");
  }

  const college: ActiveCollege = await getApprovedCollege(supabase, user.email);
  const email = user.email;
  const baseUsername = slugifyUsername(
    typeof user.user_metadata.username === "string" ? user.user_metadata.username : email,
  );
  const username = `${baseUsername || "student"}_${user.id.slice(0, 8)}`;
  const avatarUrl =
    typeof user.user_metadata.avatar_url === "string" ? user.user_metadata.avatar_url : null;

  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        username,
        full_name: getUserFullName(user),
        college_id: college.id,
        avatar_url: avatarUrl,
        role: "user",
      },
      { onConflict: "id" },
    )
    .select("id")
    .single();

  if (error) {
    throw new Error(`CampusLoop could not create your profile: ${error.message}`);
  }

  return {
    username,
    collegeId: college.id,
    emailDomain: getEmailDomain(email),
  };
}
