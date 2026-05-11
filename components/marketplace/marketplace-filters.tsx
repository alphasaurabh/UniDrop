"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { LISTING_CONDITIONS, formatListingConditionLabel } from "@/features/marketplace/constants";

type Category = { id: string; name: string };

function updateParams(params: URLSearchParams, key: string, value: string) {
  if (!value || value === "all" || (key === "sort" && value === "newest")) {
    params.delete(key);
  } else {
    params.set(key, value);
  }
}

type MarketplaceFiltersProps = {
  categories?: Category[];
};

export function MarketplaceFilters({ categories }: MarketplaceFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    updateParams(params, key, value);
    startTransition(() => router.push(`/marketplace?${params.toString()}`));
  }

  return (
    <div className="sticky top-24 z-30 mb-8 rounded-3xl border bg-background/82 p-3 shadow-glow backdrop-blur-2xl">
      <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px_180px]">
        <form action="/marketplace" className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={searchParams.get("q") ?? ""}
            className="pl-11"
            placeholder="Search MacBooks, books, cycles..."
          />
        </form>
        <Select
          value={searchParams.get("category") ?? "all"}
          onChange={(event) => setFilter("category", event.target.value)}
          disabled={isPending}
          aria-label="Category"
        >
          <option value="all">All categories</option>
          {(categories ?? []).map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        <Select
          value={searchParams.get("condition") ?? "all"}
          onChange={(event) => setFilter("condition", event.target.value)}
          disabled={isPending}
          aria-label="Condition"
        >
          <option value="all">Any condition</option>
          {LISTING_CONDITIONS.map((condition) => (
            <option key={condition} value={condition}>
              {formatListingConditionLabel(condition)}
            </option>
          ))}
        </Select>
        <Select
          value={searchParams.get("sort") ?? "newest"}
          onChange={(event) => setFilter("sort", event.target.value)}
          disabled={isPending}
          aria-label="Sort"
        >
          <option value="newest">Newest first</option>
          <option value="price-low">Price low to high</option>
          <option value="price-high">Price high to low</option>
        </Select>
      </div>
    </div>
  );
}
