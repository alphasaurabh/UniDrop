import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function MarketplaceLoading() {
  return (
    <Container className="animate-fade-in pb-24 pt-8 lg:pb-12">
      <Skeleton className="h-52 rounded-2xl" />
      <Skeleton className="mt-8 h-14 rounded-lg" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
            <Skeleton className="aspect-[4/3] rounded-none" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
