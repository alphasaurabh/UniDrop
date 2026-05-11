import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";

import { Navbar } from "@/components/layout/navbar";
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
  title: {
    default: "CampusLoop",
    template: "%s | CampusLoop",
  },
  description: "A college marketplace for buying and selling on campus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 pb-20 lg:pb-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
