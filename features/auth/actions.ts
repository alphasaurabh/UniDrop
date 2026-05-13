"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  approvedColleges,
  ACTIVE_COLLEGE_LOOKUP_ERROR_MESSAGE,
  COLLEGE_DOMAIN_ERROR_MESSAGE,
  findActiveCollegeForEmail,
  getApprovedCollegeByName,
  isEmailDomainAllowedByCollege,
  isLocallyApprovedCollegeEmail,
  type CollegeLookupClient,
} from "@/features/auth/colleges";
import {
  ensureUserProfile,
  type SupabaseClientLike,
} from "@/features/auth/profile";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function encodedError(message: string) {
  return encodeURIComponent(message);
}

function getOrigin(headersList: Headers) {
  return headersList.get("origin") ?? "http://localhost:3000";
}

function buildAuthCallbackUrl(origin: string, next: string) {
  return `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
}

function redirectWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodedError(message)}`);
}

function normalizeRedirectPath(value: FormDataEntryValue | null) {
  const path = String(value ?? "/marketplace");

  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/marketplace";
  }

  return path;
}

export type AuthActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};

const initialAuthState: AuthActionState = {
  status: "idle",
};

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const redirectTo = normalizeRedirectPath(formData.get("redirectTo"));

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirectWithError("/login", error.message);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirectWithError("/login", "We could not verify your session. Please try again.");
  }

  try {
    await ensureUserProfile(supabase as unknown as SupabaseClientLike, user);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === ACTIVE_COLLEGE_LOOKUP_ERROR_MESSAGE &&
      isLocallyApprovedCollegeEmail(user.email)
    ) {
      redirect(redirectTo);
    }

    await supabase.auth.signOut();
    redirectWithError("/login", error instanceof Error ? error.message : "Your college could not be verified.");
  }

  redirect(redirectTo);
}

export async function signupWithState(
  previousState: AuthActionState = initialAuthState,
  formData: FormData,
): Promise<AuthActionState> {
  void previousState;

  const supabase = await createClient();
  const headersList = await headers();
  const origin = getOrigin(headersList);

  const fullName = String(formData.get("fullName") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const collegeName = String(formData.get("college") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const selectedCollege = getApprovedCollegeByName(collegeName);
  const adminSupabase = createAdminClient();

  if (!fullName || !username || !email || !password || !collegeName) {
    return {
      status: "error",
      message: "Please complete every required field.",
    };
  }

  if (!selectedCollege) {
    return {
      status: "error",
      message: "Please select Gautam Buddha University before signing up.",
    };
  }

  if (!isEmailDomainAllowedByCollege(email, collegeName)) {
    return {
      status: "error",
      message: COLLEGE_DOMAIN_ERROR_MESSAGE,
    };
  }

  const activeCollege = await findActiveCollegeForEmail(
    (adminSupabase ?? supabase) as unknown as CollegeLookupClient,
    email,
    collegeName,
  );

  if (!activeCollege?.id) {
    return {
      status: "error",
      message: "UniDrop could not find an active approved college for this email domain.",
    };
  }

  const userMetadata = {
    username,
    full_name: fullName,
    college: activeCollege.name,
    role: "user",
  };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userMetadata,
      emailRedirectTo: `${origin}/auth/callback?next=/marketplace`,
    },
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  if (data.user && data.session) {
    try {
      await ensureUserProfile(supabase as unknown as SupabaseClientLike, data.user);
    } catch (profileError) {
      if (
        profileError instanceof Error &&
        profileError.message === ACTIVE_COLLEGE_LOOKUP_ERROR_MESSAGE &&
        isLocallyApprovedCollegeEmail(data.user.email)
      ) {
        redirect("/marketplace");
      }

      await supabase.auth.signOut();
      return {
        status: "error",
        message:
          profileError instanceof Error
            ? profileError.message
            : "UniDrop could not create your profile.",
      };
    }

    redirect("/marketplace");
  }

  if (data.user) {
    // User created but email confirmation required
    // Profile will be created in auth/callback route after email confirmation
    return {
      status: "success",
      message:
        "Check your university email — We’ve sent a verification link to your email address. Please verify your account to continue using UniDrop securely. Didn’t receive the email? Check your spam folder or try again in a moment.",
    };
  }

  return {
    status: "error",
    message: "UniDrop could not create your account. Please try again.",
  };
}

export async function signup(formData: FormData) {
  const state = await signupWithState(initialAuthState, formData);

  if (state.status === "success") {
    redirect(`/login?message=${encodedError(state.message ?? "Check your email to confirm your account.")}`);
  }

  redirectWithError("/signup", state.message ?? "UniDrop could not create your account.");
}

export async function signInWithGoogle(formData: FormData) {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = getOrigin(headersList);
  const redirectTo = normalizeRedirectPath(formData.get("redirectTo"));

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: buildAuthCallbackUrl(origin, redirectTo),
      queryParams: {
        hd: approvedColleges[0].allowedEmailDomains[0],
        prompt: "select_account",
      },
    },
  });

  if (error || !data.url) {
    redirectWithError("/login", error?.message ?? "Google login could not be started.");
  }

  redirect(data.url);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login?message=You have been logged out securely.");
}

export async function requestPasswordReset(formData: FormData) {
  const state = await requestPasswordResetWithState(initialAuthState, formData);

  if (state.status === "success") {
    redirect(
      `/login?message=${encodedError(
        state.message ?? "Password reset instructions have been sent to your email.",
      )}`,
    );
  }

  redirectWithError("/forgot-password", state.message ?? "We could not send the reset email right now.");
}

export async function requestPasswordResetWithState(
  previousState: AuthActionState = initialAuthState,
  formData: FormData,
): Promise<AuthActionState> {
  void previousState;

  const supabase = await createClient();
  const headersList = await headers();
  const origin = getOrigin(headersList);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    return {
      status: "error",
      message: "Please enter the email address linked to your UniDrop account.",
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: buildAuthCallbackUrl(origin, "/reset-password"),
  });

  if (error) {
    return {
      status: "error",
      message: "We could not send the reset email right now. Please try again in a moment.",
    };
  }

  return {
    status: "success",
    message: "Password reset instructions have been sent to your email.",
  };
}

export async function resetPassword(formData: FormData) {
  const state = await resetPasswordWithState(initialAuthState, formData);

  if (state.status === "success") {
    redirect(
      `/login?message=${encodedError(
        state.message ?? "Your password has been updated. Please log in again.",
      )}`,
    );
  }

  redirectWithError(
    "/reset-password",
    state.message ?? "We could not update your password right now.",
  );
}

export async function resetPasswordWithState(
  previousState: AuthActionState = initialAuthState,
  formData: FormData,
): Promise<AuthActionState> {
  void previousState;

  const supabase = await createClient();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    return {
      status: "error",
      message: "Password must be at least 8 characters.",
    };
  }

  if (password !== confirmPassword) {
    return {
      status: "error",
      message: "Passwords do not match.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return {
      status: "error",
      message: "Your reset link may have expired. Please request a new link and try again.",
    };
  }

  return {
    status: "success",
    message: "Password updated successfully.",
  };
}
