import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales",
  description:
    "Mentions légales et informations juridiques de RA Bâtiment, artisan BTP en Île-de-France. SIRET, coordonnées et politique de confidentialité.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://ra-batiment.fr/mentions-legales",
  },
};

export default function MentionsLegalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
