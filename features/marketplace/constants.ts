export const LISTING_CATEGORIES = [
  "Electronics",
  "Books",
  "Fashion",
  "Cycles",
  "Hostel Essentials",
  "Gadgets",
  "Furniture",
  "Sports",
  "Other",
] as const;

export const LISTING_CONDITIONS = ["new", "like_new", "good", "fair", "poor"] as const;

export const LISTING_CONDITION_LABELS = {
  new: "New",
  like_new: "Like new",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
} as const;

export const CONTACT_PREFERENCES = ["Chat", "Phone", "WhatsApp", "Email"] as const;

export const LISTING_IMAGE_BUCKET = "marketplace";

export const PAGINATION_LIMIT = 12;
export const PAGINATION_LIMITS = [12, 24, 48] as const;

export const REPORT_REASONS = ["spam", "scam", "inappropriate", "duplicate", "fake_product", "other"] as const;
export const REPORT_STATUSES = ["pending", "reviewing", "resolved", "dismissed"] as const;

export const REPORT_REASON_LABELS = {
  spam: "Spam or misleading",
  scam: "Scam or fraudulent",
  inappropriate: "Inappropriate content",
  duplicate: "Duplicate listing",
  fake_product: "Fake or counterfeit product",
  other: "Other reason",
} as const;

export type ListingCategory = (typeof LISTING_CATEGORIES)[number];
export type ListingCondition = (typeof LISTING_CONDITIONS)[number];
export type ContactPreference = (typeof CONTACT_PREFERENCES)[number];

export function isListingCategory(value: string): value is ListingCategory {
  return LISTING_CATEGORIES.includes(value as ListingCategory);
}

export function isListingCondition(value: string): value is ListingCondition {
  return LISTING_CONDITIONS.includes(value as ListingCondition);
}

export function formatListingConditionLabel(value: string) {
  return LISTING_CONDITION_LABELS[value as ListingCondition] ?? value;
}

export function isContactPreference(value: string): value is ContactPreference {
  return CONTACT_PREFERENCES.includes(value as ContactPreference);
}

export function isReportReason(value: string): value is ReportReason {
  return REPORT_REASONS.includes(value as ReportReason);
}

export function formatReportReasonLabel(reason: string): string {
  return REPORT_REASON_LABELS[reason as ReportReason] ?? reason;
}

export type ReportReason = (typeof REPORT_REASONS)[number];
export type ReportStatus = (typeof REPORT_STATUSES)[number];
