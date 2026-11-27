import Link from "next/link";

import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border/70 bg-background/70">
      <Container className="flex flex-col items-center justify-between gap-4 py-6 pb-24 text-sm text-muted-foreground sm:flex-row lg:pb-6">
        <p>UniDrop | Campus marketplace</p>
        <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link href="/terms" className="transition-colors hover:text-foreground">
            Terms &amp; Conditions
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            Privacy Policy
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
