
/**
 * SEO Schema Markup Generator
 * Automatically generates JSON-LD schema for different page types
 */

interface SchemaConfig {
  pagePath: string;
  pageType: 'home' | 'program' | 'contact' | 'about' | 'staff';
  title: string;
  description: string;
  imageUrl?: string;
}

interface LocalBusinessSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    '@type': string;
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    '@type': string;
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification: Array<{
    '@type': string;
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
  sameAs: string[];
}

interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  logo: string;
  contactPoint: {
    '@type': string;
    telephone: string;
    contactType: string;
    email: string;
  };
  sameAs: string[];
}

interface ProgramSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  provider: {
    '@type': string;
    name: string;
  };
  url: string;
  image?: string;
  offers?: {
    '@type': string;
    price: string;
    priceCurrency: string;
    availability: string;
  };
}

export function generateLocalBusinessSchema(): LocalBusinessSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: 'The Basketball Factory Inc',
    description: 'Premier basketball training facility in New Jersey offering professional coaching for all skill levels',
    url: 'https://thebasketballfactoryinc.com',
    telephone: '+1-973-240-8759',
    email: 'khouston@thebasketballfactorynj.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '91 Sparta Ave',
      addressLocality: 'Sparta',
      addressRegion: 'NJ',
      postalCode: '07871',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.0320,
      longitude: -74.6387,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '21:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '08:00',
        closes: '20:00',
      },
    ],
    sameAs: [
      'https://www.facebook.com/thebasketballfactory',
      'https://www.instagram.com/thebasketballfactory',
      'https://twitter.com/basketballfacto',
    ],
  };
}

export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name: 'The Basketball Factory Inc',
    description: 'Professional basketball training organization specializing in player development and skill enhancement',
    url: 'https://thebasketballfactoryinc.com',
    logo: 'https://images.unsplash.com/photo-1682084037329-45a11d86cce7?auto=format&fit=crop&w=612&h=464',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-973-240-8759',
      contactType: 'customer service',
      email: 'khouston@thebasketballfactorynj.com',
    },
    sameAs: [
      'https://www.facebook.com/thebasketballfactory',
      'https://www.instagram.com/thebasketballfactory',
      'https://twitter.com/basketballfacto',
    ],
  };
}

export function generateProgramSchema(config: {
  name: string;
  description: string;
  url: string;
  price?: string;
  imageUrl?: string;
}): ProgramSchema {
  const schema: ProgramSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: config.name,
    description: config.description,
    provider: {
      '@type': 'SportsOrganization',
      name: 'The Basketball Factory Inc',
    },
    url: config.url,
  };

  if (config.imageUrl) {
    schema.image = config.imageUrl;
  }

  if (config.price) {
    schema.offers = {
      '@type': 'Offer',
      price: config.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    };
  }

  return schema;
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function detectPageType(pagePath: string): string {
  if (pagePath === '/') return 'home';
  if (pagePath.includes('/programs/') || pagePath.includes('-programs')) return 'program';
  if (pagePath === '/contact-us') return 'contact';
  if (pagePath === '/who-we-are' || pagePath === '/director' || pagePath === '/staff') return 'about';
  if (pagePath === '/private-lessons') return 'service';
  return 'other';
}

export function generateSchemaForPage(config: SchemaConfig): string[] {
  const schemas: string[] = [];
  const baseUrl = 'https://thebasketballfactoryinc.com';

  // Always include LocalBusiness and Organization on all pages
  schemas.push(JSON.stringify(generateLocalBusinessSchema(), null, 2));
  schemas.push(JSON.stringify(generateOrganizationSchema(), null, 2));

  // Add page-specific schema
  const pageType = detectPageType(config.pagePath);

  if (pageType === 'program') {
    const programName = config.title;
    const programUrl = `${baseUrl}${config.pagePath}`;
    
    schemas.push(
      JSON.stringify(
        generateProgramSchema({
          name: programName,
          description: config.description,
          url: programUrl,
          imageUrl: config.imageUrl,
        }),
        null,
        2
      )
    );
  }

  // Generate breadcrumbs for non-home pages
  if (config.pagePath !== '/') {
    const pathParts = config.pagePath.split('/').filter(Boolean);
    const breadcrumbItems = [
      { name: 'Home', url: baseUrl },
      ...pathParts.map((part, index) => {
        const url = `${baseUrl}/${pathParts.slice(0, index + 1).join('/')}`;
        const name = part
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        return { name, url };
      }),
    ];

    schemas.push(JSON.stringify(generateBreadcrumbSchema(breadcrumbItems), null, 2));
  }

  return schemas;
}

export async function autoGenerateSchemaForAllPages() {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const pages = await prisma.sEOPageConfig.findMany({
      where: { status: 'active' },
    });

    const results = [];

    for (const page of pages) {
      try {
        const schemas = generateSchemaForPage({
          pagePath: page.pagePath,
          pageType: detectPageType(page.pagePath) as any,
          title: page.pageTitle || page.pagePath,
          description: page.metaDescription || '',
        });

        // Update the page config with generated schema
        await prisma.sEOPageConfig.update({
          where: { id: page.id },
          data: {
            contentStrategy: JSON.stringify({
              ...((page.contentStrategy as any) || {}),
              schemas,
              schemaGeneratedAt: new Date().toISOString(),
            }),
          },
        });

        results.push({
          pagePath: page.pagePath,
          schemasGenerated: schemas.length,
          success: true,
        });
      } catch (error: any) {
        results.push({
          pagePath: page.pagePath,
          success: false,
          error: error.message,
        });
      }
    }

    await prisma.$disconnect();
    return results;
  } catch (error) {
    await prisma.$disconnect();
    throw error;
  }
}
