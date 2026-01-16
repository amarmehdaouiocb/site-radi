# Configuration Google Analytics 4

Guide pour activer le tracking des conversions sur le site RA Bâtiment.

---

## 1. Créer un compte Google Analytics

1. Va sur [analytics.google.com](https://analytics.google.com)
2. Connecte-toi avec un compte Google
3. Clique sur **"Commencer les mesures"** ou **"Créer un compte"**

---

## 2. Configurer la propriété

### Étape 1 : Nom du compte
- Nom du compte : `RA Bâtiment` (ou le nom de ton choix)
- Coche les options de partage selon tes préférences
- Clique **Suivant**

### Étape 2 : Propriété
- Nom de la propriété : `Site RA Bâtiment`
- Fuseau horaire : `France`
- Devise : `Euro (€)`
- Clique **Suivant**

### Étape 3 : Informations sur l'entreprise
- Secteur : `Construction et immobilier`
- Taille : `Petite (1-10 employés)`
- Objectifs : Coche `Générer des prospects` et `Analyser le comportement des utilisateurs`
- Clique **Créer**

### Étape 4 : Flux de données
- Sélectionne **Web**
- URL du site : `https://ton-domaine.fr` (remplace par le vrai domaine)
- Nom du flux : `Site principal`
- Clique **Créer le flux**

---

## 3. Récupérer l'ID de mesure

Après création du flux :
1. Tu verras un **ID de mesure** au format `G-XXXXXXXXXX`
2. Copie cet ID

---

## 4. Configurer le site

1. Crée ou édite le fichier `.env.local` à la racine du projet :

```bash
# Dans le terminal, à la racine du projet
cp .env.local.example .env.local
```

2. Ouvre `.env.local` et ajoute ton ID :

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

3. Redémarre le serveur de développement :

```bash
npm run dev
```

---

## 5. Vérifier l'installation

### En développement
1. Ouvre les DevTools (F12) → Onglet **Network**
2. Filtre par `gtag` ou `google`
3. Tu devrais voir des requêtes vers `googletagmanager.com`

### En production
1. Déploie le site
2. Dans Google Analytics, va dans **Rapports** → **Temps réel**
3. Ouvre ton site dans un autre onglet
4. Tu devrais voir ta visite apparaître

---

## 6. Événements trackés automatiquement

Le site envoie ces événements à GA :

| Événement | Catégorie | Déclencheur |
|-----------|-----------|-------------|
| `form_submit` | Conversion | Soumission formulaire contact |
| `cta_click` | Engagement | Clic sur bouton CTA |
| `phone_click` | Conversion | Clic sur numéro de téléphone |
| `portfolio_filter` | Engagement | Filtrage des réalisations |
| `service_view` | Navigation | Vue d'une page service |

---

## 7. Créer des objectifs de conversion

Dans GA4, configure des conversions pour suivre les leads :

1. Va dans **Admin** → **Événements**
2. Trouve `form_submit` et `phone_click`
3. Active **Marquer comme conversion** pour ces événements

---

## 8. Tableau de bord recommandé

Pour suivre les performances :

### Rapports → Acquisition
- D'où viennent les visiteurs (Google, direct, réseaux sociaux)

### Rapports → Engagement → Événements
- Nombre de soumissions de formulaire
- Nombre de clics téléphone

### Explorer → Créer un entonnoir
- Visite page d'accueil → Vue section contact → Soumission formulaire

---

## Dépannage

### GA ne s'affiche pas en dev
- Vérifie que `NEXT_PUBLIC_GA_ID` est bien défini dans `.env.local`
- Redémarre le serveur (`npm run dev`)

### Pas de données en temps réel
- Les bloqueurs de pub peuvent bloquer GA
- Teste en navigation privée sans extensions

### Events non trackés
- Ouvre la console (F12) et vérifie qu'il n'y a pas d'erreurs
- Vérifie que `window.gtag` existe en tapant `gtag` dans la console

---

## Ressources

- [Documentation GA4](https://support.google.com/analytics/answer/9304153)
- [Guide des événements](https://support.google.com/analytics/answer/9322688)
- [Débugger GA4](https://support.google.com/analytics/answer/7201382)
