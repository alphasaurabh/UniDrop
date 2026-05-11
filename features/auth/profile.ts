import type { User } from "@supabase/supabase-js";

import {
  ACTIVE_COLLEGE_LOOKUP_ERROR_MESSAGE,
  approvedColleges,
  findActiveCollegeForEmail,
  getEmailDomain,
  type ActiveCollege,
  type CollegeLookupClient,
} from "@/features/auth/colleges";
import { createAdminClient } from "@/lib/supabase/admin";

type AdminProfileWriteClient = {
  from: (table: string) => {
    upsert: (
      values: Record<string, unknown>,
      options?: { onConflict?: string },
    ) => PromiseLike<{
      data: unknown;
      error: { message: string } | null;
    }>;
  };
};

type ProfileRow = {
  id: string;
  username: string | null;
  full_name: string | null;
  college_id: string | null;
  avatar_url: string | null;
  role: string | null;
};

type ProfileWriteClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => PromiseLike<{
          data: ProfileRow | null;
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

type ProfileUpsertClient = {
  from: (table: string) => {
    upsert: (
      values: Record<string, unknown>,
      options?: { onConflict?: string },
    ) => PromiseLike<{
      data: unknown;
      error: { message: string } | null;
    }>;
  };
};

export type SupabaseClientLike = CollegeLookupClient & ProfileWriteClient;
export type SupabaseAdminLike = CollegeLookupClient & AdminProfileWriteClient;

type UserMetadata = Record<string, unknown>;

function getUserMetadata(user: User): UserMetadata {
  const metadata = user.user_metadata as UserMetadata | undefined;
  const rawMetadata = (user as User & { raw_user_meta_data?: UserMetadata }).raw_user_meta_data;

  return {
    ...(rawMetadata ?? {}),
    ...(metadata ?? {}),
  };
}

function getMetadataString(metadata: UserMetadata, keys: string[]) {
  for (const key of keys) {
    const value = metadata[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function slugifyUsername(value: string) {
  return value
    .toLowerCase()
    .replace(/@.*/, "")
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 24);
}

function getUserFullName(user: User) {
  const metadata = getUserMetadata(user);
  const metadataName = getMetadataString(metadata, ["full_name", "name", "display_name"]);

  return metadataName || user.email?.split("@")[0] || "CampusLoop Student";
}

function getUserUsername(user: User) {
  const metadata = getUserMetadata(user);
  const preferredUsername = getMetadataString(metadata, ["username", "user_name", "handle"]);
  const emailOrId = user.email ?? user.id;
  const baseUsername = slugifyUsername(preferredUsername || emailOrId);

  return `${baseUsername || "student"}_${user.id.slice(0, 8)}`;
}

function getAvatarUrl(user: User) {
  const metadata = getUserMetadata(user);
  const avatarUrl = getMetadataString(metadata, ["avatar_url", "picture", "avatar"]);

  return avatarUrl || null;
}

function buildProfileValues(user: User, collegeId: string, existingProfile?: ProfileRow | null) {
  return {
    id: user.id,
    username: existingProfile?.username || getUserUsername(user),
    full_name: existingProfile?.full_name || getUserFullName(user),
    college_id: collegeId,
    avatar_url: existingProfile?.avatar_url || getAvatarUrl(user),
    role: existingProfile?.role || "user",
  };
}

function isCompleteProfile(profile: ProfileRow | null | undefined): profile is ProfileRow {
  return Boolean(profile?.username && profile?.full_name && profile?.college_id);
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

export async function createUserProfileWithAdmin(
  adminClient: SupabaseAdminLike,
  user: User,
  collegeId: string,
) {
  if (!user.email) {
    throw new Error("User email is required to create a profile.");
  }

  const profileValues = buildProfileValues(user, collegeId);

  const { error } = await adminClient.from("profiles").upsert(
    profileValues,
    { onConflict: "id" },
  );

  if (error) {
    throw new Error(`CampusLoop could not create your profile: ${error.message}`);
  }

  return {
    username: profileValues.username,
    collegeId,
    emailDomain: getEmailDomain(user.email),
  };
}

export async function ensureUserProfile(supabase: SupabaseClientLike, user: User) {
  if (!user.email) {
    throw new Error("Only verified Gautam Buddha University email accounts are allowed.");
  }

  const college: ActiveCollege = await getApprovedCollege(supabase, user.email);
  const { data: existingProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("id,username,full_name,college_id,avatar_url,role")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`CampusLoop could not verify your campus profile: ${fetchError.message}`);
  }

  if (isCompleteProfile(existingProfile)) {
    return {
      username: existingProfile.username as string,
      collegeId: existingProfile.college_id as string,
      emailDomain: getEmailDomain(user.email),
    };
  }

  const adminClient = createAdminClient();
  const profileValues = buildProfileValues(user, college.id, existingProfile);
  const profileWriter = (adminClient ?? supabase) as ProfileUpsertClient;

  const { error } = await profileWriter.from("profiles").upsert(profileValues, {
    onConflict: "id",
  });

  if (error) {
    throw new Error(`CampusLoop could not create your profile: ${error.message}`);
  }

  return {
    username: profileValues.username,
    collegeId: college.id,
    emailDomain: getEmailDomain(user.email),
  };
}
