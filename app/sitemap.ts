import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://unidrop.app";
  const supabase = await createClient();

  // Static pages that are always present
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/marketplace`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sell`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  try {
    // Fetch all active listings for dynamic URLs
    const { data: listings } = await supabase
      .from("listings")
      .select("id, title, updated_at, status")
      .eq("status", "active")
      .limit(50000); // Sitemap limit is 50k URLs

    if (listings && listings.length > 0) {
      const listingPages: MetadataRoute.Sitemap = listings.map((listing) => ({
        url: `${baseUrl}/marketplace/${listing.id}`,
        lastModified: new Date(listing.updated_at || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

      return [...staticPages, ...listingPages];
    }
  } catch (error) {
    console.error("Error generating sitemap listings:", error);
  }

  return staticPages;
}
