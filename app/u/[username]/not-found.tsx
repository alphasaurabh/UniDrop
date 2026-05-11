import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function NotFound() {
  return (
    <Container className="py-16">
      <EmptyState
        icon={<User className="size-6" />}
        title="Profile not found"
        description="This seller profile doesn't exist or has been removed."
      />
      <div className="mt-8 flex justify-center">
        <Button asChild href="/marketplace">
          Browse marketplace
        </Button>
      </div>
    </Container>
  );
}
