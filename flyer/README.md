# RA Bâtiment - Flyer Print-Ready A5

Flyer de prospection premium pour RA Bâtiment, conçu pour l'impression professionnelle.

## Spécifications Techniques

| Paramètre | Valeur |
|-----------|--------|
| Format | A5 Portrait (148mm × 210mm) |
| Fond perdu (bleed) | 3mm tout autour |
| Zone de sécurité | 5mm de marge interne |
| Dimensions totales | 154mm × 216mm |
| Pages | 2 (Recto + Verso) |
| Résolution export | 300 DPI |

## Structure des Fichiers

```
flyer/
├── print.css           # Styles print-ready (typographie, couleurs, layout)
├── recto.html          # Page 1 - Accroche + CTA
├── verso.html          # Page 2 - Services + Contact
├── flyer-combined.html # Version combinée (2 pages pour export PDF)
├── export-pdf.js       # Script d'export PDF via Playwright
├── README.md           # Ce fichier
└── assets/             # (optionnel) Images et logos copiés
```

## Prérequis

1. **Node.js** >= 18.x
2. **Playwright** installé

```powershell
# Installer Playwright si nécessaire
npm install playwright
# ou
pnpm add playwright

# Installer les navigateurs Playwright
npx playwright install chromium
```

## Génération du PDF

```powershell
# Depuis le dossier flyer/
node export-pdf.js
```

### Fichiers générés

| Fichier | Description |
|---------|-------------|
| `RA-Batiment-flyer.pdf` | PDF 2 pages prêt pour l'impression |
| `preview-recto.png` | Aperçu PNG de la page 1 |
| `preview-verso.png` | Aperçu PNG de la page 2 |

## Prévisualisation

Pour prévisualiser le flyer dans un navigateur :

```powershell
# Ouvrir directement dans le navigateur par défaut
start flyer-combined.html

# ou avec un serveur local (recommandé)
npx serve .
```

## Charte Graphique

### Palette de Couleurs

| Nom | Hex | Usage |
|-----|-----|-------|
| Or foncé | `#905e26` | Accents, dégradés |
| Or clair | `#f5ec9b` | Dégradés, highlights |
| Or intermédiaire | `#c4a35a` | Icônes, lignes |
| Noir profond | `#0B0B0B` | Fond principal |
| Noir riche | `#121212` | Cartes, blocs |
| Noir doux | `#1A1A1A` | Variations de fond |

### Typographies

| Usage | Police | Poids |
|-------|--------|-------|
| Titres display | Playfair Display | 600-700 |
| Sous-titres | Cormorant Garamond | 400 italic |
| Corps de texte | Manrope | 400-600 |
| Labels | Manrope | 600, uppercase |

### Dégradé Or (signature)

```css
background: linear-gradient(135deg, #905e26 0%, #f5ec9b 50%, #905e26 100%);
```

## Contenu

### Recto (Page 1)
- Logo RA Bâtiment
- Tagline : "Artisan d'Excellence depuis 15 ans"
- Headline : "L'Art de Bâtir le Prestige"
- Promesses : Rénovation clé en main • Devis sous 24h • Garantie décennale
- CTA : Devis Gratuit sous 24h + Téléphone + QR Code
- Badges : Garantie Décennale, Assurance RC Pro, Devis Gratuit, Réponse 24h
- Footer : Île-de-France, 15 ans d'expérience

### Verso (Page 2)
- Titre : "Nos Services"
- 8 services en grille 2×4 :
  1. Rénovation Intérieure
  2. Maçonnerie
  3. Plomberie
  4. Électricité
  5. Peinture
  6. Carrelage
  7. Rénovation Extérieure
  8. Piscine
- Section "Pourquoi nous choisir ?" : Finitions soignées, Respect des délais, Communication claire
- Bloc contact complet : Téléphone, Email, Adresse, Site web + QR Code
- Footer : SIRET, Zone, Horaires

## Contact RA Bâtiment

- **Téléphone** : +33 6 89 12 46 21
- **Email** : contact@ra-batiment.fr
- **Adresse** : 5 rue de la Gaîté, 93000 Bobigny
- **Site web** : ra-batiment.fr
- **Zone** : Île-de-France
- **Horaires** : Lun - Sam · 8h - 19h
- **SIRET** : 933 728 610 00017

## Impression

### Recommandations pour l'imprimeur

1. **Format fini** : A5 (148mm × 210mm)
2. **Fichier fourni** : Inclut 3mm de fond perdu
3. **Mode couleur** : CMJN (le PDF est en RVB, demander conversion si nécessaire)
4. **Papier suggéré** : Couché mat 350g ou similaire pour un rendu premium
5. **Finition** : Pelliculage mat soft-touch recommandé

### Vérifications avant envoi

- [x] Fond perdu 3mm présent
- [x] Zone de sécurité 5mm respectée
- [x] Textes > 9pt pour lisibilité
- [x] QR code scannable
- [x] Informations de contact vérifiées
