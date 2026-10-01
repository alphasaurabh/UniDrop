"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bookmark, Compass, Home, LogOut, Search, ShoppingBag, User, X } from "lucide-react";

import { logout } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const links = [
  { href: "/", label: "Home" },
  { href: "/marketplace", label: "Explore" },
  { href: "/saved", label: "Saved" },
];

export function NavbarClient({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => setProfileOpen(false), [pathname]);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
        <Container>
          <div className="flex h-[72px] items-center gap-5">
            <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="UniDrop home">
              <span className="grid size-9 rotate-3 place-items-center rounded-xl bg-primary text-lg font-bold text-primary-foreground transition-transform group-hover:rotate-0">U</span>
              <span className="font-display text-lg font-bold tracking-tight">UniDrop<span className="text-primary">.</span></span>
            </Link>
            <form action="/marketplace" className="hidden max-w-md flex-1 lg:block">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input name="q" placeholder="Search your campus" className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
              </label>
            </form>
            <nav className="hidden items-center gap-1 lg:flex">
              {links.map((link) => <Link key={link.href} href={link.href} className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted ${isActive(link.href) ? "text-foreground" : "text-muted-foreground"}`}>{link.label}</Link>)}
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <Link href="/sell" className="hidden h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated sm:flex"><ShoppingBag className="size-4" /> Sell something</Link>
              {isAuthenticated ? (
                <div ref={profileRef} className="relative">
                  <button type="button" aria-label="Open profile menu" aria-expanded={profileOpen} onClick={() => setProfileOpen((open) => !open)} className="grid size-10 place-items-center rounded-xl border border-border bg-card transition hover:border-primary/50">{profileOpen ? <X className="size-4" /> : <User className="size-4" />}</button>
                  {profileOpen ? <div className="absolute right-0 top-12 w-52 rounded-2xl border border-border bg-card p-2 shadow-elevated"><Link href="/profile" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-muted"><User className="size-4" /> My profile</Link><Link href="/account" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-muted"><ShoppingBag className="size-4" /> My listings</Link><Link href="/saved" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-muted"><Bookmark className="size-4" /> Saved items</Link><form action={logout} className="mt-1 border-t border-border pt-1"><button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10"><LogOut className="size-4" /> Log out</button></form></div> : null}
                </div>
              ) : <Button asChild href="/login" variant="outline" size="sm">Log in</Button>}
            </div>
          </div>
        </Container>
      </header>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden">
        <nav className="mx-auto grid max-w-md grid-cols-5">
          {[{ href: "/", label: "Home", icon: Home }, { href: "/marketplace", label: "Explore", icon: Compass }, { href: "/sell", label: "Sell", icon: ShoppingBag }, { href: "/saved", label: "Saved", icon: Bookmark }, { href: isAuthenticated ? "/profile" : "/login", label: "Profile", icon: User }].map((item) => <Link key={item.label} href={item.href} className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-bold ${isActive(item.href) ? "text-primary" : "text-muted-foreground"}`}><item.icon className="size-5" />{item.label}</Link>)}
        </nav>
      </div>
    </>
  );
}