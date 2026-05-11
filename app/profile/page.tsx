import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";

import { ProfileForm } from "@/components/auth/profile-form";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getProfile } from "@/features/auth/profile-actions";
import { logout } from "@/features/auth/actions";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Profile Settings",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const profile = await getProfile(user.id);

  if (!profile) {
    redirect("/login");
  }

  return (
    <Container className="py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Profile Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your public identity and personal information
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main Profile Form */}
        <div>
          <ProfileForm profile={profile} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Profile Preview Card */}
          <div className="rounded-3xl border border-border/50 bg-card/50 p-6 backdrop-blur">
            <h3 className="font-semibold text-foreground">Profile Preview</h3>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">Display name</p>
              <p className="font-medium">{profile.full_name || "Not set"}</p>

              {profile.course || profile.year ? (
                <>
                  <p className="mt-3 text-sm text-muted-foreground">Academic Info</p>
                  <p className="text-sm">
                    {profile.course} {profile.year ? `• ${profile.year}` : ""}
                  </p>
                </>
              ) : null}

              {profile.bio ? (
                <>
                  <p className="mt-3 text-sm text-muted-foreground">Bio</p>
                  <p className="text-sm text-foreground">{profile.bio}</p>
                </>
              ) : null}
            </div>
          </div>

          {/* Account Info */}
          <div className="rounded-3xl border border-border/50 bg-card/50 p-6 backdrop-blur">
            <h3 className="font-semibold text-foreground">Account</h3>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="break-all text-sm font-medium">{user.email}</p>

              <p className="mt-3 text-sm text-muted-foreground">Member since</p>
              <p className="text-sm">
                {new Date(user.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>

          {/* Logout */}
          <form action={logout}>
            <Button
              type="submit"
              variant="outline"
              className="w-full justify-start gap-2"
            >
              <LogOut className="size-4" />
              Log out
            </Button>
          </form>
        </div>
      </div>
    </Container>
  );
}
