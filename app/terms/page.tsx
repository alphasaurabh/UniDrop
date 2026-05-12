import type { Metadata } from "next";
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

export default function TermsPage() {
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-semibold">UniDrop Terms & Conditions</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: May 2026</p>

        <section className="mt-6 space-y-4">
          <p>Welcome to UniDrop.</p>
          <p>
            These Terms &amp; Conditions govern your use of the UniDrop platform, including the website, marketplace
            services, listings, and related features. By accessing or using UniDrop, you agree to these terms.
          </p>

          <h2 className="mt-6 text-xl font-semibold">1. About UniDrop</h2>
          <p>
            UniDrop is a student-focused marketplace platform that allows users to buy, sell, and exchange products
            within their college community. UniDrop only provides the platform infrastructure for users to connect.
            UniDrop is not a buyer, seller, reseller, distributor, or owner of the products listed by users.
          </p>

          <h2 className="mt-6 text-xl font-semibold">2. User Responsibility</h2>
          <p>Users are fully responsible for:</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            <li>the listings they publish</li>
            <li>product descriptions</li>
            <li>uploaded images</li>
            <li>pricing</li>
            <li>communication with buyers/sellers</li>
            <li>product condition</li>
            <li>transaction safety</li>
            <li>meeting arrangements</li>
            <li>payments and exchanges</li>
          </ul>
          <p>Users must ensure that all information they provide is accurate and lawful.</p>

          <h2 className="mt-6 text-xl font-semibold">3. No Responsibility for Transactions</h2>
          <p>
            UniDrop does not participate in transactions between users. By using the platform, you acknowledge and
            agree that UniDrop does not guarantee the quality, safety, authenticity, legality, or availability of any
            item. UniDrop is not responsible for scams, fraud, failed transactions, misleading listings, or damaged
            products. UniDrop does not verify every listing or seller. Users transact entirely at their own risk.
          </p>
          <p>UniDrop shall not be liable for financial losses, disputes between users, delivery issues, payment disputes, product defects, misleading information, personal injury, theft or fraud.</p>
          <p>Users are strongly advised to meet in safe public locations, verify products before payment, avoid suspicious listings, and use caution during transactions.</p>

          <h2 className="mt-6 text-xl font-semibold">4. Prohibited Content &amp; Activities</h2>
          <p>Users may not:</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            <li>post illegal products</li>
            <li>upload harmful or abusive content</li>
            <li>impersonate another person</li>
            <li>post fake or misleading listings</li>
            <li>spam the platform</li>
            <li>attempt fraud or scams</li>
            <li>violate intellectual property rights</li>
            <li>harass other users</li>
            <li>upload explicit or offensive material</li>
            <li>misuse the platform in any unlawful manner</li>
          </ul>
          <p>UniDrop reserves the right to remove listings, suspend accounts, or restrict access without prior notice.</p>

          <h2 className="mt-6 text-xl font-semibold">5. College Email Verification</h2>
          <p>
            Certain features may require verification using a valid college email address. UniDrop may restrict
            platform access to approved educational institutions. Verification only confirms ownership of the email
            domain and does not guarantee user identity, trustworthiness, or legitimacy.
          </p>

          <h2 className="mt-6 text-xl font-semibold">6. User Content</h2>
          <p>
            Users retain ownership of the content they upload. By posting content on UniDrop, users grant UniDrop a
            non-exclusive license to display, store, and distribute that content for platform operation and promotional
            purposes. Users are solely responsible for the content they upload.
          </p>

          <h2 className="mt-6 text-xl font-semibold">7. Platform Availability</h2>
          <p>UniDrop may modify, suspend, or discontinue any part of the platform at any time without notice. We do not guarantee uninterrupted or error-free service.</p>

          <h2 className="mt-6 text-xl font-semibold">8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law: UniDrop, its owners, developers, affiliates, and operators shall not
            be liable for any indirect, incidental, special, consequential, or punitive damages arising from use of the
            platform or inability to access the platform. All use of UniDrop is at the user’s own risk.
          </p>

          <h2 className="mt-6 text-xl font-semibold">9. Privacy</h2>
          <p>
            UniDrop may collect and store user information necessary for authentication, platform functionality,
            analytics, moderation, and security. By using UniDrop, you consent to the collection and processing of
            such information. A separate Privacy Policy may further explain data handling practices.
          </p>

          <h2 className="mt-6 text-xl font-semibold">10. Reporting &amp; Moderation</h2>
          <p>
            Users may report listings or behavior that violate platform rules. UniDrop reserves the right to review
            reports, remove content, suspend users, and cooperate with legal authorities when necessary. However,
            UniDrop is not obligated to actively monitor every listing or interaction.
          </p>

          <h2 className="mt-6 text-xl font-semibold">11. Changes to Terms</h2>
          <p>UniDrop may update these Terms &amp; Conditions at any time. Continued use of the platform after updates constitutes acceptance of the revised terms.</p>

          <h2 className="mt-6 text-xl font-semibold">12. Contact</h2>
          <p>For questions, reports, or concerns regarding these Terms &amp; Conditions, users may contact the UniDrop team through the platform.</p>

          <h2 className="mt-6 text-xl font-semibold">13. Acceptance of Terms</h2>
          <p>
            By accessing or using UniDrop, you acknowledge that you have read these Terms &amp; Conditions, you
            understand them, and you agree to be legally bound by them. If you do not agree with these terms, you
            should not use UniDrop.
          </p>
        </section>
      </div>
    </Container>
  );
}
