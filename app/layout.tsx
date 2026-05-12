import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";

import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { GlobalBackground } from "@/components/ui/global-background";
import { defaultMetadata } from "@/lib/seo/metadata";
import { generateOrganizationSchema, embedStructuredData } from "@/lib/seo/structured-data";
import "./globals.css";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const displayFont = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  ...defaultMetadata,
  other: {
    ...embedStructuredData(generateOrganizationSchema()).other,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <ToastProvider>
            <GlobalBackground />
            <div className="relative z-10 flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 pb-safe-bottom lg:pb-0">{children}</main>
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
