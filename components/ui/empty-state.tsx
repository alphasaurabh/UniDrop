import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
};

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center px-6 py-14 text-center sm:px-10">
      {icon ? (
        <div className="mb-5 grid size-14 place-items-center rounded-full border border-primary/15 bg-primary/10 text-primary">
          {icon}
        </div>
      ) : null}
      <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">{description}</p>
    </Card>
  );
}
