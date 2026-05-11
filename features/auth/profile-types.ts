import type { Database } from "@/lib/supabase/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type ProfileUpdateData = {
  full_name?: string | null;
  username?: string;
  bio?: string | null;
  course?: string | null;
  year?: string | null;
  hostel?: string | null;
  linkedin_url?: string | null;
  instagram_username?: string | null;
};

export type PublicProfile = {
  id: string;
  username: string;
  full_name: string | null;
  bio: string | null;
  course: string | null;
  year: string | null;
  hostel: string | null;
  linkedin_url: string | null;
  instagram_username: string | null;
  created_at: string;
};

export type SellerIdentity = {
  displayName: string;
  username: string;
  bio?: string | null;
  subtitle?: string; // "Course • Year"
};
