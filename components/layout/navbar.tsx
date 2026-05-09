import Link from "next/link";
import { ChevronDown, UserRound } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { hasPublicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/features/auth/actions";

const navItems = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/sell", label: "Sell" },
  { href: "/saved", label: "Saved" },
  { href: "/account", label: "Account" },
];

export async function Navbar() {
  const user = hasPublicEnv()
    ? (await (await createClient()).auth.getUser()).data.user
    : null;

  return (
    <header className="sticky top-0 z-40 py-3">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 rounded-full border bg-background/78 px-4 shadow-glow backdrop-blur-2xl sm:px-5">
        <Link className="flex items-center gap-2 font-semibold tracking-tight" href="/">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-soft">
            CL
          </span>
          <span>CampusLoop</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className="rounded-full px-1 transition-colors hover:text-foreground"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/account"
                className="flex items-center gap-2 rounded-full border bg-card/80 py-1 pl-1 pr-3 text-sm font-medium shadow-sm backdrop-blur transition hover:bg-card"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-muted text-foreground">
                  <UserRound className="size-4" />
                </span>
                <span className="hidden sm:inline">Profile</span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </Link>
              <form action={logout} className="hidden sm:block">
                <Button variant="ghost" size="sm" type="submit">
                  Log out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
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
  );
}
