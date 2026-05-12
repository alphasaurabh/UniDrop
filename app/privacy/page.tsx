import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Privacy Policy - UniDrop Student Marketplace",
  description:
    "Learn how UniDrop collects, uses, and protects your personal data. Our privacy policy explains your rights and our data practices.",
  openGraph: {
    title: "Privacy Policy - UniDrop",
    description: "UniDrop privacy policy for student marketplace users.",
  },
};

export default function PrivacyPage() {
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: January 2025</p>

        <section className="mt-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              UniDrop (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the UniDrop marketplace. This page informs you of our policies
              regarding the collection, use, and disclosure of personal data when you use our service and the choices
              you have associated with that data.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">2. Information Collection and Use</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              We collect several different types of information for various purposes to provide and improve our service
              to you, including information like:
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-muted-foreground">
              <li>• Account information (name, email, college email, password)</li>
              <li>• Profile information (course, year, profile photo)</li>
              <li>• Listing information (images, descriptions, prices, location)</li>
              <li>• Transaction information (purchases, sales, saved items)</li>
              <li>• Usage data (pages visited, time spent, clicks, interactions)</li>
              <li>• Device information (device type, browser, IP address)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold">3. Use of Data</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              UniDrop uses the collected data for various purposes:
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-muted-foreground">
              <li>• To provide and maintain our service</li>
              <li>• To notify you about changes to our service</li>
              <li>• To allow you to participate in interactive features</li>
              <li>• To provide customer support</li>
              <li>• To gather analysis or valuable information to improve our service</li>
              <li>• To monitor the usage of our service</li>
              <li>• To detect, prevent and address technical issues and fraud</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold">4. Security of Data</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              The security of your data is important to us but remember that no method of transmission over the Internet
              or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to
              protect your personal data, we cannot guarantee its absolute security.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">5. Your Rights</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              You have the right to access, update, or delete your personal information at any time by logging into your
              account. You can also request that we delete your account and associated data.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">6. Contact Us</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us through the UniDrop platform.
            </p>
          </div>
        </section>
      </div>
    </Container>
  );
}
