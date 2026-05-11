"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  ChevronDown,
  Home,
  LogOut,
  Menu,
  Plus,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { logout } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navItems = [
  { href: "/marketplace", label: "Marketplace", icon: Home },
  { href: "/sell", label: "Sell", icon: Plus },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/account", label: "Account", icon: User },
];

type NavbarClientProps = {
  isAuthenticated: boolean;
};

export function NavbarClient({ isAuthenticated }: NavbarClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  function closeAllMenus() {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  }

  useEffect(() => {
    closeAllMenus();
  }, [pathname, searchParams]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setIsProfileOpen(false);
      }

      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeAllMenus();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <header className="sticky top-4 z-50 hidden lg:block">
        <Container>
          <div className="glass-nav relative flex items-center justify-between px-5 py-3">
            <Link className="flex items-center gap-3 font-semibold tracking-tight" href="/">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-soft">
                UD
              </span>
              <span className="font-display text-lg">UniDrop</span>
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
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    aria-haspopup="menu"
                    aria-label="Open profile menu"
                    className="list-none flex cursor-pointer items-center gap-2 rounded-2xl border border-border/70 bg-card/75 px-3 py-2 text-sm font-medium shadow-soft backdrop-blur-xl transition-colors hover:bg-muted/40"
                  >
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="size-4" />
                    </span>
                    <span>Profile</span>
                    <ChevronDown className={`size-3.5 text-muted-foreground transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen ? (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.985 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-3 w-56 rounded-3xl border border-border/70 bg-card/95 p-2 shadow-elevated backdrop-blur-2xl"
                      >
                        <div className="grid gap-1">
                          <Link
                            className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm transition hover:bg-muted/70"
                            href="/profile"
                            onClick={closeAllMenus}
                          >
                            <User className="size-4" />
                            My Profile
                          </Link>
                          <Link
                            className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm transition hover:bg-muted/70"
                            href="/account"
                            onClick={closeAllMenus}
                          >
                            <ShoppingBag className="size-4" />
                            Seller Dashboard
                          </Link>
                          <Link
                            className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm transition hover:bg-muted/70"
                            href="/saved"
                            onClick={closeAllMenus}
                          >
                            <Bookmark className="size-4" />
                            Saved Listings
                          </Link>
                          <div className="rounded-2xl border border-border/60 bg-background/50 p-1">
                            <ThemeToggle className="w-full justify-between rounded-xl border-0 bg-transparent px-3 py-2.5 shadow-none hover:bg-muted/70" showLabel />
                          </div>
                          <div className="border-t border-border/50" />
                          <form action={logout} className="p-1">
                            <Button
                              variant="outline"
                              size="sm"
                              type="submit"
                              className="w-full justify-start gap-2"
                              onClick={closeAllMenus}
                            >
                              <LogOut className="size-4" />
                              Log out
                            </Button>
                          </form>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
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

      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-lg lg:hidden">
        <Container>
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <Link className="flex items-center gap-2 font-semibold" href="/">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                UD
              </span>
            </Link>

            <div className="flex flex-1 items-center justify-center gap-2">
              <span className="font-display text-sm font-semibold">UniDrop</span>
            </div>

            <div className="flex items-center gap-1" ref={mobileMenuRef}>
              <ThemeToggle className="h-9 px-2.5 py-2" />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-label="Open mobile menu"
                className="rounded-lg p-2 transition hover:bg-muted/70"
              >
                {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>

              <AnimatePresence>
                {isMobileMenuOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.985 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border/70 bg-card/98 p-3 shadow-elevated backdrop-blur-lg"
                  >
                    <div className="grid gap-2">
                      <Link
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted/70"
                        href="/marketplace"
                        onClick={closeAllMenus}
                      >
                        <Search className="size-4" />
                        Browse marketplace
                      </Link>
                      <Link
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted/70"
                        href="/sell"
                        onClick={closeAllMenus}
                      >
                        <ShoppingBag className="size-4" />
                        Sell an item
                      </Link>
                      <Link
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted/70"
                        href="/saved"
                        onClick={closeAllMenus}
                      >
                        <Bookmark className="size-4" />
                        Saved items
                      </Link>
                      <div className="rounded-lg border border-border/60 bg-background/50 p-1">
                        <ThemeToggle className="w-full justify-between rounded-lg border-0 bg-transparent px-2 py-2 shadow-none hover:bg-muted/70" showLabel />
                      </div>
                      {isAuthenticated ? (
                        <>
                          <Link
                            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted/70"
                            href="/account"
                            onClick={closeAllMenus}
                          >
                            <User className="size-4" />
                            My listings
                          </Link>
                          <form action={logout} className="mt-2 border-t border-border/70 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              type="submit"
                              className="w-full justify-start gap-2"
                              onClick={closeAllMenus}
                            >
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
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </Container>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center pointer-events-none lg:hidden">
        <div className="pointer-events-auto floating-bottom-nav glass-nav grid grid-cols-4 gap-1 px-3 py-2 shadow-elevated touch-target">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 transition-transform active:scale-95"
                title={item.label}
                onClick={closeAllMenus}
              >
                <div className="relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors group-hover:bg-primary/10">
                  <Icon className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-foreground">
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
