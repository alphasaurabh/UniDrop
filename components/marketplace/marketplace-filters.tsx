"use client";

import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, FormEvent } from "react";

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
  // Always reset to page 1 when filters change
  params.delete("page");
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

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = String(formData.get("q") ?? "").trim();
    
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    params.delete("page");
    
    startTransition(() => router.push(`/marketplace?${params.toString()}`));
  }

  return (
    <div className="sticky top-[72px] z-30 mb-8 border-y border-border bg-background/95 py-3 backdrop-blur-md sm:rounded-2xl sm:border sm:px-3">
      <div className="grid gap-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
        <form onSubmit={handleSearch} className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={searchParams.get("q") ?? ""}
            className="h-11 rounded-xl border-border bg-card pl-11"
            placeholder="Search items, sellers, hostels..."
          />
        </form>
        <Select
          value={searchParams.get("category") ?? "all"}
          onChange={(event) => setFilter("category", event.target.value)}
          disabled={isPending}
          aria-label="Category"
          className="h-11 rounded-xl border-border bg-card"
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
          className="h-11 rounded-xl border-border bg-card"
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
          className="h-11 rounded-xl border-border bg-card"
        >
          <option value="newest">Newest first</option>
          <option value="price-low">Price low to high</option>
          <option value="price-high">Price high to low</option>
        </Select>
        <button type="button" className="hidden h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-bold lg:flex"><SlidersHorizontal className="size-4" /> More filters</button>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground lg:hidden"><Filter className="size-3.5" /> Filters update as you browse</div>
    </div>
  );
}
