import { redirect } from "next/navigation";
import { BadgeCheck, LogOut, MapPin, ShieldCheck, Sparkles } from "lucide-react";

import { ProfileForm } from "@/components/auth/profile-form";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getProfile } from "@/features/auth/profile-actions";
import { logout } from "@/features/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { getMyListings, getSavedListings } from "@/features/marketplace/queries";

export const metadata = { title: "Your campus identity" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");
  const profile = await getProfile(user.id);
  if (!profile) redirect("/login");
  const [myListings, savedListings] = await Promise.all([getMyListings(supabase), getSavedListings(supabase)]);
  const soldCount = myListings.filter((listing) => listing.status === "sold").length;
  const displayName = profile.full_name || "Campus student";
  const initials = displayName.split(" ").map((part: string) => part[0]).slice(0, 2).join("").toUpperCase();

  return <Container className="pb-24 pt-8 lg:pb-12"><div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
    <aside className="lg:sticky lg:top-24"><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Your campus identity</p><div className="mt-5 border-y border-border py-7"><div className="grid size-20 place-items-center rounded-2xl bg-foreground font-display text-2xl font-bold text-background">{initials || "U"}</div><h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight">{displayName}</h1><p className="mt-2 text-sm text-muted-foreground">{[profile.course, profile.year].filter(Boolean).join(" · ") || "Student on UniDrop"}</p><div className="mt-6 flex items-center gap-2 text-sm font-semibold"><BadgeCheck className="size-4 text-accent" /> Campus verified</div><p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4 text-primary" /> Gautam Buddha University</p></div><div className="grid grid-cols-3 divide-x divide-border border-b border-border py-5 text-center"><div><p className="font-display text-xl font-bold">{myListings.length}</p><p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">Listings</p></div><div><p className="font-display text-xl font-bold">{soldCount}</p><p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">Sold</p></div><div><p className="font-display text-xl font-bold">{savedListings.length}</p><p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">Saved</p></div></div><form action={logout} className="mt-5"><Button type="submit" variant="outline" className="w-full justify-start gap-2"><LogOut className="size-4" /> Log out</Button></form></aside>
    <main><div className="mb-8 flex items-end justify-between border-b border-border pb-5"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary"><Sparkles className="size-3.5" /> Profile details</p><h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Make it feel like you.</h2><p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">Your profile helps other students know who they are meeting when they buy from you.</p></div></div><ProfileForm profile={profile} /><div className="mt-8 flex items-start gap-3 border-l-2 border-accent bg-accent/10 p-4 text-sm text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" /> Your campus identity is only visible where it helps create a safer exchange.</div><div className="mt-8 border-t border-border pt-6"><p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Account</p><p className="mt-3 text-sm font-semibold">{user.email}</p><p className="mt-1 text-xs text-muted-foreground">Member since {new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p></div></main>
  </div></Container>;
}