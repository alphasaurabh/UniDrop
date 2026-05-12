import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://unidrop.app";
const siteName = "UniDrop";
const description = "UniDrop is a trusted student marketplace for buying and selling items across campus. Join verified students trading locally at Gautam Buddha University.";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "UniDrop - Student Marketplace for Campus Trading",
    template: "%s | UniDrop",
  },
  description,
  keywords: [
    "student marketplace",
    "college marketplace",
    "campus marketplace",
    "buy and sell in college",
    "GBU marketplace",
    "student buying and selling",
    "hostel marketplace",
    "college second hand",
    "campus exchange",
    "Gautam Buddha University",
  ],
  applicationName: siteName,
  authors: [{ name: "UniDrop" }],
  creator: "UniDrop",
  publisher: "UniDrop",
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: baseUrl,
    siteName,
    title: "UniDrop - Student Marketplace for Campus Trading",
    description,
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UniDrop - Student Marketplace for Campus Trading",
    description,
    images: [`${baseUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
};

export function generateListingMetadata(listing: {
  title: string;
  description?: string;
  price: number;
  condition?: string;
  category?: { name: string };
  seller?: { full_name?: string; username?: string };
  images?: Array<{ publicUrl: string }>;
}): Metadata {
  const title = `${listing.title} - Buy on UniDrop Student Marketplace`;
  const description =
    listing.description?.substring(0, 155) ||
    `${listing.title} for sale. Price: ₹${(listing.price / 100).toFixed(0)}. Listed on UniDrop student marketplace.`;

  const ogImage = listing.images?.[0]?.publicUrl || `${baseUrl}/og-image.png`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      url: `${baseUrl}/marketplace/${listing.title.toLowerCase().replace(/\s+/g, "-")}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: listing.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function generateCategoryMetadata(category: string, totalListings: number): Metadata {
  const title = `${category} for Sale on UniDrop - Student Marketplace`;
  const description = `Browse ${totalListings} ${category.toLowerCase()} listings on UniDrop. Buy verified, affordable ${category.toLowerCase()} from campus students.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export function generateProfileMetadata(profile: {
  full_name?: string;
  username: string;
  course?: string;
  year?: string;
}): Metadata {
  const name = profile.full_name || profile.username;
  const academicInfo = [profile.course, profile.year].filter(Boolean).join(" • ");
  const title = `${name}${academicInfo ? ` (${academicInfo})` : ""} - UniDrop Seller`;
  const description = `View verified seller profile on UniDrop. ${name} is trading items on the campus marketplace.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
