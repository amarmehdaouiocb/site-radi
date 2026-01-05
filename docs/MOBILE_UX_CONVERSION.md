# Mobile UX/UI - Optimisation Conversion

**Branche** : `feature/mobile-menu-sticky-cta`
**Objectif** : Booster la conversion des prospects visitant la landing page sur mobile

---

## Problématique

Sur mobile, les visiteurs :
- N'avaient pas accès facilement à la navigation (menu caché)
- Devaient scroller pour trouver les CTAs (Appeler / Devis)
- Perdaient les points de conversion en scrollant le contenu

---

## Améliorations implémentées

### 1. Menu Hamburger Mobile (< 1024px)

**Fichiers** : `page.tsx`, `gold.css`

- Bouton hamburger avec icône `Menu` / `X` (lucide-react)
- Animation d'ouverture/fermeture avec Framer Motion (`AnimatePresence`)
- Navigation complète accessible : Services, Réalisations, Témoignages, Contact
- **Double CTA dans le menu** :
  - Bouton "Appeler" (lien `tel:`)
  - Bouton "Devis gratuit" (ancre `#contact`)

**Impact conversion** : Navigation accessible en 1 tap, CTAs visibles dès l'ouverture du menu.

---

### 2. CTA Sticky Mobile (< 768px)

**Fichiers** : `page.tsx`, `gold.css`

Barre fixe en bas de l'écran, toujours visible :
- **Bouton "Appeler"** : Lien téléphonique direct
- **Bouton "Devis gratuit"** : Scroll vers formulaire contact

**Caractéristiques** :
- Position `fixed` en bas d'écran
- `z-index: 100` pour rester au-dessus du contenu
- Shadow portée pour visibilité
- Padding ajouté au footer pour éviter le masquage du contenu

**Impact conversion** : Le prospect peut convertir à tout moment sans chercher le CTA.

---

## Détail technique

### CSS ajouté (`gold.css`)

```css
/* Menu mobile - breakpoint 1023px */
.gold-mobile-menu-toggle { /* Bouton hamburger */ }
.gold-mobile-nav { /* Container navigation */ }
.gold-mobile-nav-ctas { /* CTAs dans le menu */ }

/* CTA Sticky - breakpoint 768px */
.gold-mobile-sticky-cta { /* Barre fixe */ }
.gold-sticky-call { /* Bouton appel */ }
.gold-sticky-quote { /* Bouton devis */ }
```

### React (`page.tsx`)

- État `mobileMenuOpen` pour toggle du menu
- Import `AnimatePresence` de Framer Motion
- Import icônes `Menu`, `X` de lucide-react
- Fermeture auto du menu au clic sur un lien

---

## Métriques à suivre

| Métrique | Avant | Objectif |
|----------|-------|----------|
| Taux de clic CTA mobile | - | +30% |
| Taux de conversion mobile | - | +20% |
| Temps avant 1er CTA | - | < 2s |
| Taux de rebond mobile | - | -15% |

---

## Tests recommandés

- [ ] Menu hamburger s'ouvre/ferme correctement
- [ ] Animation fluide (pas de saccade)
- [ ] Liens de navigation fonctionnels
- [ ] CTA sticky visible sur toutes les pages
- [ ] Lien téléphonique fonctionne (ouvre app téléphone)
- [ ] Pas de chevauchement avec le contenu du footer
- [ ] Accessibilité : `aria-label`, `aria-expanded` présents

---

## Screenshots

> TODO: Ajouter captures d'écran mobile du menu et du CTA sticky

---

## Prochaines améliorations possibles

1. **A/B Test** : Tester différents textes CTA ("Appeler maintenant" vs "Appeler")
2. **Animation CTA** : Pulse subtil sur le bouton Devis pour attirer l'attention
3. **Hide on scroll down** : Masquer le sticky CTA lors du scroll vers le bas, réafficher au scroll vers le haut
4. **Tracking** : Ajouter events analytics sur les clics CTA mobile
