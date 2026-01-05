import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "RA Solution | Artisan Multi-Services BTP",
  description:
    "Artisan de confiance pour vos travaux en Île-de-France. Rénovation, maçonnerie, plomberie, électricité, peinture, carrelage. Devis gratuit sous 24h.",
  keywords: [
    "artisan",
    "BTP",
    "rénovation",
    "Île-de-France",
    "maçonnerie",
    "plomberie",
    "électricité",
  ],
  openGraph: {
    title: "RA Solution | Artisan Multi-Services BTP",
    description:
      "Artisan de confiance pour vos travaux en Île-de-France. Devis gratuit sous 24h.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="antialiased">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
