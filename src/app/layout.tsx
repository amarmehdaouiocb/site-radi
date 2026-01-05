import type { Metadata } from "next";
import { Bebas_Neue, Outfit } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-context";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

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
    <html lang="fr" className="scroll-smooth dark" suppressHydrationWarning>
      <body
        className={`${bebasNeue.variable} ${outfit.variable} antialiased bg-[var(--ra-bg)]`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
