# Plan d'Actions Conversion - RA Solution

**Date** : 5 Janvier 2026
**Base** : Audit conversion `docs/AUDIT_CONVERSION.md`
**Objectif** : Augmenter le taux de conversion de 2% a 5%+

---

## Vue d'ensemble

| Priorite | Nombre d'actions | Impact estime |
|----------|------------------|---------------|
| P1 (Critique) | 10 | +50-100% conversions |
| P2 (Important) | 12 | +20-30% conversions |
| P3 (Nice-to-have) | 10 | +5-10% conversions |

---

## P1 - Actions Critiques

> A implementer EN PRIORITE - Impact majeur sur credibilite et conversion

### 1. Supprimer/Remplacer les faux logos partenaires
**Section** : TrustedBy
**Probleme** : Logos Bouygues, Vinci, Eiffage = non credible pour un artisan
**Solution** :
- Option A : Supprimer la section completement
- Option B : Remplacer par vrais partenaires (Cedeo, Point.P, BigMat)
- Option C : Remplacer par labels/certifications (RGE, Qualibat, Garantie Decennale logo)

**Fichiers** : `src/components/TrustedBy.tsx`
**Impact** : Credibilite +++

---

### 2. Reduire le formulaire a 3 champs
**Section** : Contact Form
**Probleme** : 5 champs = friction elevee, abandon
**Solution** :
```
Avant: Nom, Email, Telephone, Type de projet, Message (5 champs)
Apres: Nom, Telephone, Description projet (3 champs)
```
- Email optionnel ou supprime
- Type de projet integre dans le message libre

**Fichiers** : `src/app/page.tsx` (lignes 416-462)
**Impact** : Conversions +30-50%

---

### 3. Ajouter checkbox RGPD
**Section** : Contact Form
**Probleme** : Non-conformite legale en France
**Solution** :
```jsx
<label className="gold-checkbox">
  <input type="checkbox" required />
  <span>J'accepte la <a href="/mentions-legales">politique de confidentialite</a></span>
</label>
```

**Fichiers** : `src/app/page.tsx`, `src/app/gold.css`
**Impact** : Conformite legale obligatoire

---

### 4. Reformuler le CTA du formulaire
**Section** : Contact Form
**Probleme** : "Envoyer ma demande" est generique
**Solution** :
```
Avant: "Envoyer ma demande"
Apres: "Recevoir mon devis gratuit sous 24h"
```

**Fichiers** : `src/app/page.tsx` (ligne 479)
**Impact** : Conversions +15-25%

---

### 5. Afficher les stats du hero sur mobile
**Section** : Hero
**Probleme** : Stats masquees sous 1280px (gold-hero-stats)
**Solution** :
- Repositionner les stats sous les CTAs sur mobile
- Ou afficher en ligne horizontale scrollable

**Fichiers** : `src/app/gold.css`, `src/app/page.tsx`
**Impact** : Credibilite mobile +++

---

### 6. Utiliser de VRAIES photos de projets
**Section** : Portfolio
**Probleme** : Images Unsplash = pas authentique
**Solution** :
- Demander au client ses vraies photos de chantier
- Avant/apres si disponibles
- Photos en cours de travaux

**Fichiers** : `src/lib/constants.ts` (PORTFOLIO_ITEMS)
**Impact** : Authenticite +++

---

### 7. Integrer vrais avis Google
**Section** : Temoignages
**Probleme** : 3 temoignages statiques sans preuve
**Solution** :
- Widget Google Reviews (si profil existant)
- Ou lien vers profil Google Business
- Afficher note moyenne et nombre d'avis

**Fichiers** : `src/app/page.tsx`, nouveau composant
**Impact** : Social proof +++

---

### 8. Ajouter proposition de valeur concrete dans hero
**Section** : Hero
**Probleme** : Sous-titre vague "Des realisations d'exception..."
**Solution** :
```
Avant: "Des realisations d'exception pour une clientele exigeante."
Apres: "Renovation cle en main | Devis sous 24h | Garantie decennale"
```

**Fichiers** : `src/app/page.tsx` (lignes 178-182)
**Impact** : Clarte +++

---

### 9. Afficher le SIRET dans le footer
**Section** : Footer
**Probleme** : Obligation legale non respectee
**Solution** :
```jsx
<span>SIRET : {SITE_CONFIG.siret}</span>
```
(SIRET deja present dans constants.ts : 933 728 610 00017)

**Fichiers** : `src/app/page.tsx` (footer)
**Impact** : Conformite legale

---

### 10. Ajouter photos avant/apres dans temoignages
**Section** : Temoignages
**Probleme** : Pas de preuve visuelle des projets mentionnes
**Solution** :
- Carousel avant/apres sous chaque temoignage
- Ou lien vers la realisation du portfolio

**Fichiers** : `src/app/page.tsx`, `src/lib/constants.ts`
**Impact** : Credibilite +++

---

## P2 - Actions Importantes

> A implementer apres P1 - Impact significatif

| # | Action | Section | Fichiers |
|---|--------|---------|----------|
| 1 | Ajouter telephone dans header desktop | Header | page.tsx |
| 2 | Reformuler CTA header : "Devis Gratuit en 24h" | Header | page.tsx |
| 3 | Element d'urgence : "Prochaines dispo : Mars 2026" | Hero | page.tsx |
| 4 | Ajouter "Devis Gratuit & Sans Engagement" aux trust badges | Trust | page.tsx |
| 5 | Badge "Plus demande" sur services phares | Services | page.tsx |
| 6 | Fourchette de prix sur services | Services | constants.ts |
| 7 | Donnees concretes portfolio : "45m2 - 3 sem - 25k" | Portfolio | constants.ts |
| 8 | CTA "Voir toutes nos realisations" | Portfolio | page.tsx |
| 9 | Date sur chaque temoignage | Temoignages | constants.ts |
| 10 | Lien profil Google Business | Temoignages | page.tsx |
| 11 | Mention sous formulaire : "Reponse sous 24h - Sans engagement" | Contact | page.tsx |
| 12 | Horaires + zone intervention dans footer | Footer | page.tsx |

---

## P3 - Nice-to-have

> A implementer si temps disponible - Impact incrementiel

| # | Action | Section |
|---|--------|---------|
| 1 | Badge "Reponse sous 24h" a cote CTA header | Header |
| 2 | Video testimoniale courte (30-60s) | Hero |
| 3 | Lier certifications a des documents | Trust |
| 4 | Badge "Assurance RC Pro" | Trust |
| 5 | Pages dediees par service | Services |
| 6 | Filtrage portfolio par type | Portfolio |
| 7 | Temoignages video courts | Temoignages |
| 8 | Integration Calendly RDV direct | Contact |
| 9 | Animation sticky CTA apres 5s scroll | Mobile |
| 10 | Icones reseaux sociaux footer | Footer |

---

## Roadmap Suggeree

### Sprint 1 : Conformite & Credibilite (P1 #1-3-9)
- [x] Supprimer faux logos partenaires
- [x] Ajouter checkbox RGPD
- [x] Afficher SIRET footer

### Sprint 2 : Formulaire & CTA (P1 #2-4)
- [x] Reduire formulaire a 3 champs
- [x] Reformuler CTA "Recevoir mon devis gratuit sous 24h"

### Sprint 3 : Hero & Mobile (P1 #5-8)
- [x] Stats visibles sur mobile
- [x] Proposition de valeur concrete

### Sprint 4 : Authenticite (P1 #6-7-10)
- [ ] Vraies photos de projets
- [ ] Integration avis Google
- [ ] Photos avant/apres

### Sprint 5 : Optimisations P2
- [ ] Actions P2 selon priorite

---

## KPIs a Suivre

| Metrique | Baseline | Objectif | Outil |
|----------|----------|----------|-------|
| Taux conversion formulaire | ~2% | 5%+ | Google Analytics |
| Taux de rebond | ~50% | < 40% | Google Analytics |
| Temps moyen sur page | ~2 min | 3+ min | Google Analytics |
| Scroll depth moyen | ~50% | 70%+ | Hotjar/GA |
| Clics CTA hero | - | 5%+ | Event tracking |
| Soumissions formulaire mobile | - | +50% | GA segments |

---

## Checklist Pre-Deploiement

Avant chaque mise en prod :

- [ ] Test formulaire complet (submit + reception email)
- [ ] Test mobile (iPhone SE, Android petit ecran)
- [ ] Test accessibilite (contraste, focus, aria)
- [ ] Lighthouse score > 90 (Performance, SEO, Accessibility)
- [ ] Verification RGPD checkbox fonctionnelle
- [ ] Test liens telephone (ouverture app tel)

---

## Ressources Necessaires

### Contenu a demander au client :
- [ ] Vraies photos de chantiers (10-15 minimum)
- [ ] Photos avant/apres (3-5 projets)
- [ ] Lien profil Google Business (si existant)
- [ ] Certifications/labels a afficher (RGE, Qualibat, etc.)
- [ ] Vrais partenaires/fournisseurs

### Assets a creer :
- [ ] Badge "Plus demande" (SVG/CSS)
- [ ] Composant checkbox RGPD
- [ ] Widget Google Reviews (ou alternative)
- [ ] Icones reseaux sociaux

---

## Suivi des Implementations

| Action | Status | Date | Commit |
|--------|--------|------|--------|
| Menu mobile hamburger | Done | 05/01/26 | 4dd0f64 |
| CTA sticky mobile | Done | 05/01/26 | 4dd0f64 |
| Documentation UX mobile | Done | 05/01/26 | faaacd9 |
| Remplacer faux logos partenaires | Done | 05/01/26 | 7009070 |
| Checkbox RGPD formulaire | Done | 05/01/26 | 7009070 |
| SIRET dans footer | Done | 05/01/26 | 7009070 |
| Formulaire réduit à 3 champs | Done | 05/01/26 | d23e850 |
| CTA "Recevoir mon devis gratuit sous 24h" | Done | 05/01/26 | d23e850 |
| Stats visibles sur mobile | Done | 05/01/26 | 5f48d6d |
| Proposition de valeur concrete | Done | 05/01/26 | 5f48d6d |
| P2: Telephone header desktop | Done | 05/01/26 | dbf3c40 |
| P2: CTA header "Devis Gratuit 24h" | Done | 05/01/26 | dbf3c40 |
| P2: Trust badge "Devis Gratuit" | Done | 05/01/26 | dbf3c40 |
| P2: Mention sous formulaire | Done | 05/01/26 | dbf3c40 |
| P2: Horaires + zone footer | Done | 05/01/26 | dbf3c40 |
| P2: Badge "Plus demandé" services | Done | 05/01/26 | 648f7ee |
| P2: CTA "Voir toutes nos réalisations" | Done | 05/01/26 | 648f7ee |
| P2: Date sur témoignages | Done | 05/01/26 | 648f7ee |
| P3: Badge "Réponse garantie" header | Done | 05/01/26 | 648f7ee |
| P3: Animation pulse CTA sticky | Done | 05/01/26 | 648f7ee |
| P3: Badge "Assurance RC Pro" | Done | 05/01/26 | 648f7ee |
