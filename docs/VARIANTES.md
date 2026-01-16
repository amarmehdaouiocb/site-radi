# Variantes de Design - RA Bâtiment

Ce document présente les variantes de design disponibles pour le site RA Bâtiment.

---

## Vue d'ensemble

| Route | Style | Ambiance |
|-------|-------|----------|
| `/` | Black Metallic Gold | Luxe, prestige, haute gamme |
| `/v1` | Editorial Magazine | Épuré, éditorial, raffiné |

---

## Page d'accueil (`/`)

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

#### Caractéristiques design
- Gradient doré animé avec effet shimmer
- Texte avec dégradé métallique
- Hover effects avec glow doré
- Stats flottantes sur le hero
- Parallax sur l'image hero

#### Ambiance
Évoque le luxe, le prestige et l'excellence. Idéal pour une clientèle haut de gamme recherchant des prestations premium.

---

## Variante 1 (`/v1`)

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

## Comparatif

### Hero

| Route | Layout | Effet principal |
|-------|--------|-----------------|
| `/` | Centré avec stats flottantes | Gradient doré animé + parallax |
| `/v1` | 2 colonnes (texte / image) | Image avec overlay dégradé |

### Services

| Route | Disposition | Interaction |
|-------|-------------|-------------|
| `/` | Grille 2x3 avec images | Overlay au hover |
| `/v1` | Grille 3x2 avec séparateurs | Fond qui change au hover |

### Portfolio

| Route | Grille | Effet |
|-------|--------|-------|
| `/` | Masonry avec featured | Overlay doré |
| `/v1` | Asymétrique magazine | Overlay avec infos |

---

## Recommandations d'usage

### Page d'accueil (Gold) - Pour qui ?
- Clientèle premium / haut de gamme
- Projets de rénovation luxe
- Communication prestige

### V1 (Editorial) - Pour qui ?
- Clientèle cultivée / design-conscious
- Projets architecturaux
- Image de marque raffinée

---

## Stack technique

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
├── page.tsx              # Page d'accueil (Gold)
├── gold.css              # Styles Gold
├── globals.css           # Styles globaux
├── layout.tsx            # Layout principal
└── v1/
    ├── page.tsx          # Variante Editorial
    └── editorial.css     # Styles Editorial
```
