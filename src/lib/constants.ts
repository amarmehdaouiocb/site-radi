// RA Solution - Site Data

export const SITE_CONFIG = {
  name: "RA Solution",
  legalName: "R.A Bâtiment",
  legalForm: "SAS – Société par Actions Simplifiée",
  tagline: "Artisan Multi-Services BTP",
  description:
    "Votre artisan de confiance en Île-de-France pour tous vos travaux de rénovation, maçonnerie, plomberie, électricité et plus encore.",
  phone: "06 23 30 44 45",
  email: "ra.solution@myyahoo.com",
  address: "5 rue de la Gaîté, 93000 Bobigny",
  siret: "933 728 610 00017",
  hours: "Lun - Sam: 8h - 19h",
};

// Unsplash images for construction/renovation theme
export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80",
  heroAlt: "Chantier de construction professionnel",
  services: {
    renovation:
      "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&q=80",
    maconnerie:
      "https://images.unsplash.com/photo-1590725140246-20acdee442be?w=800&q=80",
    plomberie:
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80",
    electricite:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
    peinture:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80",
    carrelage:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  },
};

export const SERVICES = [
  {
    id: "renovation",
    title: "Rénovation Intérieure",
    description:
      "Transformation complète de vos espaces : cuisine, salle de bain, sols et murs.",
    icon: "Home",
    image: IMAGES.services.renovation,
    popular: true,
  },
  {
    id: "maconnerie",
    title: "Maçonnerie",
    description:
      "Construction, extension, murs porteurs et travaux de gros œuvre.",
    icon: "Brick",
    image: IMAGES.services.maconnerie,
  },
  {
    id: "plomberie",
    title: "Plomberie",
    description:
      "Installation, réparation et dépannage de tous vos équipements sanitaires.",
    icon: "Droplets",
    image: IMAGES.services.plomberie,
    popular: true,
  },
  {
    id: "electricite",
    title: "Électricité",
    description:
      "Mise aux normes, installation complète et dépannage électrique.",
    icon: "Zap",
    image: IMAGES.services.electricite,
  },
  {
    id: "peinture",
    title: "Peinture",
    description:
      "Peinture intérieure et extérieure, finitions décoratives soignées.",
    icon: "Paintbrush",
    image: IMAGES.services.peinture,
  },
  {
    id: "carrelage",
    title: "Carrelage",
    description: "Pose de carrelage, faïence et revêtements de sols et murs.",
    icon: "Grid3X3",
    image: IMAGES.services.carrelage,
  },
];

export const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: "Rénovation Cuisine Moderne",
    category: "Rénovation",
    location: "Paris 15e",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
  },
  {
    id: 2,
    title: "Salle de Bain Contemporaine",
    category: "Rénovation",
    location: "Boulogne",
    image:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
  },
  {
    id: 3,
    title: "Extension Maison",
    category: "Maçonnerie",
    location: "Versailles",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    id: 4,
    title: "Appartement Haussmannien",
    category: "Rénovation",
    location: "Paris 8e",
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80",
  },
  {
    id: 5,
    title: "Installation Électrique Complète",
    category: "Électricité",
    location: "Neuilly",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    id: 6,
    title: "Terrasse Carrelée",
    category: "Carrelage",
    location: "Saint-Cloud",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    content:
      "Travail impeccable sur notre rénovation de cuisine. L'équipe a été professionnelle, ponctuelle et le résultat dépasse nos attentes. Je recommande vivement !",
    author: "Marie L.",
    role: "Particulier",
    location: "Paris 15e",
    rating: 5,
    project: "Rénovation cuisine",
    date: "Novembre 2025",
  },
  {
    id: 2,
    content:
      "Excellente prestation pour la réfection complète de notre salle de bain. Prix compétitif, délais respectés et finitions soignées. Un artisan de confiance.",
    author: "Pierre D.",
    role: "Particulier",
    location: "Boulogne-Billancourt",
    rating: 5,
    project: "Salle de bain",
    date: "Octobre 2025",
  },
  {
    id: 3,
    content:
      "RA Solution a pris en charge l'extension de notre maison. Du gros œuvre aux finitions, tout a été parfait. Communication claire et transparente tout au long du chantier.",
    author: "Sophie M.",
    role: "Particulier",
    location: "Versailles",
    rating: 5,
    project: "Extension maison",
    date: "Septembre 2025",
  },
];

export const TRUST_BADGES = [
  { label: "Devis Gratuit", sublabel: "Sans engagement" },
  { label: "Réponse 24h", sublabel: "Réactivité garantie" },
  { label: "Garantie Décennale", sublabel: "Assurance incluse" },
  { label: "15+ Ans", sublabel: "D'expérience" },
];

export const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Réalisations" },
  { href: "#testimonials", label: "Avis" },
  { href: "#contact", label: "Contact" },
];
