import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SERVICES } from "@/lib/constants";
import ServicePageClient from "./ServicePageClient";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import ServiceSchema from "@/components/ServiceSchema";

// Generate static params for all services
export function generateStaticParams() {
  return SERVICES.map((service) => ({
    slug: service.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) {
    return {
      title: "Service non trouvé | RA Bâtiment",
    };
  }

  const canonicalUrl = `https://ra-solution.fr/services/${slug}`;

  return {
    title: `${service.title} | RA Bâtiment - Artisan BTP Île-de-France`,
    description: service.longDescription,
    keywords: [
      service.title.toLowerCase(),
      `${service.title.toLowerCase()} ile-de-france`,
      `${service.title.toLowerCase()} paris`,
      `artisan ${service.title.toLowerCase()}`,
      ...service.features.slice(0, 3).map((f) => f.toLowerCase()),
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${service.title} - RA Bâtiment`,
      description: service.longDescription,
      url: canonicalUrl,
      siteName: "RA Bâtiment",
      locale: "fr_FR",
      type: "website",
      images: [
        {
          url: service.image,
          width: 1200,
          height: 630,
          alt: `${service.title} - Réalisation RA Bâtiment`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | RA Bâtiment`,
      description: service.longDescription,
      images: [service.image],
    },
  };
}

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Accueil", url: "https://ra-solution.fr" },
    { name: "Services", url: "https://ra-solution.fr/#services" },
    { name: service.title, url: `https://ra-solution.fr/services/${service.slug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <ServiceSchema service={service} />
      <ServicePageClient service={service} />
    </>
  );
}
