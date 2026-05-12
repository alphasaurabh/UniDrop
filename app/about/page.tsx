import Link from "next/link";
import type { Metadata } from "next";
import { BadgeCheck, HeartHandshake, Sparkles } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "About UniDrop - Student Campus Marketplace Platform",
  description:
    "Learn about UniDrop, a premium student marketplace built for campus communities. Discover our mission, values, and how we're transforming campus commerce.",
  openGraph: {
    title: "About UniDrop - Campus Student Marketplace",
    description: "UniDrop is reimagining how students buy and sell on campus with trust, design, and community.",
  },
};

export default function AboutPage() {
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-3xl">
        {/* Hero Section */}
        <div className="mb-16">
          <FadeIn>
            <Badge variant="soft" className="mb-4 rounded-full px-4 py-2">
              <Sparkles className="size-3.5 mr-2" />
              About UniDrop
            </Badge>
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              A campus marketplace built for students, by students.
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              UniDrop reimagines college commerce by combining the trust of verified student identities, the polish of
              premium design, and a marketplace built around real campus exchange patterns.
            </p>
          </FadeIn>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl font-semibold tracking-tight mb-6">Our Mission</h2>
            <p className="text-lg leading-8 text-muted-foreground mb-6">
              We believe that buying and selling within a college community should be more trustworthy, more beautiful,
              and more human than anonymous internet marketplaces.
            </p>
            <p className="text-lg leading-8 text-muted-foreground">
              UniDrop makes campus commerce frictionless by building a marketplace around student identities, campus
              locations, and real exchange flows—not against them.
            </p>
          </FadeIn>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <FadeIn delay={0.2}>
            <h2 className="font-display text-3xl font-semibold tracking-tight mb-8">Our Values</h2>
            <div className="grid gap-6">
              <Card className="p-6">
                <div className="flex gap-4">
                  <BadgeCheck className="size-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Trust First</h3>
                    <p className="text-muted-foreground">
                      Verification through college email addresses and student profiles creates a community where everyone
                      has something to lose by misbehaving.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex gap-4">
                  <Sparkles className="size-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Design Matters</h3>
                    <p className="text-muted-foreground">
                      A marketplace shouldn&apos;t feel like classified ads from 2005. We&apos;ve built something that feels premium,
                      modern, and respectful of your time.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex gap-4">
                  <HeartHandshake className="size-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Community Focused</h3>
                    <p className="text-muted-foreground">
                      We&apos;re not trying to disrupt everything. We&apos;re building a platform that works with campus life, not
                      against it—around places students already gather and exchange happens naturally.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </FadeIn>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <FadeIn delay={0.3}>
            <h2 className="font-display text-3xl font-semibold tracking-tight mb-8">By The Numbers</h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              <Card className="p-6 text-center">
                <p className="text-3xl font-semibold text-primary">1000+</p>
                <p className="mt-2 text-sm text-muted-foreground">Active Listings</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-3xl font-semibold text-primary">500+</p>
                <p className="mt-2 text-sm text-muted-foreground">Verified Users</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-3xl font-semibold text-primary">1</p>
                <p className="mt-2 text-sm text-muted-foreground">Campus</p>
              </Card>
            </div>
          </FadeIn>
        </div>

        {/* Call to Action */}
        <FadeIn delay={0.4}>
          <div className="surface-panel p-8 rounded-2xl text-center">
            <h3 className="font-display text-2xl font-semibold mb-3">Ready to Join?</h3>
            <p className="text-muted-foreground mb-6">
              Start buying and selling on UniDrop today. Join verified students in your campus community.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/marketplace" className="inline-flex items-center px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                Browse Marketplace
              </Link>
              <Link href="/sell" className="inline-flex items-center px-6 py-2 rounded-lg border border-border hover:bg-accent font-medium">
                Start Selling
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </Container>
  );
}
