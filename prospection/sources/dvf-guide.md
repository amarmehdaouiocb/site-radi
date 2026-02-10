# Guide DVF - Demandes de Valeurs Foncières

## Qu'est-ce que DVF ?

**DVF (Demandes de Valeurs Foncières)** est la base de données publique de toutes les transactions immobilières en France. Elle contient :

- Ventes de maisons et appartements
- Prix de vente
- Surface
- Localisation exacte
- Date de la transaction

## Pourquoi c'est utile pour la prospection ?

Les acheteurs récents de biens immobiliers sont des prospects **très qualifiés** :
- Ils viennent d'investir et veulent valoriser leur bien
- Les maisons anciennes nécessitent souvent des travaux
- Le budget est disponible (prêt immobilier récent)
- Timing idéal : 1-6 mois après l'achat

## Accès aux données

### 1. Application DVF Etalab (Visualisation)

**URL** : https://app.dvf.etalab.gouv.fr/

Permet de visualiser les ventes sur une carte interactive.

### 2. API DVF (Automatisation)

**URL** : https://api.cquest.org/dvf

API gratuite pour récupérer les données par département.

### 3. Téléchargement brut

**URL** : https://files.data.gouv.fr/geo-dvf/

Fichiers CSV complets par année.

## Colonnes importantes

| Colonne | Description | Utilisation |
|---------|-------------|-------------|
| `date_mutation` | Date de la vente | Filtrer les ventes récentes |
| `valeur_fonciere` | Prix de vente | Estimer le budget travaux |
| `adresse_numero` | Numéro | Adresse complète |
| `adresse_nom_voie` | Nom de rue | Adresse complète |
| `code_postal` | Code postal | Localisation |
| `nom_commune` | Ville | Localisation |
| `type_local` | Maison/Appart | Filtrer par type |
| `surface_reelle_bati` | Surface m² | Taille du bien |

## Stratégie de ciblage

### Critères de filtrage

| Critère | Valeur | Raison |
|---------|--------|--------|
| Date vente | < 3 mois | Acheteurs récents |
| Type de bien | Maison | Plus de travaux potentiels |
| Prix | 150k€ - 600k€ | Budget travaux disponible |
| Surface | > 60m² | Projets plus importants |

### Bonus : Croiser avec l'âge du bien

Les maisons construites avant 1990 ont plus de chances de nécessiter :
- Mise aux normes électriques
- Rénovation énergétique
- Modernisation salle de bain/cuisine

Cette info n'est pas dans DVF mais peut être estimée via le cadastre.

## Workflow d'import

### Via l'API (Automatique)

1. Menu Prospection > Import > Ventes immobilières (DVF)
2. Entrer le code département (ex: 93)
3. Le script récupère les ventes des 3 derniers mois
4. Filtrage automatique (maisons uniquement)
5. Import dans le CRM

### Via téléchargement manuel

1. Télécharger le CSV sur https://app.dvf.etalab.gouv.fr/
2. Créer un onglet "Import DVF" dans le CRM
3. Coller les données
4. Menu Prospection > Import > DVF

## Rédaction du courrier

### Angle recommandé

Ne pas mentionner qu'on sait qu'ils ont acheté (peut sembler intrusif).
Utiliser l'angle "bienvenue dans le quartier" :

> "Nous nous permettons de nous présenter en tant qu'artisan local
> spécialisé en rénovation..."

### Propositions de valeur

1. **Estimation gratuite** : "Nous pouvons évaluer les travaux potentiels de votre bien"
2. **Priorité** : "Répondez d'ici [date] pour bénéficier d'une remise de 10%"
3. **Proximité** : "Nous intervenons régulièrement dans votre quartier"

## Timing optimal

| Délai après achat | Probabilité travaux | Action |
|-------------------|---------------------|--------|
| 0-1 mois | ⭐⭐⭐⭐⭐ | Courrier prioritaire |
| 1-3 mois | ⭐⭐⭐⭐ | Courrier standard |
| 3-6 mois | ⭐⭐⭐ | Email si possible |
| 6-12 mois | ⭐⭐ | Basse priorité |

## Statistiques attendues

### Volume mensuel estimé (IDF)

| Département | Ventes maisons/mois | Leads qualifiés |
|-------------|---------------------|-----------------|
| 77 Seine-et-Marne | ~800 | ~100-150 |
| 78 Yvelines | ~600 | ~80-120 |
| 91 Essonne | ~500 | ~70-100 |
| 92 Hauts-de-Seine | ~300 | ~40-60 |
| 93 Seine-Saint-Denis | ~400 | ~50-80 |
| 94 Val-de-Marne | ~350 | ~45-70 |
| 95 Val-d'Oise | ~450 | ~60-90 |

### Taux de conversion attendu

- Courrier envoyé → Réponse : 2-5%
- Réponse → RDV : 50%
- RDV → Devis : 80%
- Devis → Signé : 20-30%

## Limitations

- Délai de publication : 6 mois après la vente
- Pas de coordonnées du nouveau propriétaire
- Adresse parfois incomplète
- API peut être lente ou indisponible

## Conseils avancés

### Enrichir les données

1. **Google Maps** : Vérifier visuellement l'état du bien
2. **Pages Blanches** : Tenter de trouver le numéro (anciens propriétaires)
3. **Cadastre** : Vérifier la surface et l'année de construction

### Éviter les faux positifs

- Ventes à < 50k€ : Souvent des garages ou dépendances
- Ventes à > 800k€ : Biens luxueux avec architecte dédié
- Ventes entre SCI : Transactions familiales
