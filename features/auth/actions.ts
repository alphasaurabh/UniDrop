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
import { ensureUserProfile, type SupabaseClientLike } from "@/features/auth/profile";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function encodedError(message: string) {
  return encodeURIComponent(message);
}

function getOrigin(headersList: Headers) {
  return headersList.get("origin") ?? "http://localhost:3000";
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

async function confirmExistingUserByEmail(
  adminSupabase: NonNullable<ReturnType<typeof createAdminClient>>,
  email: string,
  password: string,
  userMetadata: Record<string, string>,
) {
  const { data, error } = await adminSupabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    return error;
  }

  const existingUser = data.users.find((user) => user.email?.toLowerCase() === email);

  if (!existingUser) {
    return new Error("CampusLoop could not find the existing pending account.");
  }

  const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
    existingUser.id,
    {
      password,
      email_confirm: true,
      user_metadata: {
        ...existingUser.user_metadata,
        ...userMetadata,
      },
    },
  );

  return updateError;
}

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
    supabase as unknown as CollegeLookupClient,
    email,
    collegeName,
  );
  const userMetadata = {
    username,
    full_name: fullName,
    college: activeCollege?.name ?? selectedCollege.name,
    role: "user",
  };
  const adminSupabase = createAdminClient();

  if (adminSupabase) {
    const { error: createError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: userMetadata,
    });

    if (createError) {
      const isExistingUserError = /already|registered|exists/i.test(createError.message);
      const confirmError = isExistingUserError
        ? await confirmExistingUserByEmail(adminSupabase, email, password, userMetadata)
        : createError;

      if (confirmError) {
        return {
          status: "error",
          message: confirmError.message,
        };
      }
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.user) {
      return {
        status: "error",
        message: signInError?.message ?? "CampusLoop created your account, but could not start your session.",
      };
    }

    try {
      await ensureUserProfile(supabase as unknown as SupabaseClientLike, signInData.user);
    } catch (profileError) {
      if (
        profileError instanceof Error &&
        profileError.message === ACTIVE_COLLEGE_LOOKUP_ERROR_MESSAGE &&
        isLocallyApprovedCollegeEmail(signInData.user.email)
      ) {
        redirect("/marketplace");
      }

      return {
        status: "error",
        message:
          profileError instanceof Error
            ? profileError.message
            : "CampusLoop could not create your profile.",
      };
    }

    redirect("/marketplace");
  }

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
            : "CampusLoop could not create your profile.",
      };
    }

    redirect("/marketplace");
  }

  if (data.user) {
    return {
      status: "success",
      message:
        "Supabase is waiting for email confirmation. Confirm your Gautam Buddha University email, or add SUPABASE_SERVICE_ROLE_KEY locally for instant dev signup.",
    };
  }

  return {
    status: "error",
    message: "CampusLoop could not create your account. Please try again.",
  };
}

export async function signup(formData: FormData) {
  const state = await signupWithState(initialAuthState, formData);

  if (state.status === "success") {
    redirect(`/login?message=${encodedError(state.message ?? "Check your email to confirm your account.")}`);
  }

  redirectWithError("/signup", state.message ?? "CampusLoop could not create your account.");
}

export async function signInWithGoogle(formData: FormData) {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = getOrigin(headersList);
  const redirectTo = normalizeRedirectPath(formData.get("redirectTo"));

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
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
  const supabase = await createClient();
  const headersList = await headers();
  const origin = getOrigin(headersList);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  const activeCollege = await findActiveCollegeForEmail(
    supabase as unknown as CollegeLookupClient,
    email,
  );

  if (!activeCollege) {
    redirectWithError("/forgot-password", "Use your Gautam Buddha University email address.");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    redirectWithError("/forgot-password", error.message);
  }

  redirect("/login?message=Check your college email for a password reset link.");
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    redirectWithError("/reset-password", "Password must be at least 8 characters.");
  }

  if (password !== confirmPassword) {
    redirectWithError("/reset-password", "Passwords do not match.");
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    redirectWithError("/reset-password", error.message);
  }

  redirect("/marketplace");
}
