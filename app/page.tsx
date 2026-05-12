import {
  ArrowRight,
  BadgeCheck,
  Camera,
  HeartHandshake,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Mail,
  Linkedin,
  Github,
  Globe,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { LISTING_CATEGORIES } from "@/features/marketplace/constants";
import { createClient } from "@/lib/supabase/server";
import { generateBreadcrumbSchema, embedStructuredData } from "@/lib/seo/structured-data";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Campus-first trust",
    text: "Profiles, colleges, and local context make every exchange feel familiar.",
  },
  {
    icon: BadgeCheck,
    title: "Verified community",
    text: "Built around student identities instead of anonymous marketplace noise.",
  },
  {
    icon: HeartHandshake,
    title: "Designed for handoff",
    text: "Find, save, message, and coordinate around the places students already meet.",
  },
];

async function getTotalActiveListings() {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("listings")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  if (error) {
    return 0;
  }

  return count ?? 0;
}

export const metadata: Metadata = {
  title: "UniDrop - Student Marketplace for Campus Trading | Buy & Sell Verified Locally",
  description:
    "UniDrop is a trusted student marketplace for buying and selling items at Gautam Buddha University. Join verified students trading locally with campus-first trust, premium photos, and secure exchanges.",
  keywords: [
    "student marketplace",
    "college marketplace",
    "campus marketplace",
    "buy and sell in college",
    "GBU marketplace",
    "second hand items",
    "college exchange",
    "campus trading",
  ],
  openGraph: {
    title: "UniDrop - Student Marketplace for Campus Trading",
    description:
      "Buy and sell verified items across campus. UniDrop is the premium student marketplace for Gautam Buddha University.",
    type: "website",
    images: [
      {
        url: "https://unidrop.app/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  other: {
    ...embedStructuredData(
      generateBreadcrumbSchema([
        { name: "Home", url: "https://unidrop.app" },
      ])
    ).other,
  },
};

export default async function HomePage() {
  const totalActiveListings = await getTotalActiveListings();

  return (
    <>
      <section className="relative overflow-hidden pt-8 sm:pt-12">
        <div className="absolute inset-x-0 top-0 -z-10 h-[720px] premium-grid opacity-70" />
        <Container>
          <div className="grid items-center gap-10 py-8 lg:grid-cols-[1.03fr_0.97fr] lg:py-14">
            <FadeIn className="max-w-3xl">
              <Badge variant="soft" className="mb-6 gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.2em]">
                <Sparkles className="size-3.5" />
                Premium campus marketplace
              </Badge>
              <h1 className="font-display text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-7xl lg:text-[5.25rem] lg:leading-[0.95]">
                Buy. Sell. Repeat.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                UniDrop is a beautifully minimal student marketplace with the trust, polish, and feel of a premium social app.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild href="/marketplace" size="lg">
                  Explore marketplace
                  <ArrowRight className="size-4" />
                </Button>
                <Button asChild href="/sell" variant="outline" size="lg">
                  List an item
                </Button>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  ["Verified sellers", "Campus identities"],
                  ["Fast listings", "Upload in minutes"],
                  ["Local exchange", "Meet near class"],
                ].map(([title, value]) => (
                  <Card key={title} className="p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
                    <p className="mt-2 text-lg font-semibold tracking-tight">{value}</p>
                  </Card>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.12} className="relative">
              <div className="surface-elevated relative overflow-hidden p-4 sm:p-5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                <div className="relative grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[1.2rem] border border-border/70 bg-background/65 p-5 shadow-soft backdrop-blur-xl">
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Featured now</p>
                      <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight">
                        Modern student essentials, photographed well.
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        Discover premium listings, save what matters, and browse with less noise.
                      </p>
                    </div>
                    <div className="rounded-[1.2rem] border border-border/70 bg-card/85 p-5 shadow-soft backdrop-blur-xl">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Momentum</span>
                        <TrendingUp className="size-4 text-primary" />
                      </div>
                      <p className="mt-5 font-display text-4xl font-semibold tracking-tight">{totalActiveListings}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        total active {totalActiveListings === 1 ? "listing" : "listings"}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.2rem] border border-border/70 bg-card/80 p-4 shadow-soft backdrop-blur-xl">
                      <div className="flex items-start gap-4">
                        <div className="grid size-12 place-items-center text-primary">
                          <Camera className="size-5" />
                        </div>
                        <div>
                          <p className="font-semibold">Image-first feed</p>
                          <p className="mt-1 text-sm text-muted-foreground">Immersive listings that feel closer to a curated storefront than a classifieds board.</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[1.2rem] border border-border/70 bg-card/80 p-4 shadow-soft backdrop-blur-xl">
                      <div className="flex items-start gap-4">
                        <div className="grid size-12 place-items-center text-primary">
                          <PackageCheck className="size-5" />
                        </div>
                        <div>
                          <p className="font-semibold">Campus trust</p>
                          <p className="mt-1 text-sm text-muted-foreground">Designed for real students, real handoffs, and cleaner exchange flows.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      <section className="py-8 sm:py-12">
        <Container>
          <FadeIn className="surface-panel p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Browse by category</p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Everything students trade, presented with more calm.</h2>
              </div>
              <Button asChild href="/marketplace" variant="outline" className="self-start">
                Open marketplace
              </Button>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {LISTING_CATEGORIES.map((category) => (
                <a
                  key={category}
                  href={`/marketplace?category=${encodeURIComponent(category)}`}
                  className="group rounded-[1.1rem] border border-border/70 bg-background/60 p-5 shadow-soft backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-elevated"
                >
                  <PackageCheck className="size-6 text-primary transition group-hover:scale-105" />
                  <p className="mt-5 text-lg font-semibold tracking-tight">{category}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Browse live listings with a premium feed experience.</p>
                </a>
              ))}
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="py-8 sm:py-12">
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            {trustItems.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.06}>
                <Card className="h-full p-7">
                  <item.icon className="size-7 text-primary" />
                  <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{item.text}</p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-8 sm:py-12">
        <Container>
          <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
            <FadeIn>
              <div className="lg:sticky lg:top-28">
                <Badge variant="soft" className="mb-4 rounded-full px-4 py-2">How it works</Badge>
                <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  Designed for students who want the fastest path from browse to handoff.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
                  Browse by image, save what you want, and move through the exchange with less friction.
                </p>
              </div>
            </FadeIn>
            <div className="space-y-4">
              {[
                ["Post in minutes", "Upload photos, write a concise description, and publish with clear pickup details."],
                ["Browse with intention", "Filter by category, condition, and price to find the right item faster."],
                ["Meet locally", "Coordinate around familiar campus locations with a calmer exchange flow."],
              ].map(([title, text], index) => (
                <FadeIn key={title} delay={index * 0.06}>
                  <Card className="flex gap-5 p-6 sm:p-7">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-tight">{title}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p>
                    </div>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-8 sm:py-12">
        <Container>
          <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
            <FadeIn>
              <div className="lg:sticky lg:top-28">
                <Badge variant="soft" className="mb-4 rounded-full px-4 py-2">Campus activity</Badge>
                <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  Real students, real feedback, real marketplace momentum.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
                  See what&apos;s happening on UniDrop right now. Listings, sales, and community feedback from verified students.
                </p>
              </div>
            </FadeIn>
            <div>
              <ActivityFeed limit={6} />
            </div>
          </div>
        </Container>
      </section>

      <footer className="border-t border-border/70 py-10">
        <Container>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Image src="/logo.svg" alt="UniDrop" width={40} height={40} className="h-10 w-10 shrink-0 object-contain" />
                <div>
                  <p className="font-display text-lg font-semibold">UniDrop</p>
                  <p className="text-sm text-muted-foreground">Premium campus marketplace</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Built for campus trust and polished mobile-first browsing.</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Quick links</h3>
              <ul className="grid gap-2 text-sm text-muted-foreground">
                <li><Link href="/terms" className="hover:underline">Terms &amp; Conditions</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold">About the Creator</h3>
              <p className="text-sm text-muted-foreground">UniDrop was created by Saurabh Chandravanshi. Built to make campus buying and selling simpler, safer, and more modern for students.</p>

              <h4 className="mt-3 text-sm font-semibold">Connect</h4>
              <div className="flex flex-wrap items-center gap-3">
                <a href="mailto:chandravanshisaurabh25@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:underline">
                  <Mail className="size-4" /> chandravanshisaurabh25@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <a href="https://www.linkedin.com/in/chandravanshisaurabh/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <Linkedin className="size-5" />
                </a>
                <a href="https://github.com/alphasaurabh" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <Github className="size-5" />
                </a>
                <a href="https://www.saurabhdev.me" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <Globe className="size-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-border/50 pt-6 text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p>© {new Date().getFullYear()} UniDrop. Crafted by Saurabh Chandravanshi.</p>
            <p className="text-xs text-muted-foreground">UniDrop is a student marketplace platform. All transactions occur between users.</p>
          </div>
        </Container>
      </footer>
    </>
  );
}
