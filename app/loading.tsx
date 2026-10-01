import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container className="animate-fade-in pb-24 pt-8 lg:pb-12" aria-busy="true" aria-label="Loading UniDrop">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.75fr] lg:items-end">
        <div className="space-y-5">
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-20 w-full max-w-2xl rounded-lg sm:h-28" />
          <Skeleton className="h-5 w-full max-w-xl rounded" />
          <Skeleton className="h-14 w-full max-w-xl rounded-xl" />
        </div>
        <Skeleton className="hidden min-h-[250px] rounded-2xl lg:block" />
      </div>
      <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="mt-14 space-y-5">
        <Skeleton className="h-8 w-64 rounded" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
    </Container>
  );
}
