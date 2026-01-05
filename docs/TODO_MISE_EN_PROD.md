# Checklist Mise en Production - RA Solution

Guide complet pour déployer le site en production.

---

## 1. Nom de domaine

### Acheter le domaine

**Registrars recommandés :**
- [OVH](https://www.ovh.com/fr/domaines/) (~10€/an pour .fr)
- [Gandi](https://www.gandi.net/) (~15€/an)
- [Google Domains](https://domains.google/) (maintenant Squarespace)

**Nom suggéré :** `ra-solution.fr` ou `rasolution.fr`

### Configuration DNS (après achat)

Les enregistrements DNS dépendent de l'hébergeur choisi (voir section 2).

---

## 2. Hébergement

### Option A : Vercel (Recommandé pour Next.js)

**Avantages :** Gratuit, optimisé Next.js, SSL auto, déploiement Git

1. Créer un compte sur [vercel.com](https://vercel.com)
2. Importer le repo GitHub `site-radi`
3. Configurer les variables d'environnement :
   ```
   RESEND_API_KEY=re_xxxxx
   CONTACT_EMAIL=ra.solution@myyahoo.com
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
4. Déployer
5. Dans Settings > Domains : ajouter `ra-solution.fr`
6. Configurer DNS chez OVH/Gandi :
   ```
   Type: A     Name: @    Value: 76.76.21.21
   Type: CNAME Name: www  Value: cname.vercel-dns.com
   ```

### Option B : Netlify

1. Créer un compte sur [netlify.com](https://netlify.com)
2. New site from Git > Sélectionner le repo
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Configurer variables d'environnement
6. Ajouter domaine personnalisé

### Option C : VPS (OVH, Scaleway, DigitalOcean)

Plus complexe, nécessite configuration serveur Node.js + Nginx + PM2.

---

## 3. Variables d'environnement

Créer ces variables dans l'hébergeur :

| Variable | Description | Où l'obtenir |
|----------|-------------|--------------|
| `RESEND_API_KEY` | Clé API emails | [resend.com](https://resend.com) |
| `CONTACT_EMAIL` | Email réception devis | Ton email |
| `NEXT_PUBLIC_GA_ID` | ID Google Analytics | [analytics.google.com](https://analytics.google.com) |

---

## 4. Configuration email (Resend)

### Configurer le domaine d'envoi

1. Aller sur [resend.com](https://resend.com) > Domains
2. Ajouter `ra-solution.fr`
3. Configurer les DNS :
   ```
   Type: TXT   Name: @              Value: v=spf1 include:resend.com ~all
   Type: TXT   Name: resend._domainkey  Value: [fourni par Resend]
   Type: MX    Name: @              Value: feedback-smtp.resend.com (priority 10)
   ```
4. Vérifier le domaine
5. Mettre à jour le code pour utiliser `RA Solution <contact@ra-solution.fr>`

### Modifier le code (après vérification domaine)

Dans `src/app/api/contact/route.ts` :
```typescript
from: "RA Solution <contact@ra-solution.fr>",
```

---

## 5. Google Search Console

1. Aller sur [search.google.com/search-console](https://search.google.com/search-console)
2. Ajouter la propriété `https://ra-solution.fr`
3. Vérifier via DNS (ajouter enregistrement TXT)
4. Soumettre le sitemap : `https://ra-solution.fr/sitemap.xml`
5. Demander l'indexation de la page d'accueil

---

## 6. Google Analytics

1. Aller sur [analytics.google.com](https://analytics.google.com)
2. Créer une propriété GA4 (voir `docs/SETUP_GOOGLE_ANALYTICS.md`)
3. Récupérer l'ID `G-XXXXXXXXXX`
4. Ajouter en variable d'environnement

---

## 7. Google Business Profile

**Important pour le SEO local !**

1. Aller sur [business.google.com](https://business.google.com)
2. Créer une fiche pour "RA Solution"
3. Remplir :
   - Catégorie : "Entreprise de rénovation"
   - Adresse : 5 rue de la Gaîté, 93000 Bobigny
   - Téléphone : 06 23 30 44 45
   - Horaires : Lun-Sam 8h-19h
   - Site web : https://ra-solution.fr
4. Vérifier (courrier postal ou téléphone)
5. Ajouter des photos des réalisations
6. Demander des avis aux clients satisfaits

---

## 8. Tests avant lancement

### Fonctionnels
- [ ] Formulaire de contact fonctionne (email reçu)
- [ ] Liens téléphone fonctionnent sur mobile
- [ ] Navigation entre pages OK
- [ ] Filtrage portfolio fonctionne
- [ ] Pages services accessibles

### Mobile
- [ ] Test sur iPhone (Safari)
- [ ] Test sur Android (Chrome)
- [ ] CTA sticky visible
- [ ] Menu hamburger fonctionne

### Performance
- [ ] Lighthouse score > 90
- [ ] Images chargent rapidement
- [ ] Pas d'erreurs console

### SEO
- [ ] `/robots.txt` accessible
- [ ] `/sitemap.xml` accessible
- [ ] Balises meta présentes (View Source)

---

## 9. Après lancement

### Semaine 1
- [ ] Vérifier réception emails formulaire
- [ ] Surveiller Google Analytics
- [ ] Tester sur différents appareils

### Mois 1
- [ ] Vérifier indexation Google (site:ra-solution.fr)
- [ ] Ajouter premiers avis Google Business
- [ ] Partager sur réseaux sociaux

### Ongoing
- [ ] Ajouter nouvelles réalisations au portfolio
- [ ] Collecter et afficher avis clients
- [ ] Mettre à jour les photos avant/après

---

## Checklist finale

```
[ ] Domaine acheté et configuré
[ ] Site déployé sur Vercel/Netlify
[ ] Variables d'environnement configurées
[ ] SSL actif (https://)
[ ] Emails fonctionnels
[ ] Google Analytics actif
[ ] Google Search Console configuré
[ ] Google Business Profile créé
[ ] Tests mobile OK
[ ] Lighthouse > 90
```

---

## Support

En cas de problème :
- Vercel : [vercel.com/docs](https://vercel.com/docs)
- Resend : [resend.com/docs](https://resend.com/docs)
- Next.js : [nextjs.org/docs](https://nextjs.org/docs)
