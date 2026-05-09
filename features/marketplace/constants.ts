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

export const LISTING_CONDITIONS = ["New", "Like New", "Good", "Fair"] as const;

export const CONTACT_PREFERENCES = ["Chat", "Phone", "WhatsApp", "Email"] as const;

export const LISTING_IMAGE_BUCKET = "listing-images";

export type ListingCategory = (typeof LISTING_CATEGORIES)[number];
export type ListingCondition = (typeof LISTING_CONDITIONS)[number];
export type ContactPreference = (typeof CONTACT_PREFERENCES)[number];

export function isListingCategory(value: string): value is ListingCategory {
  return LISTING_CATEGORIES.includes(value as ListingCategory);
}

export function isListingCondition(value: string): value is ListingCondition {
  return LISTING_CONDITIONS.includes(value as ListingCondition);
}

export function isContactPreference(value: string): value is ContactPreference {
  return CONTACT_PREFERENCES.includes(value as ContactPreference);
}
