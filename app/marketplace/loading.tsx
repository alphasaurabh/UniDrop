import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function MarketplaceLoading() {
  return (
    <Container className="py-8">
      <Skeleton className="h-40 rounded-3xl" />
      <Skeleton className="mt-8 h-20 rounded-3xl" />
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-3xl border bg-card shadow-soft">
            <Skeleton className="h-64 rounded-b-none rounded-t-3xl" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
