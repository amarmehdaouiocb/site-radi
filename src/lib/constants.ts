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

// Vidéos YouTube (ajouter les IDs après upload)
// Pour obtenir l'ID: youtube.com/watch?v=XXXXX → l'ID est XXXXX
export const VIDEOS = [
  // Décommenter et ajouter vos vidéos après upload sur YouTube:
  // { id: "VIDEO_ID_1", title: "Rénovation Salle de Bain", project: "sdb-mosaique" },
  // { id: "VIDEO_ID_2", title: "Construction Piscine", project: "piscine" },
];

// Images réelles des réalisations RA Solution
export const IMAGES = {
  hero: "/portfolio/terrasse-bois-apres-01.jpg",
  heroAlt: "Terrasse bois aménagée par RA Solution",
  services: {
    renovation: "/portfolio/renovation-couloir-apres-01.jpg",
    maconnerie: "/portfolio/piscine-apres-01.jpg",
    plomberie: "/portfolio/sdb-mosaique-apres-03.jpg",
    electricite: "/portfolio/renovation-tableau-elec-01.jpg",
    peinture: "/portfolio/cuisine-moderne-02.jpg",
    carrelage: "/portfolio/terrasse-pierre-apres-02.jpg",
  },
};

export const SERVICES = [
  {
    id: "renovation",
    slug: "renovation-interieure",
    title: "Rénovation Intérieure",
    description:
      "Transformation complète de vos espaces : cuisine, salle de bain, sols et murs.",
    longDescription:
      "Nous réalisons la rénovation complète de vos espaces intérieurs avec un souci du détail et des finitions haut de gamme. De la cuisine à la salle de bain, en passant par les sols et les murs, nous transformons votre habitat selon vos envies.",
    icon: "Home",
    image: IMAGES.services.renovation,
    popular: true,
    features: [
      "Rénovation de cuisine sur mesure",
      "Transformation de salle de bain",
      "Pose de parquet et carrelage",
      "Peinture et revêtements muraux",
      "Aménagement de combles",
      "Création de dressing",
    ],
  },
  {
    id: "maconnerie",
    slug: "maconnerie",
    title: "Maçonnerie",
    description:
      "Construction, extension, murs porteurs et travaux de gros œuvre.",
    longDescription:
      "Notre expertise en maçonnerie couvre tous les travaux de gros œuvre : construction, extension, ouverture de murs porteurs. Nous intervenons avec rigueur et professionnalisme pour garantir la solidité et la durabilité de vos ouvrages.",
    icon: "Brick",
    image: IMAGES.services.maconnerie,
    features: [
      "Construction neuve",
      "Extension de maison",
      "Ouverture de murs porteurs",
      "Création de fondations",
      "Ravalement de façade",
      "Terrassement",
    ],
  },
  {
    id: "plomberie",
    slug: "plomberie",
    title: "Plomberie",
    description:
      "Installation, réparation et dépannage de tous vos équipements sanitaires.",
    longDescription:
      "De l'installation complète à la réparation d'urgence, nous assurons tous vos travaux de plomberie. Notre équipe intervient rapidement pour garantir le bon fonctionnement de vos équipements sanitaires.",
    icon: "Droplets",
    image: IMAGES.services.plomberie,
    popular: true,
    features: [
      "Installation sanitaire complète",
      "Remplacement de chauffe-eau",
      "Débouchage et curage",
      "Recherche de fuites",
      "Rénovation de salle de bain",
      "Mise aux normes",
    ],
  },
  {
    id: "electricite",
    slug: "electricite",
    title: "Électricité",
    description:
      "Mise aux normes, installation complète et dépannage électrique.",
    longDescription:
      "Nous réalisons tous vos travaux électriques dans le respect des normes en vigueur. Installation, rénovation, mise aux normes ou dépannage, notre équipe qualifiée intervient pour sécuriser votre installation.",
    icon: "Zap",
    image: IMAGES.services.electricite,
    features: [
      "Mise aux normes NF C 15-100",
      "Installation tableau électrique",
      "Pose de prises et interrupteurs",
      "Éclairage intérieur et extérieur",
      "Domotique et automatismes",
      "Dépannage urgent",
    ],
  },
  {
    id: "peinture",
    slug: "peinture",
    title: "Peinture",
    description:
      "Peinture intérieure et extérieure, finitions décoratives soignées.",
    longDescription:
      "Nos peintres professionnels réalisent tous vos travaux de peinture avec des finitions impeccables. Peinture intérieure, extérieure, effets décoratifs : nous sublimous vos espaces avec des produits de qualité.",
    icon: "Paintbrush",
    image: IMAGES.services.peinture,
    features: [
      "Peinture intérieure",
      "Peinture extérieure",
      "Effets décoratifs",
      "Pose de papier peint",
      "Laquage de boiseries",
      "Traitement des fissures",
    ],
  },
  {
    id: "carrelage",
    slug: "carrelage",
    title: "Carrelage",
    description: "Pose de carrelage, faïence et revêtements de sols et murs.",
    longDescription:
      "Spécialistes de la pose de carrelage, nous intervenons pour tous vos projets de revêtement sol et mur. Carrelage, faïence, mosaïque : nous garantissons une pose parfaite et durable.",
    icon: "Grid3X3",
    image: IMAGES.services.carrelage,
    features: [
      "Pose de carrelage sol",
      "Pose de faïence murale",
      "Mosaïque décorative",
      "Carrelage grand format",
      "Joints et finitions",
      "Rénovation de sols",
    ],
  },
];

export const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: "Cuisine Moderne sur Mesure",
    category: "Rénovation",
    location: "Île-de-France",
    image: "/portfolio/cuisine-moderne-01.jpg",
  },
  {
    id: 2,
    title: "Salle de Bain Mosaïque",
    category: "Rénovation",
    location: "Île-de-France",
    image: "/portfolio/sdb-mosaique-apres-03.jpg",
    beforeImage: "/portfolio/sdb-mosaique-avant-01.jpg",
  },
  {
    id: 3,
    title: "Piscine Béton",
    category: "Maçonnerie",
    location: "Île-de-France",
    image: "/portfolio/piscine-apres-01.jpg",
    beforeImage: "/portfolio/piscine-avant-01.jpg",
  },
  {
    id: 4,
    title: "Salle de Bain Effet Marbre",
    category: "Carrelage",
    location: "Île-de-France",
    image: "/portfolio/sdb-marbre-apres-01.jpg",
  },
  {
    id: 5,
    title: "Terrasse Bois avec Barbecue",
    category: "Rénovation",
    location: "Île-de-France",
    image: "/portfolio/terrasse-bois-apres-01.jpg",
  },
  {
    id: 6,
    title: "Terrasse Pierre Naturelle",
    category: "Carrelage",
    location: "Île-de-France",
    image: "/portfolio/terrasse-pierre-apres-02.jpg",
  },
  {
    id: 7,
    title: "Escalier Design Bois & Métal",
    category: "Rénovation",
    location: "Île-de-France",
    image: "/portfolio/escalier-design-apres-01.jpg",
  },
  {
    id: 8,
    title: "Rénovation Complète Appartement",
    category: "Rénovation",
    location: "Île-de-France",
    image: "/portfolio/renovation-couloir-apres-01.jpg",
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
