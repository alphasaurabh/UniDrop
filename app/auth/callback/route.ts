import { NextResponse, type NextRequest } from "next/server";

import {
  ACTIVE_COLLEGE_LOOKUP_ERROR_MESSAGE,
  isLocallyApprovedCollegeEmail,
} from "@/features/auth/colleges";
import { ensureUserProfile, type SupabaseClientLike } from "@/features/auth/profile";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const authError = requestUrl.searchParams.get("error_description");
  const next = requestUrl.searchParams.get("next") ?? "/marketplace";

  if (authError) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(authError)}`, request.url),
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url),
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(
        new URL("/login?error=CampusLoop could not verify your session.", request.url),
      );
    }

    try {
      await ensureUserProfile(supabase as unknown as SupabaseClientLike, user);
    } catch (profileError) {
      if (
        profileError instanceof Error &&
        profileError.message === ACTIVE_COLLEGE_LOOKUP_ERROR_MESSAGE &&
        isLocallyApprovedCollegeEmail(user.email)
      ) {
        return NextResponse.redirect(new URL(next, request.url));
      }

      await supabase.auth.signOut();

      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(
            profileError instanceof Error
              ? profileError.message
              : "Only verified Gautam Buddha University students can access CampusLoop.",
          )}`,
          request.url,
        ),
      );
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
