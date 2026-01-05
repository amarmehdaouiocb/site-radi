import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

export const metadata: Metadata = {
  metadataBase: new URL("https://ra-solution.fr"),
  title: {
    default: "RA Solution | Artisan Multi-Services BTP Île-de-France",
    template: "%s | RA Solution",
  },
  description:
    "Artisan de confiance pour vos travaux en Île-de-France. Rénovation, maçonnerie, plomberie, électricité, peinture, carrelage. Devis gratuit sous 24h. Garantie décennale.",
  keywords: [
    "artisan btp",
    "rénovation île-de-france",
    "maçonnerie paris",
    "plomberie 93",
    "électricité bobigny",
    "carrelage salle de bain",
    "rénovation cuisine",
    "construction piscine",
    "terrasse extérieure",
    "devis gratuit travaux",
  ],
  authors: [{ name: "RA Solution" }],
  creator: "RA Solution",
  publisher: "RA Solution",
  formatDetection: {
    telephone: true,
    email: true,
  },
  openGraph: {
    title: "RA Solution | Artisan Multi-Services BTP Île-de-France",
    description:
      "Artisan de confiance pour vos travaux en Île-de-France. Rénovation, maçonnerie, plomberie, électricité. Devis gratuit sous 24h.",
    url: "https://ra-solution.fr",
    siteName: "RA Solution",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/portfolio/terrasse-bois-apres-01.jpg",
        width: 1200,
        height: 630,
        alt: "RA Solution - Réalisations BTP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RA Solution | Artisan Multi-Services BTP",
    description: "Artisan de confiance en Île-de-France. Devis gratuit sous 24h.",
    images: ["/portfolio/terrasse-bois-apres-01.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Ajouter après inscription Google Search Console:
    // google: "votre-code-verification",
  },
  alternates: {
    canonical: "https://ra-solution.fr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <LocalBusinessSchema />
      </head>
      <body className="antialiased">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
