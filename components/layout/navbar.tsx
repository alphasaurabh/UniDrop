import Link from "next/link";
import { ChevronDown, Home, Plus, Bookmark, User, Search, ShoppingBag, LogOut, Menu, X } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { hasPublicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/features/auth/actions";

const navItems = [
  { href: "/marketplace", label: "Marketplace", icon: Home },
  { href: "/sell", label: "Sell", icon: Plus },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/account", label: "Account", icon: User },
];

export async function Navbar() {
  const user = hasPublicEnv()
    ? (await (await createClient()).auth.getUser()).data.user
    : null;

  return (
    <>
      {/* Desktop Navbar */}
      <header className="sticky top-4 z-50 hidden lg:block">
        <Container>
          <div className="glass-nav relative flex items-center justify-between px-5 py-3">
            <Link className="flex items-center gap-3 font-semibold tracking-tight" href="/">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-soft">
                CL
              </span>
              <span className="font-display text-lg">CampusLoop</span>
            </Link>

            <nav className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  className="rounded-full px-3 py-2 transition-colors hover:bg-muted/60 hover:text-foreground"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {user ? (
                <details className="relative">
                  <summary className="list-none flex cursor-pointer items-center gap-2 rounded-2xl border border-border/70 bg-card/75 px-3 py-2 text-sm font-medium shadow-soft backdrop-blur-xl">
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="size-4" />
                    </span>
                    <span>Profile</span>
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                  </summary>
                  <div className="absolute right-0 top-full mt-3 w-56 rounded-3xl border border-border/70 bg-card/95 p-2 shadow-elevated backdrop-blur-2xl">
                    <Link className="block rounded-2xl px-4 py-3 text-sm transition hover:bg-muted/70" href="/account">Seller dashboard</Link>
                    <Link className="block rounded-2xl px-4 py-3 text-sm transition hover:bg-muted/70" href="/saved">Saved items</Link>
                    <Link className="block rounded-2xl px-4 py-3 text-sm transition hover:bg-muted/70" href="/sell">New listing</Link>
                    <form action={logout} className="p-1">
                      <Button variant="outline" size="sm" type="submit" className="w-full">
                        Log out
                      </Button>
                    </form>
                  </div>
                </details>
              ) : (
                <>
                  <Button asChild href="/login" variant="outline" size="sm">
                    Log in
                  </Button>
                  <Button asChild href="/signup" size="sm">
                    Sign up
                  </Button>
                </>
              )}
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-lg lg:hidden">
        <Container>
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <Link className="flex items-center gap-2 font-semibold" href="/">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                CL
              </span>
            </Link>
            
            <div className="flex flex-1 items-center justify-center gap-2">
              <span className="font-display text-sm font-semibold">CampusLoop</span>
            </div>

            <details className="relative group">
              <summary className="list-none cursor-pointer rounded-lg p-2 transition hover:bg-muted/70">
                <Menu className="size-5 group-open:hidden" />
                <X className="hidden size-5 group-open:block" />
              </summary>
              <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border/70 bg-card/98 p-3 shadow-elevated backdrop-blur-lg">
                <div className="grid gap-2">
                  <Link className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted/70"
                    href="/marketplace">
                    <Search className="size-4" />
                    Browse marketplace
                  </Link>
                  <Link className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted/70"
                    href="/sell">
                    <ShoppingBag className="size-4" />
                    Sell an item
                  </Link>
                  <Link className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted/70"
                    href="/saved">
                    <Bookmark className="size-4" />
                    Saved items
                  </Link>
                  {user ? (
                    <>
                      <Link className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted/70"
                        href="/account">
                        <User className="size-4" />
                        My listings
                      </Link>
                      <form action={logout} className="mt-2 border-t border-border/70 pt-2">
                        <Button variant="outline" size="sm" type="submit" className="w-full justify-start gap-2">
                          <LogOut className="size-4" />
                          Log out
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border/70 pt-2">
                      <Button asChild href="/login" variant="outline" size="sm">
                        Log in
                      </Button>
                      <Button asChild href="/signup" size="sm">
                        Sign up
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </details>
          </div>
        </Container>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/70 bg-background/95 backdrop-blur-lg lg:hidden">
        <div className="grid grid-cols-4 gap-0 px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col items-center justify-center gap-1.5 rounded-lg px-2 py-2 transition-all hover:bg-muted/70 active:scale-95"
                title={item.label}
              >
                <div className="relative flex size-10 items-center justify-center rounded-lg transition-colors group-hover:bg-primary/10">
                  <Icon className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
