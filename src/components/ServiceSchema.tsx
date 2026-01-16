interface ServiceSchemaProps {
  service: {
    title: string;
    slug: string;
    longDescription: string;
    features: string[];
    image: string;
  };
}

export default function ServiceSchema({ service }: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.longDescription,
    url: `https://ra-batiment.fr/services/${service.slug}`,
    image: service.image.startsWith("http")
      ? service.image
      : `https://ra-batiment.fr${service.image}`,
    provider: {
      "@type": "LocalBusiness",
      "@id": "https://ra-batiment.fr/#organization",
      name: "RA Bâtiment",
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 48.8566,
        longitude: 2.3522,
      },
      geoRadius: "50000",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: service.title,
      itemListElement: service.features.map((feature, index) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: feature,
        },
        position: index + 1,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
