import {
  ArrowRight,
  BadgeCheck,
  HeartHandshake,
  PackageCheck,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { LISTING_CATEGORIES } from "@/features/marketplace/constants";
import { testimonials } from "@/lib/demo-data";

const trustItems = [
  { icon: ShieldCheck, title: "Campus-first trust", text: "Profiles, colleges, and local context make every exchange feel familiar." },
  { icon: BadgeCheck, title: "Verified community", text: "Built around student identities instead of anonymous marketplace noise." },
  { icon: HeartHandshake, title: "Designed for handoff", text: "Find, save, message, and coordinate around the places students already meet." },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden pb-14 pt-16 sm:pt-24">
        <div className="absolute inset-x-0 top-0 -z-10 h-[620px] premium-grid opacity-80" />
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
            <FadeIn className="max-w-3xl">
              <Badge variant="soft" className="mb-5 gap-2 rounded-full bg-white/70">
                <Sparkles className="size-3.5" />
                Trusted campus marketplace for students
              </Badge>
              <h1 className="text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-7xl">
                Buy less randomly. Sell more confidently.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                CampusLoop turns college buying and selling into a polished marketplace built
                around trust, campus context, and beautifully simple exchange.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild href="/marketplace" size="lg">
                  Explore marketplace
                  <ArrowRight className="size-4" />
                </Button>
                <Button asChild href="/sell" variant="outline" size="lg">
                  Sell an item
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.12} className="relative">
              <div className="absolute -left-8 top-10 hidden rounded-3xl border bg-white/80 p-4 shadow-glow backdrop-blur md:block">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-primary">
                    <Search className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Search by campus</p>
                    <p className="text-xs text-muted-foreground">MacBook · Books · Cycles</p>
                  </div>
                </div>
              </div>
              <Card className="p-6 sm:p-8">
                <div className="rounded-3xl border bg-muted/40 p-6">
                  <p className="text-sm font-semibold text-primary">Live marketplace</p>
                  <p className="mt-3 text-4xl font-semibold tracking-tight">
                    Real listings from verified GBU students.
                  </p>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    Browse products, compare prices, save items, and manage your own seller dashboard.
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {["Upload photos", "Filter by category", "Save listings", "Mark as sold"].map((item) => (
                    <div key={item} className="rounded-2xl border bg-white/70 p-4 text-sm font-medium">
                      {item}
                    </div>
                  ))}
                </div>
              </Card>
            </FadeIn>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <FadeIn className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">Featured listings</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Campus finds that feel curated.
              </h2>
            </div>
            <Button asChild href="/marketplace" variant="outline" className="hidden sm:inline-flex">
              View all
            </Button>
          </FadeIn>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {["Electronics", "Books", "Cycles"].map((category, index) => (
              <FadeIn key={category} delay={index * 0.06}>
                <Card className="p-6">
                  <p className="text-sm font-semibold text-primary">{category}</p>
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight">
                    Find campus-ready deals.
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Open the marketplace to see current products posted by verified students.
                  </p>
                  <Button asChild href={`/marketplace?category=${encodeURIComponent(category)}`} variant="outline" className="mt-6">
                    Browse {category}
                  </Button>
                </Card>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <FadeIn>
            <div className="rounded-[2rem] border bg-[#fffaf0]/78 p-6 shadow-soft backdrop-blur sm:p-8">
              <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-primary">Popular categories</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">Everything students trade.</h2>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {LISTING_CATEGORIES.map((category) => (
                  <div
                    key={category}
                    className="group rounded-3xl border bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
                  >
                    <PackageCheck className="size-6 text-primary" />
                    <p className="mt-5 font-semibold">{category}</p>
                    <p className="text-sm text-muted-foreground">Browse live listings</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            {trustItems.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.07}>
                <Card className="h-full p-7">
                  <item.icon className="size-7 text-primary" />
                  <h3 className="mt-6 text-xl font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{item.text}</p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <FadeIn>
              <div className="sticky top-28">
                <p className="text-sm font-semibold text-primary">How it works</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  List it, save it, meet on campus.
                </h2>
              </div>
            </FadeIn>
            <div className="space-y-4">
              {[
                ["Post in minutes", "Upload photos, choose a category, set a price, and publish to your campus."],
                ["Browse with intent", "Search by item, filter by condition, and save the listings worth revisiting."],
                ["Exchange locally", "Coordinate around libraries, dorms, quads, and student centers."],
              ].map(([title, text], index) => (
                <FadeIn key={title} delay={index * 0.06}>
                  <Card className="flex gap-5 p-6">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
                    </div>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <FadeIn key={testimonial.name} delay={index * 0.08}>
                <Card className="h-full p-7">
                  <p className="text-lg leading-8">“{testimonial.quote}”</p>
                  <p className="mt-6 font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.detail}</p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-16 pt-10">
        <Container>
          <FadeIn>
            <div className="overflow-hidden rounded-[2rem] border bg-foreground p-8 text-background shadow-glow sm:p-12">
              <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                <div>
                  <PackageCheck className="mb-5 size-8 text-emerald-200" />
                  <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
                    The marketplace your campus deserved.
                  </h2>
                  <p className="mt-4 max-w-2xl text-background/70">
                    A focused, premium product for student-to-student buying and selling.
                  </p>
                </div>
                <Button asChild href="/signup" size="lg" variant="outline" className="border-white/20 bg-white text-foreground hover:bg-white">
                  Join CampusLoop
                </Button>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      <footer className="border-t py-8">
        <Container className="flex flex-col justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>CampusLoop · Premium college marketplace</p>
          <p>Marketplace only. Built for campus trust.</p>
        </Container>
      </footer>
    </>
  );
}
