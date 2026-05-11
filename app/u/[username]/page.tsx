import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Briefcase, Calendar, Linkedin, Instagram } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { getProfileByUsername } from "@/features/auth/profile-actions";
import { getListingsBySellerUsername } from "@/features/marketplace/queries";
import { ListingCard } from "@/components/marketplace/listing-card";
import { EmptyState } from "@/components/ui/empty-state";
import { createClient } from "@/lib/supabase/server";

type PublicProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export async function generateMetadata({ params }: PublicProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return {
      title: "Profile Not Found",
    };
  }

  return {
    title: `${profile.full_name || `@${profile.username}`} - UniDrop`,
    description: profile.bio || `Check out ${profile.full_name || `@${profile.username}`}'s listings on UniDrop`,
  };
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const supabase = await createClient();
  const listings = await getListingsBySellerUsername(supabase, profile.id);

  const joinDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <Container className="py-8">
      {/* Profile Header */}
      <div className="mb-8 rounded-3xl border border-border/50 bg-gradient-to-br from-card/50 to-card/30 p-8 backdrop-blur">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  {profile.full_name || `@${profile.username}`}
                </h1>
                {profile.full_name && profile.username && (
                  <p className="mt-1 text-muted-foreground">@{profile.username}</p>
                )}
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="mt-4 max-w-2xl text-foreground">
                {profile.bio}
              </p>
            )}

            {/* Academic Info */}
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.course && (
                <Badge variant="soft" className="gap-2">
                  <Briefcase className="size-3.5" />
                  {profile.course}
                </Badge>
              )}
              {profile.year && (
                <Badge variant="soft" className="gap-2">
                  <Calendar className="size-3.5" />
                  {profile.year}
                </Badge>
              )}
              {profile.hostel && (
                <Badge variant="soft" className="gap-2">
                  <MapPin className="size-3.5" />
                  {profile.hostel}
                </Badge>
              )}
            </div>

            {/* Social Links */}
            {(profile.linkedin_url || profile.instagram_username) && (
              <div className="mt-4 flex gap-3">
                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm hover:bg-muted/50 transition"
                  >
                    <Linkedin className="size-4" />
                    LinkedIn
                  </a>
                )}
                {profile.instagram_username && (
                  <a
                    href={`https://instagram.com/${profile.instagram_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm hover:bg-muted/50 transition"
                  >
                    <Instagram className="size-4" />
                    Instagram
                  </a>
                )}
              </div>
            )}

            {/* Member Since */}
            <p className="mt-4 text-sm text-muted-foreground">
              Member since {joinDate}
            </p>
          </div>

          {/* Stats Card */}
          <div className="rounded-2xl border border-border/50 bg-background/50 p-4 sm:w-48">
            <div className="text-center">
              <p className="text-3xl font-semibold text-primary">{listings.length}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {listings.length === 1 ? "Listing" : "Listings"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Section */}
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Active Listings
        </h2>

        {listings.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={<Briefcase className="size-6" />}
              title="No listings yet"
              description={`${profile.full_name || `@${profile.username}`} hasn't posted any listings yet.`}
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} showSeller={false} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
