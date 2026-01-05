# Variantes de Design - RA Solution

Ce document présente les différentes variantes de design disponibles pour le site RA Solution.

---

## Vue d'ensemble

| Variante | Route | Style | Ambiance |
|----------|-------|-------|----------|
| Principale | `/` | Industrial Brutalist | Moderne, brut, professionnel |
| V1 | `/v1` | Black Metallic Gold | Luxe, prestige, haute gamme |
| V2 | `/v2` | Editorial Magazine | Épuré, éditorial, raffiné |
| V3 | `/v3` | Neo-Brutalist | Bold, graphique, impactant |

---

## Page Principale (`/`)

### Style : Industrial Brutalist

Design moderne et professionnel avec un système de thème light/dark.

#### Caractéristiques
- **Fond** : Noir profond (#0a0a0a) en dark mode / Blanc cassé (#fafafa) en light mode
- **Accent** : Orange vif (#ff6b00)
- **Typographie** : DM Sans (moderne, lisible)
- **Éléments** : Bordures subtiles, ombres légères, animations au scroll

#### Points forts
- Toggle light/dark mode dans le header
- Animations Framer Motion sur toutes les sections
- Images Unsplash intégrées
- Design responsive complet

---

## Variante 1 (`/v1`)

### Style : Black Metallic Gold

Design luxueux inspiré de la haute joaillerie et des marques de prestige.

#### Palette de couleurs
```css
--gold-bg: #0a0a0a          /* Noir profond */
--gold-bg-elevated: #111111  /* Noir légèrement élevé */
--gold-primary: #d4af37      /* Or classique */
--gold-primary-light: #f4e4bc /* Or clair */
--gold-gradient: linear-gradient(135deg, #d4af37 0%, #f4e4bc 50%, #d4af37 100%)
```

#### Typographie
- **Titres** : Playfair Display (serif élégant)
- **Sous-titres** : Cormorant Garamond (serif raffiné)
- **Corps** : Montserrat (sans-serif moderne)

#### Effets spéciaux
- Gradient doré animé avec effet shimmer
- Texte avec dégradé métallique
- Hover effects avec glow doré
- Stats flottantes sur le hero

#### Ambiance
Évoque le luxe, le prestige et l'excellence. Idéal pour une clientèle haut de gamme recherchant des prestations premium.

---

## Variante 2 (`/v2`)

### Style : Editorial Magazine

Design épuré inspiré des publications de luxe comme Vogue ou Architectural Digest.

#### Palette de couleurs
```css
--ed-bg: #faf9f6            /* Crème/off-white */
--ed-bg-alt: #f5f3ef        /* Crème légèrement plus foncé */
--ed-bg-dark: #1a1a1a       /* Noir pour contrastes */
--ed-text: #1a1a1a          /* Texte principal */
--ed-accent: #c9a962        /* Or subtil */
```

#### Typographie
- **Titres** : Libre Baskerville (serif éditorial classique)
- **Corps** : DM Sans (sans-serif clean)

#### Caractéristiques design
- Layout asymétrique avec grille éditoriale
- Séparateurs de sections avec lignes fines
- Numérotation italique des services
- Marquee défilant avec les garanties
- Portfolio en grille asymétrique (style magazine)
- Témoignages avec grande citation décorative

#### Ambiance
Sophistication discrète, raffinement intellectuel. Communique l'expertise et le savoir-faire artisanal à travers une mise en page soignée.

---

## Variante 3 (`/v3`)

### Style : Neo-Brutalist

Design audacieux avec des formes géométriques brutes et des accents néon.

#### Palette de couleurs
```css
--br-bg: #f5f5f0            /* Beige clair */
--br-black: #0d0d0d         /* Noir intense */
--br-accent: #00ff88        /* Vert néon */
--br-accent-alt: #ff3366    /* Rose néon (secondaire) */
--br-yellow: #ffee00        /* Jaune vif */
```

#### Typographie
- **Titres** : Bebas Neue (display condensé, impactant)
- **Code/Labels** : Space Mono (monospace technique)
- **Corps** : Inter (sans-serif neutre)

#### Caractéristiques design
- Bordures épaisses (3px) noires omniprésentes
- Effet hover avec décalage et ombre portée
- Images en noir et blanc → couleur au hover
- Numérotation géante des sections (01, 02, 03)
- Tags et labels style "code"
- Marquee noir avec texte blanc

#### Effets interactifs
```css
/* Hover sur boutons */
transform: translate(-3px, -3px);
box-shadow: 6px 6px 0 var(--br-black);

/* Hover sur cartes services */
Background slide-up avec couleur accent
```

#### Ambiance
Moderne, technique, sans compromis. Communique l'efficacité et la précision. Idéal pour une image de marque distinctive et mémorable.

---

## Comparatif des sections

### Hero

| Variante | Layout | Effet principal |
|----------|--------|-----------------|
| Principale | Centré avec image de fond | Parallax au scroll |
| V1 Gold | Centré avec stats flottantes | Gradient doré animé |
| V2 Editorial | 2 colonnes (texte / image) | Image avec overlay dégradé |
| V3 Brutalist | 2 colonnes avec bordure | Image N&B + stats en bas |

### Services

| Variante | Disposition | Interaction |
|----------|-------------|-------------|
| Principale | Grille 2x3 | Hover avec élévation |
| V1 Gold | Grille 2x3 avec images | Overlay au hover |
| V2 Editorial | Grille 3x2 avec séparateurs | Fond qui change au hover |
| V3 Brutalist | Grille 3x2 avec bordures | Background slide-up |

### Portfolio

| Variante | Grille | Effet |
|----------|--------|-------|
| Principale | Masonry style | Zoom au hover |
| V1 Gold | Masonry avec featured | Overlay doré |
| V2 Editorial | Asymétrique magazine | Overlay avec infos |
| V3 Brutalist | Grille stricte | N&B → couleur |

---

## Recommandations d'usage

### V1 Gold - Pour qui ?
- Clientèle premium / haut de gamme
- Projets de rénovation luxe
- Communication prestige

### V2 Editorial - Pour qui ?
- Clientèle cultivée / design-conscious
- Projets architecturaux
- Image de marque raffinée

### V3 Brutalist - Pour qui ?
- Clientèle moderne / tech-savvy
- Différenciation forte sur le marché
- Communication impactante

---

## Stack technique

Toutes les variantes utilisent :
- **Framework** : Next.js 16 (App Router)
- **Styling** : CSS personnalisé + variables CSS
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **Images** : Unsplash via next/image
- **Fonts** : Google Fonts

---

## Fichiers

```
src/app/
├── page.tsx              # Page principale
├── globals.css           # Design system principal
├── v1/
│   ├── page.tsx          # Variante Gold
│   └── gold.css          # Styles Gold
├── v2/
│   ├── page.tsx          # Variante Editorial
│   └── editorial.css     # Styles Editorial
└── v3/
    ├── page.tsx          # Variante Brutalist
    └── brutalist.css     # Styles Brutalist
```
