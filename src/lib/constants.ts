// RA Bâtiment - Site Data

export const SITE_CONFIG = {
  name: "RA Bâtiment",
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

// Images pour le slideshow Hero - Meilleures photos "après"
export const HERO_GALLERY = [
  "/portfolio/terrasse-travertin-apres-01.jpg",
  "/portfolio/sdb-mosaique-apres-03.jpg",
  "/portfolio/combles-apres-04.jpg",
  "/portfolio/terrasse-bois-apres-01.jpg",
  "/portfolio/escalier-design-apres-01.jpg",
];

// Images réelles des réalisations RA Bâtiment
export const IMAGES = {
  hero: "/portfolio/terrasse-bois-apres-01.jpg",
  heroAlt: "Terrasse bois aménagée par RA Bâtiment",
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
      "Peinture et revêtements muraux",
      "Aménagement de combles",
      "Création de dressing",
      "Rénovation complète appartement",
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
      "Construction de dalle",
      "Construction de murs",
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
      "Rénovation électrique complète",
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
      "Application d'enduit",
      "Enduit décoratif",
      "Crépi intérieur/extérieur",
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
      "Pose de carrelage sol intérieur",
      "Pose de carrelage sol extérieur",
      "Pose de faïence murale",
      "Mosaïque décorative",
      "Joints et finitions",
      "Rénovation totale de sols",
    ],
  },
  {
    id: "renovation-exterieure",
    slug: "renovation-exterieure",
    title: "Rénovation Extérieure",
    description:
      "Aménagement et rénovation de vos espaces extérieurs : terrasse, jardin, clôture.",
    longDescription:
      "Nous transformons vos espaces extérieurs avec des aménagements durables et esthétiques. Terrasses, clôtures, allées, pergolas : nous créons l'extérieur de vos rêves.",
    icon: "TreePine",
    image: "/portfolio/terrasse-bois-apres-01.jpg",
    features: [
      "Terrasse bois ou composite",
      "Terrasse béton / carrelée",
      "Clôture et portail",
      "Aménagement jardin",
      "Allées et pavage",
      "Pergola et abri de jardin",
    ],
  },
  {
    id: "piscine",
    slug: "piscine",
    title: "Piscine",
    description:
      "Construction, rénovation et aménagement de piscines.",
    longDescription:
      "Nous réalisons la construction et la rénovation de piscines en béton ou coque. De la conception à la finition, nous vous accompagnons pour créer votre espace aquatique.",
    icon: "Waves",
    image: "/portfolio/piscine-apres-01.jpg",
    popular: true,
    features: [
      "Construction piscine béton",
      "Construction piscine coque",
      "Rénovation de piscine",
      "Plage de piscine",
      "Local technique",
      "Margelles et finitions",
    ],
  },
];

// Options de budget pour le formulaire de devis
export const BUDGET_OPTIONS = [
  { value: "moins-5k", label: "Moins de 5 000 €" },
  { value: "5k-10k", label: "5 000 € - 10 000 €" },
  { value: "10k-20k", label: "10 000 € - 20 000 €" },
  { value: "20k-50k", label: "20 000 € - 50 000 €" },
  { value: "plus-50k", label: "Plus de 50 000 €" },
  { value: "ne-sait-pas", label: "Je ne sais pas encore" },
];

// Options de délai pour le formulaire de devis
export const TIMELINE_OPTIONS = [
  { value: "urgent", label: "Urgent (< 1 mois)" },
  { value: "1-3-mois", label: "Dans 1 à 3 mois" },
  { value: "3-6-mois", label: "Dans 3 à 6 mois" },
  { value: "plus-6-mois", label: "Dans plus de 6 mois" },
  { value: "flexible", label: "Flexible / Pas de date précise" },
];

// Options de pièces pour le formulaire de devis
export const ROOM_OPTIONS = [
  { value: "cuisine", label: "Cuisine" },
  { value: "salle-de-bain", label: "Salle de bain" },
  { value: "wc", label: "WC" },
  { value: "chambre", label: "Chambre" },
  { value: "salon", label: "Salon / Séjour" },
  { value: "couloir", label: "Couloir / Entrée" },
  { value: "bureau", label: "Bureau" },
  { value: "buanderie", label: "Buanderie" },
  { value: "terrasse", label: "Terrasse" },
  { value: "garage", label: "Garage" },
  { value: "combles", label: "Combles" },
  { value: "cave", label: "Cave / Sous-sol" },
  { value: "exterieur", label: "Extérieur / Jardin" },
];

// Mapping services → pièces applicables
export const SERVICE_ROOMS: Record<string, string[]> = {
  renovation: ["cuisine", "salle-de-bain", "wc", "chambre", "salon", "couloir", "bureau", "combles"],
  plomberie: ["cuisine", "salle-de-bain", "wc", "buanderie"],
  electricite: ["cuisine", "salle-de-bain", "wc", "chambre", "salon", "couloir", "bureau", "garage", "exterieur"],
  peinture: ["cuisine", "salle-de-bain", "wc", "chambre", "salon", "couloir", "bureau", "combles", "exterieur"],
  carrelage: ["cuisine", "salle-de-bain", "wc", "couloir", "terrasse", "exterieur"],
};

export const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: "Terrasse Bois avec Barbecue",
    category: "Rénovation",
    location: "Île-de-France",
    image: "/portfolio/terrasse-bois-apres-01.jpg",
    surface: 25,
    duration: 3,
    budgetRange: { min: 8000, max: 15000 },
  },
  {
    id: 2,
    title: "Salle de Bain Mosaïque",
    category: "Rénovation",
    location: "Île-de-France",
    image: "/portfolio/sdb-mosaique-apres-03.jpg",
    beforeImage: "/portfolio/sdb-mosaique-avant-01.jpg",
    surface: 6,
    duration: 2,
    budgetRange: { min: 6000, max: 9000 },
  },
  {
    id: 3,
    title: "Piscine Béton",
    category: "Maçonnerie",
    location: "Île-de-France",
    image: "/portfolio/piscine-apres-01.jpg",
    beforeImage: "/portfolio/piscine-avant-01.jpg",
    surface: 32,
    duration: 8,
    budgetRange: { min: 25000, max: 35000 },
  },
  {
    id: 4,
    title: "Salle de Bain Effet Marbre",
    category: "Carrelage",
    location: "Île-de-France",
    image: "/portfolio/sdb-marbre-apres-01.jpg",
    surface: 8,
    duration: 2,
    budgetRange: { min: 7000, max: 10000 },
  },
  {
    id: 5,
    title: "Cuisine Moderne sur Mesure",
    category: "Rénovation",
    location: "Île-de-France",
    image: "/portfolio/cuisine-moderne-01.jpg",
    surface: 12,
    duration: 3,
    budgetRange: { min: 8000, max: 12000 },
  },
  {
    id: 6,
    title: "Terrasse Pierre Naturelle",
    category: "Carrelage",
    location: "Île-de-France",
    image: "/portfolio/terrasse-pierre-apres-02.jpg",
    surface: 40,
    duration: 4,
    budgetRange: { min: 12000, max: 18000 },
  },
  {
    id: 7,
    title: "Escalier Design Bois & Métal",
    category: "Rénovation",
    location: "Île-de-France",
    image: "/portfolio/escalier-design-apres-01.jpg",
    surface: 15,
    duration: 2,
    budgetRange: { min: 5000, max: 8000 },
  },
  {
    id: 8,
    title: "Rénovation Complète Appartement",
    category: "Rénovation",
    location: "Île-de-France",
    image: "/portfolio/renovation-couloir-apres-01.jpg",
    surface: 75,
    duration: 6,
    budgetRange: { min: 35000, max: 50000 },
  },
  {
    id: 9,
    title: "Aménagement de Combles",
    category: "Rénovation",
    location: "Île-de-France",
    image: "/portfolio/combles-apres-04.jpg",
    surface: 45,
    duration: 5,
    budgetRange: { min: 25000, max: 40000 },
  },
  {
    id: 10,
    title: "Terrasse Travertin",
    category: "Carrelage",
    location: "Île-de-France",
    image: "/portfolio/terrasse-travertin-apres-01.jpg",
    surface: 60,
    duration: 3,
    budgetRange: { min: 15000, max: 25000 },
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
      "RA Bâtiment a pris en charge l'extension de notre maison. Du gros œuvre aux finitions, tout a été parfait. Communication claire et transparente tout au long du chantier.",
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
