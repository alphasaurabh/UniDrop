import { Sparkles } from "lucide-react";

import { ListingForm } from "@/components/marketplace/listing-form";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { createListing } from "@/features/marketplace/actions";

export const metadata = {
  title: "Sell",
};

type SellPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SellPage({ searchParams }: SellPageProps) {
  const params = await searchParams;

  return (
    <Container className="py-8">
      <div className="mb-8">
        <Badge variant="soft" className="gap-2">
          <Sparkles className="size-3.5" />
          Sell Product
        </Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          List something worth buying.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Create a trusted campus listing with sharp photos, clear pricing, and pickup details.
        </p>
      </div>

      <ListingForm action={createListing} error={params.error} />
    </Container>
  );
}
