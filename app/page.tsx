import {
  ArrowRight,
  BadgeCheck,
  Camera,
  HeartHandshake,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { LISTING_CATEGORIES } from "@/features/marketplace/constants";
import { testimonials } from "@/lib/demo-data";

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

export default function HomePage() {
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
                A calmer way to buy, sell, and discover on campus.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                CampusLoop is a beautifully minimal student marketplace with the trust, polish, and mobility of a premium consumer product.
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
                      <p className="mt-5 font-display text-4xl font-semibold tracking-tight">128</p>
                      <p className="mt-1 text-sm text-muted-foreground">live items this week</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.2rem] border border-border/70 bg-card/80 p-4 shadow-soft backdrop-blur-xl">
                      <div className="flex items-start gap-4">
                        <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
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
                        <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
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
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <FadeIn key={testimonial.name} delay={index * 0.08}>
                <Card className="h-full p-7">
                  <p className="text-lg leading-8 text-foreground/90">“{testimonial.quote}”</p>
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
            <div className="surface-elevated overflow-hidden px-7 py-8 sm:px-10 sm:py-12">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <Badge variant="soft" className="mb-4 rounded-full px-4 py-2">Ready for launch</Badge>
                  <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
                    CampusLoop should feel premium the moment it opens.
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                    This is a focused marketplace for real student exchange, rebuilt to feel calm, trustworthy, and launch-ready.
                  </p>
                </div>
                <Button asChild href="/signup" size="lg">
                  Join CampusLoop
                </Button>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      <footer className="border-t border-border/70 py-8">
        <Container className="flex flex-col justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>CampusLoop · Premium college marketplace</p>
          <p>Built for campus trust and polished mobile-first browsing.</p>
        </Container>
      </footer>
    </>
  );
}
