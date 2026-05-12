import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Terms & Conditions - UniDrop Student Marketplace",
  description:
    "Read UniDrop's complete terms and conditions for using our student marketplace platform, including user responsibilities, prohibited activities, and dispute policies.",
  openGraph: {
    title: "Terms & Conditions - UniDrop",
    description: "UniDrop marketplace terms and conditions for students.",
  },
};

type TermsSection = {
  id: string;
  title: string;
  paragraphs: string[];
  listItems?: string[];
  listLeadIn?: string;
};

const sections: TermsSection[] = [
  {
    id: "about-unidrop",
    title: "1. About UniDrop",
    paragraphs: [
      "UniDrop is a student-focused marketplace platform that allows users to buy, sell, and exchange products within their college community. UniDrop only provides the platform infrastructure for users to connect. UniDrop is not a buyer, seller, reseller, distributor, or owner of the products listed by users.",
    ],
  },
  {
    id: "user-responsibility",
    title: "2. User Responsibility",
    paragraphs: ["Users are fully responsible for:"],
    listItems: [
      "the listings they publish",
      "product descriptions",
      "uploaded images",
      "pricing",
      "communication with buyers/sellers",
      "product condition",
      "transaction safety",
      "meeting arrangements",
      "payments and exchanges",
    ],
    listLeadIn: "Users must ensure that all information they provide is accurate and lawful.",
  },
  {
    id: "transaction-risk",
    title: "3. No Responsibility for Transactions",
    paragraphs: [
      "UniDrop does not participate in transactions between users. By using the platform, you acknowledge and agree that UniDrop does not guarantee the quality, safety, authenticity, legality, or availability of any item. UniDrop is not responsible for scams, fraud, failed transactions, misleading listings, or damaged products. UniDrop does not verify every listing or seller. Users transact entirely at their own risk.",
      "UniDrop shall not be liable for financial losses, disputes between users, delivery issues, payment disputes, product defects, misleading information, personal injury, theft or fraud.",
      "Users are strongly advised to meet in safe public locations, verify products before payment, avoid suspicious listings, and use caution during transactions.",
    ],
  },
  {
    id: "prohibited-activities",
    title: "4. Prohibited Content & Activities",
    paragraphs: ["Users may not:"],
    listItems: [
      "post illegal products",
      "upload harmful or abusive content",
      "impersonate another person",
      "post fake or misleading listings",
      "spam the platform",
      "attempt fraud or scams",
      "violate intellectual property rights",
      "harass other users",
      "upload explicit or offensive material",
      "misuse the platform in any unlawful manner",
    ],
    listLeadIn: "UniDrop reserves the right to remove listings, suspend accounts, or restrict access without prior notice.",
  },
  {
    id: "college-email",
    title: "5. College Email Verification",
    paragraphs: [
      "Certain features may require verification using a valid college email address. UniDrop may restrict platform access to approved educational institutions. Verification only confirms ownership of the email domain and does not guarantee user identity, trustworthiness, or legitimacy.",
    ],
  },
  {
    id: "user-content",
    title: "6. User Content",
    paragraphs: [
      "Users retain ownership of the content they upload. By posting content on UniDrop, users grant UniDrop a non-exclusive license to display, store, and distribute that content for platform operation and promotional purposes. Users are solely responsible for the content they upload.",
    ],
  },
  {
    id: "availability",
    title: "7. Platform Availability",
    paragraphs: ["UniDrop may modify, suspend, or discontinue any part of the platform at any time without notice. We do not guarantee uninterrupted or error-free service."],
  },
  {
    id: "liability",
    title: "8. Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by law: UniDrop, its owners, developers, affiliates, and operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from use of the platform or inability to access the platform. All use of UniDrop is at the user’s own risk.",
    ],
  },
  {
    id: "privacy",
    title: "9. Privacy",
    paragraphs: [
      "UniDrop may collect and store user information necessary for authentication, platform functionality, analytics, moderation, and security. By using UniDrop, you consent to the collection and processing of such information. A separate Privacy Policy may further explain data handling practices.",
    ],
  },
  {
    id: "reporting",
    title: "10. Reporting & Moderation",
    paragraphs: [
      "Users may report listings or behavior that violate platform rules. UniDrop reserves the right to review reports, remove content, suspend users, and cooperate with legal authorities when necessary. However, UniDrop is not obligated to actively monitor every listing or interaction.",
    ],
  },
  {
    id: "changes",
    title: "11. Changes to Terms",
    paragraphs: ["UniDrop may update these Terms & Conditions at any time. Continued use of the platform after updates constitutes acceptance of the revised terms."],
  },
  {
    id: "contact",
    title: "12. Contact",
    paragraphs: ["For questions, reports, or concerns regarding these Terms & Conditions, users may contact the UniDrop team through the platform."],
  },
  {
    id: "acceptance",
    title: "13. Acceptance of Terms",
    paragraphs: [
      "By accessing or using UniDrop, you acknowledge that you have read these Terms & Conditions, you understand them, and you agree to be legally bound by them. If you do not agree with these terms, you should not use UniDrop.",
    ],
  },
];

export default function TermsPage() {
  return (
    <Container className="py-6 sm:py-10 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/95 shadow-elevated backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.05),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.05),_transparent_34%)]" />
          <div className="relative">
            <main className="p-5 sm:p-6 lg:p-8 xl:p-10">
              <header className="space-y-6 border-b border-border/60 pb-8">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="soft" className="rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.18em]">
                    Legal document
                  </Badge>
                  <Badge variant="soft" className="rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.18em]">
                    Last updated: May 2026
                  </Badge>
                </div>

                <div className="max-w-4xl space-y-4">
                  <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                    UniDrop Terms & Conditions
                  </h1>
                  <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                    Welcome to UniDrop.
                  </p>
                  <p className="max-w-4xl text-sm leading-7 text-muted-foreground sm:text-base">
                    These Terms &amp; Conditions govern your use of the UniDrop platform, including the website, marketplace services, listings, and related features. By accessing or using UniDrop, you agree to these terms.
                  </p>
                </div>
              </header>

              <div className="mt-8 space-y-5">
                {sections.map((section, index) => (
                  <article
                    key={section.id}
                    id={section.id}
                    className="group scroll-mt-28 rounded-[1.75rem] border border-border/50 bg-card/92 p-5 shadow-soft backdrop-blur-xl sm:p-6 lg:p-8"
                  >
                    <div className="mb-5 flex items-start gap-4">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                          <span>Section {String(index + 1).padStart(2, "0")}</span>
                        </div>
                        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
                          {section.title}
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-4 text-sm leading-7 text-muted-foreground sm:text-[15px]">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}

                      {section.listItems ? (
                        <div className="rounded-2xl border border-border/50 bg-background/55 p-4 sm:p-5">
                          {section.listLeadIn ? <p className="mb-4 text-foreground">{section.listLeadIn}</p> : null}
                          <ul className="grid gap-2 pl-5">
                            {section.listItems.map((item) => (
                              <li key={item} className="list-disc">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {section.listLeadIn && !section.listItems ? <p className="text-foreground">{section.listLeadIn}</p> : null}
                    </div>
                  </article>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </Container>
  );
}
