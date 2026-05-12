const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://unidrop.app";
const siteName = "UniDrop";

export interface ListingSchema {
  title: string;
  description?: string;
  price: number;
  priceCurrency?: string;
  condition?: "NewCondition" | "RefurbishedCondition" | "UsedCondition";
  seller?: {
    name?: string;
    url?: string;
  };
  image?: string[];
  url: string;
}

export interface ListingStructuredData {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  price: string;
  priceCurrency: string;
  availability: string;
  condition: string;
  seller?: {
    "@type": "Person";
    name: string;
  };
  image?: string[];
  url: string;
}

export interface OrganizationSchema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
  potentialAction: {
    "@type": string;
    target: string;
    query_input: string;
  };
}

export interface BreadcrumbSchema {
  "@context": string;
  "@type": string;
  itemListElement: Array<{
    "@type": string;
    position: number;
    name: string;
    item?: string;
  }>;
}

/**
 * Generate JSON-LD schema for a product listing
 */
export function generateListingSchema(
  listing: ListingSchema
): ListingStructuredData {
  const conditionMap: Record<string, string> = {
    new: "NewCondition",
    refurbished: "RefurbishedCondition",
    used: "UsedCondition",
  };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description || listing.title,
    price: (listing.price / 100).toFixed(2),
    priceCurrency: listing.priceCurrency || "INR",
    availability: "https://schema.org/InStock",
    condition: `https://schema.org/${conditionMap[listing.condition?.toLowerCase() || "used"]}`,
    ...(listing.seller?.name && {
      seller: {
        "@type": "Person",
        name: listing.seller.name,
      },
    }),
    ...(listing.image && { image: listing.image }),
    url: listing.url,
  };
}

/**
 * Generate JSON-LD schema for the organization (homepage)
 */
export function generateOrganizationSchema(): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: baseUrl,
    logo: `${baseUrl}/logo.svg`,
    description:
      "UniDrop is a trusted student marketplace for buying and selling items across campus.",
    sameAs: [
      // Add social media links when available
      // "https://instagram.com/unidrop",
      // "https://twitter.com/unidrop",
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/marketplace?search={search_term_string}`,
      "query_input": "required name=search_term_string",
    },
  };
}

/**
 * Generate JSON-LD schema for breadcrumb navigation
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>
): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

/**
 * Generate JSON-LD schema for a category/collection
 */
export function generateCollectionSchema(
  category: string,
  totalItems: number,
  url: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category,
    description: `Browse ${totalItems} ${category.toLowerCase()} listings on UniDrop student marketplace.`,
    url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalItems,
      itemListElement: [
        // Individual listings would be added here by the component
      ],
    },
  };
}

/**
 * Embed structured data into page metadata
 */
export function embedStructuredData(
  schema: ListingStructuredData | OrganizationSchema | BreadcrumbSchema | Record<string, unknown>
): {
  other: { "script:ld+json": string };
} {
  return {
    other: {
      "script:ld+json": JSON.stringify(schema),
    },
  };
}
