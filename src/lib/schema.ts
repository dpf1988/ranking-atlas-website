// JSON-LD helpers for structured data emission on pillar pages
// Organization + Person schema already emitted sitewide in Layout.astro

/** Normalise a date-only string ("2026-04-21") or Date to full ISO 8601 with UTC timezone. */
function toISODateTime(date: string | Date): string {
  if (date instanceof Date) return date.toISOString();
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return `${date}T00:00:00+00:00`;
  return date;
}

export function articleSchema(args: {
  title: string;
  description: string;
  url: string;
  datePublished: string | Date;
  dateModified?: string | Date;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    url: args.url,
    datePublished: toISODateTime(args.datePublished),
    dateModified: toISODateTime(args.dateModified ?? args.datePublished),
    author: {
      "@type": "Person",
      name: "Daniel Grainger",
      url: "https://ranking-atlas.com/about",
      jobTitle: "Founder",
      worksFor: {
        "@type": "Organization",
        name: "Ranking Atlas",
        url: "https://ranking-atlas.com",
      },
      sameAs: [
        "https://www.linkedin.com/in/daniel-grainger/",
        "https://ranking-atlas.com/about",
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "Ranking Atlas",
      url: "https://ranking-atlas.com",
    },
    image: args.image ? `https://ranking-atlas.com${args.image}` : undefined,
  };
}

export function definedTermSchema(args: {
  term: string;
  definition: string;  // 100-150 word extractable paragraph
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: args.term,
    description: args.definition,
    url: args.url,
    inDefinedTermSet: "https://ranking-atlas.com/resources/citation-equity/",
  };
}

export function breadcrumbSchema(trail: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
