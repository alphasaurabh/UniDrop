"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check } from "lucide-react";

import { updateProfile } from "@/features/auth/profile-actions";
import type { Profile } from "@/features/auth/profile-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProfileFormProps = {
  profile: Profile;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    full_name: profile.full_name || "",
    username: profile.username || "",
    bio: profile.bio || "",
    course: profile.course || "",
    year: profile.year || "",
    hostel: profile.hostel || "",
    linkedin_url: profile.linkedin_url || "",
    instagram_username: profile.instagram_username || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const result = await updateProfile(profile.id, formData);

    if (result.success) {
      setMessage({ type: "success", text: "Profile updated successfully!" });
      router.refresh();
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update profile" });
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
            message.type === "success"
              ? "bg-green-500/10 text-green-700"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {message.type === "success" ? (
            <Check className="size-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="size-4 flex-shrink-0" />
          )}
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* Public Identity Section */}
      <div className="space-y-4 rounded-3xl border border-border/50 bg-card/50 p-6 backdrop-blur">
        <h3 className="font-semibold text-foreground">Public Identity</h3>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Full Name</label>
          <Input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Your full name"
            className="mt-2 bg-background/50"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Displayed on your listings and public profile
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Username</label>
          <div className="relative mt-2">
            <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
              @
            </span>
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="username"
              className="bg-background/50 pl-7"
              disabled
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Username is set at signup</p>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell buyers about yourself..."
            maxLength={160}
            rows={3}
            className="mt-2 w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {formData.bio.length}/160 characters
          </p>
        </div>
      </div>

      {/* Academic Info Section */}
      <div className="space-y-4 rounded-3xl border border-border/50 bg-card/50 p-6 backdrop-blur">
        <h3 className="font-semibold text-foreground">Academic Info</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Course / Branch</label>
            <Input
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="e.g., Computer Science"
              className="mt-2 bg-background/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Year of Study</label>
            <Input
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="e.g., 2nd Year"
              className="mt-2 bg-background/50"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Hostel / Area</label>
          <Input
            name="hostel"
            value={formData.hostel}
            onChange={handleChange}
            placeholder="e.g., Block A or Noida"
            className="mt-2 bg-background/50"
          />
        </div>
      </div>

      {/* Social Links Section */}
      <div className="space-y-4 rounded-3xl border border-border/50 bg-card/50 p-6 backdrop-blur">
        <h3 className="font-semibold text-foreground">Social Links</h3>

        <div>
          <label className="text-sm font-medium text-muted-foreground">LinkedIn URL</label>
          <Input
            name="linkedin_url"
            type="url"
            value={formData.linkedin_url}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            className="mt-2 bg-background/50"
          />
          <p className="mt-1 text-xs text-muted-foreground">Optional - link to your LinkedIn</p>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Instagram Username</label>
          <div className="relative mt-2">
            <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
              @
            </span>
            <Input
              name="instagram_username"
              value={formData.instagram_username}
              onChange={handleChange}
              placeholder="username"
              className="bg-background/50 pl-7"
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Optional - Instagram username only</p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="flex-1 sm:flex-none"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
