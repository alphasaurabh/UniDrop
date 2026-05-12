import { Sparkles } from "lucide-react";
import type { Metadata } from "next";

import { ListingForm } from "@/components/marketplace/listing-form";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { createListing } from "@/features/marketplace/actions";

export const metadata: Metadata = {
  title: "Sell an Item - List for Free on UniDrop Student Marketplace",
  description:
    "List items for free on UniDrop. Post your books, electronics, furniture, and more to reach verified campus students instantly. Upload photos, set your price, and start selling in minutes.",
  keywords: [
    "sell online",
    "sell items",
    "marketplace seller",
    "list for free",
    "student selling",
    "campus marketplace",
  ],
  openGraph: {
    title: "Sell on UniDrop - List Items for Free on Campus Marketplace",
    description: "Post items for sale to verified campus students. Free listing, instant visibility, and secure exchanges.",
    type: "website",
  },
};

type SellPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SellPage({ searchParams }: SellPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("id,name").order("name", { ascending: true });

  return (
    <Container className="py-8">
      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
        <div>
          <Badge variant="soft" className="gap-2 rounded-full px-4 py-2">
            <Sparkles className="size-3.5" />
            Sell product
          </Badge>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            List something worth buying.
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Create a trusted campus listing with sharp photos, clear pricing, and pickup details.
          </p>
        </div>
        <Card className="p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Publish flow</p>
          <div className="mt-4 grid gap-3">
            {[
              "Upload polished photos",
              "Set a transparent price",
              "Describe pickup details",
            ].map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-[0.9rem] border border-border/70 bg-background/60 px-4 py-3 text-sm">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <ListingForm action={createListing} error={params.error} categories={(categories ?? []) as { id: string; name: string }[]} />
    </Container>
  );
}
