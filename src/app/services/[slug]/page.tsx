import { notFound } from "next/navigation";
import { SERVICES } from "@/lib/constants";
import ServicePageClient from "./ServicePageClient";

// Generate static params for all services
export function generateStaticParams() {
  return SERVICES.map((service) => ({
    slug: service.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) {
    return {
      title: "Service non trouvé | RA Bâtiment",
    };
  }

  return {
    title: `${service.title} | RA Bâtiment - Artisan BTP Île-de-France`,
    description: service.longDescription,
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

  return <ServicePageClient service={service} />;
}
