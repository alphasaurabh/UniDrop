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

export function getApprovedCollegeByName(name: string) {
  return approvedColleges.find((college) => college.name === name) ?? null;
}

export function getEmailDomain(email: string) {
  return email.trim().toLowerCase().split("@").at(1) ?? "";
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
  const emailDomain = getEmailDomain(email);

  if (!emailDomain) {
    return null;
  }

  let query = supabase
    .from("colleges")
    .select("id,name,slug,allowed_email_domains,is_active")
    .eq("is_active", true)
    .contains("allowed_email_domains", [emailDomain]);

  if (collegeName) {
    query = query.eq("name", collegeName);
  }

  const { data, error } = await query.maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
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
