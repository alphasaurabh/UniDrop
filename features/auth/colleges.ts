import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { getPublicEnv, getServerEnv } from "@/lib/env";

export type ApprovedCollege = {
  name: string;
  allowedEmailDomains: string[];
};

export const COLLEGE_DOMAIN_ERROR_MESSAGE =
  "CampusLoop currently accepts only approved Gautam Buddha University email domains.";

export const ACTIVE_COLLEGE_LOOKUP_ERROR_MESSAGE =
  "CampusLoop could not find an active approved college for this email domain.";

export type ActiveCollege = {
  id: string;
  name: string;
  slug: string;
  allowed_email_domains: string[];
  is_active: boolean;
};

export type CollegeLookupClient = {
  from: (table: "colleges") => CollegeQueryBuilder;
};

type CollegeQueryBuilder = {
  select: (columns: string) => CollegeQueryBuilder;
  eq: (column: string, value: string | boolean) => CollegeQueryBuilder;
  contains: (column: string, value: string[]) => CollegeQueryBuilder;
  maybeSingle: () => PromiseLike<{
    data: ActiveCollege | null;
    error: { message: string } | null;
  }>;
};

export const approvedColleges: ApprovedCollege[] = [
  {
    name: "Gautam Buddha University",
    allowedEmailDomains: ["gbu.ac.in"],
  },
];

let collegeLookupAdminClient: CollegeLookupClient | null = null;

function getCollegeLookupAdminClient() {
  if (collegeLookupAdminClient) {
    return collegeLookupAdminClient;
  }

  const { supabaseServiceRoleKey } = getServerEnv();

  if (!supabaseServiceRoleKey) {
    throw new Error("CampusLoop is missing SUPABASE_SERVICE_ROLE_KEY for college lookup.");
  }

  const { supabaseUrl } = getPublicEnv();

  collegeLookupAdminClient = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }) as unknown as CollegeLookupClient;

  return collegeLookupAdminClient;
}

export function getApprovedCollegeByName(name: string) {
  return approvedColleges.find((college) => college.name === name) ?? null;
}

export function getEmailDomain(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const emailDomain = normalizedEmail.split("@")[1]?.trim().replace(/\.+$/, "");

  return emailDomain ?? "";
}

export function isEmailDomainAllowedByCollege(email: string, collegeName: string) {
  const college = getApprovedCollegeByName(collegeName);
  const emailDomain = getEmailDomain(email);

  if (!college || !emailDomain) {
    return false;
  }

  return college.allowedEmailDomains.includes(emailDomain);
}

export function isLocallyApprovedCollegeEmail(email?: string | null) {
  const emailDomain = getEmailDomain(email ?? "");

  if (!emailDomain) {
    return false;
  }

  return approvedColleges.some((college) =>
    college.allowedEmailDomains.includes(emailDomain),
  );
}

export async function findActiveCollegeForEmail(
  supabase: CollegeLookupClient,
  email: string,
  collegeName?: string,
) {
  void supabase;

  const emailDomain = getEmailDomain(email);
  console.log("[CampusLoop][auth] extracted college domain", {
    email,
    emailDomain,
    collegeName: collegeName ?? null,
  });

  if (!emailDomain) {
    return null;
  }

  const adminSupabase = getCollegeLookupAdminClient();

  const { data: matchedCollege, error: matchedCollegeError } = await adminSupabase
    .from("colleges")
    .select("id,name,slug,allowed_email_domains,is_active")
    .contains("allowed_email_domains", [emailDomain])
    .eq("is_active", true)
    .maybeSingle();

  console.log("[CampusLoop][auth] admin colleges array lookup result", {
    emailDomain,
    matchedCollege,
    matchedCollegeError: matchedCollegeError?.message ?? null,
  });

  if (!matchedCollegeError && matchedCollege) {
    return matchedCollege;
  }

  if (matchedCollegeError) {
    console.error("[CampusLoop][auth] admin colleges array lookup error", {
      emailDomain,
      error: matchedCollegeError.message,
    });
  }

  const { data: fallbackCollege, error: fallbackError } = await adminSupabase
    .from("colleges")
    .select("id,name,slug,allowed_email_domains,is_active")
    .eq("name", collegeName ?? approvedColleges[0].name)
    .eq("is_active", true)
    .maybeSingle();

  console.log("[CampusLoop][auth] admin colleges fallback lookup result", {
    emailDomain,
    fallbackCollege,
    fallbackError: fallbackError?.message ?? null,
  });

  if (fallbackError || !fallbackCollege) {
    return null;
  }

  const fallbackDomainMatch =
    Array.isArray(fallbackCollege.allowed_email_domains) &&
    fallbackCollege.allowed_email_domains.some(
      (allowedDomain) => typeof allowedDomain === "string" && allowedDomain.trim().toLowerCase() === emailDomain,
    );

  if (fallbackDomainMatch) {
    return fallbackCollege;
  }

  return null;
}

export async function isEmailApprovedForCollege(
  supabase: CollegeLookupClient,
  email: string,
  collegeName: string,
) {
  const college = await findActiveCollegeForEmail(supabase, email, collegeName);
  return Boolean(college);
}

export async function isApprovedCollegeEmail(
  supabase: CollegeLookupClient,
  email?: string | null,
) {
  if (!email) {
    return false;
  }

  if (!isLocallyApprovedCollegeEmail(email)) {
    return false;
  }

  const college = await findActiveCollegeForEmail(supabase, email);
  return Boolean(college) || isLocallyApprovedCollegeEmail(email);
}
