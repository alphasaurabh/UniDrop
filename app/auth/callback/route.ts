import { NextResponse, type NextRequest } from "next/server";

import {
  ACTIVE_COLLEGE_LOOKUP_ERROR_MESSAGE,
  isLocallyApprovedCollegeEmail,
} from "@/features/auth/colleges";
import { ensureUserProfile, type SupabaseClientLike } from "@/features/auth/profile";
import { cookies } from "next/headers";
import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { getPublicEnv, hasPublicEnv } from "@/lib/env";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

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
    // For cookie persistence during redirect, we need to handle cookies explicitly in Route Handler
    // Create a response object first to attach cookies to
    const response = NextResponse.redirect(new URL(next, request.url));

    if (!hasPublicEnv()) {
      return response;
    }

    // Create Supabase client with explicit cookie handling for Route Handler
    const { supabaseUrl, supabaseAnonKey } = getPublicEnv();
    const cookieStore = await cookies();

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
            // Explicitly set cookies on the response object
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    // Exchange authorization code for session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(exchangeError.message)}`,
          request.url,
        ),
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(
        new URL(
          "/login?error=CampusLoop could not verify your session.",
          request.url,
        ),
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
        // Return response with cookies intact
        return response;
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

    // Return response with cookies set
    return response;
  }

  return NextResponse.redirect(new URL(next, request.url));
}
