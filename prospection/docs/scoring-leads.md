# Scoring des Leads DVF - RA Bâtiment

## Principe

Chaque lead reçoit un **score de 0 à 100 points** pour prioriser les efforts de prospection.
Plus le score est élevé, plus le lead a de chances de se convertir en chantier.

**Note** : La localisation géographique n'est PAS prise en compte. Tous les départements IDF sont traités de manière égale.

---

## Les 3 critères de scoring

### 1. Fraîcheur de la vente (max 50 points)

Un acheteur récent pense encore à ses travaux. Plus le temps passe, plus il a déjà fait appel à quelqu'un ou renoncé.

**Important** : La fraîcheur est calculée par rapport à la date de vente la plus récente dans le fichier DVF (pas par rapport à aujourd'hui), car les données ont ~6 mois de retard.

| Délai depuis la vente la plus récente | Points |
|---------------------------------------|--------|
| Même semaine | 50 |
| Même mois | 42 |
| 1 à 2 mois avant | 33 |
| 2 à 3 mois avant | 25 |
| 3 à 4 mois avant | 17 |
| Plus ancien | 8 |

**Logique** : Les ventes de fin juin 2025 sont les plus "fraîches" du fichier S1 2025.

---

### 2. Budget potentiel (max 35 points)

Le prix d'achat de la maison indique la capacité financière du propriétaire.

| Prix d'achat | Points | Raison |
|--------------|--------|--------|
| 200 000 € - 500 000 € | 35 | Sweet spot : budget suffisant, pas de gros appels d'offres |
| 150 000 € - 600 000 € | 26 | Bon potentiel |
| 100 000 € - 800 000 € | 18 | Correct |
| Moins de 100 000 € | 9 | Petit budget, travaux limités |
| Plus de 800 000 € | 14 | Luxe : concurrence forte, appels d'offres |

**Logique** : Une maison à 350k€ = propriétaire avec du budget mais pas dans le luxe.

---

### 3. Surface du bien (max 15 points)

La taille de la maison indique l'ampleur potentielle des travaux.

| Surface | Points | Raison |
|---------|--------|--------|
| 80 - 150 m² | 15 | Taille idéale : rénovation complète possible |
| 60 - 200 m² | 11 | Bon potentiel |
| Autre taille | 6 | Travaux plus limités ou très gros chantier |
| Inconnue | 3 | Pas d'info |

**Logique** : Une maison de 100m² = cuisine, salle de bain, peut-être extension.

---

## Calcul du score

```
Score = Fraîcheur + Budget + Surface
        (max 50)    (max 35)  (max 15)  =  100 pts
```

### Exemple 1 : Lead idéal (score 100)
- Vente **fin juin 2025** (la plus récente) → 50 pts
- Prix : **320 000 €** → 35 pts
- Surface : **95 m²** → 15 pts
- **Score total : 100** 🔥

### Exemple 2 : Lead correct (score 70)
- Vente **avril 2025** (2 mois avant) → 33 pts
- Prix : **180 000 €** → 26 pts
- Surface : **70 m²** → 11 pts
- **Score total : 70** 👍

### Exemple 3 : Lead faible (score 28)
- Vente **janvier 2025** (6 mois avant) → 8 pts
- Prix : **950 000 €** → 14 pts
- Surface : **250 m²** → 6 pts
- **Score total : 28** 📋

---

## Classification des priorités

| Score | Priorité | Leads | Action recommandée |
|-------|----------|-------|-------------------|
| 90-100 | 🔥 Très haute | 585 | Contacter en priorité absolue |
| 75-89 | ⭐ Haute | 2 222 | 2ème vague de courriers |
| 55-74 | 👍 Moyenne | 6 612 | Si temps disponible |
| < 55 | 📋 Basse | 4 339 | Ignorer ou garder pour plus tard |

---

## Fichiers générés

| Fichier | Contenu |
|---------|---------|
| `leads-dvf-2025-s1-idf.tsv` | Tous les leads IDF (13 758) |
| `leads-dvf-2025-s1-idf-scored.tsv` | Tous les leads avec score et priorité |
| `leads-top-priorite.tsv` | Leads score 90+ uniquement (585) |

---

## Répartition géographique (top priorité 90+)

| Département | Leads |
|-------------|-------|
| 77 - Seine-et-Marne | 259 |
| 78 - Yvelines | 148 |
| 91 - Essonne | 69 |
| 93 - Seine-Saint-Denis | 69 |
| 95 - Val-d'Oise | 19 |
| 92 - Hauts-de-Seine | 12 |
| 94 - Val-de-Marne | 9 |

---

## Modifier le scoring

Le script de scoring est dans : `prospection/scripts/score-leads.mjs`

Pour modifier les règles :
1. Modifier les fonctions `scoreFraicheur()`, `scoreBudget()`, `scoreSurface()`
2. Ajuster les seuils de priorité (90/75/55)
3. Relancer : `node prospection/scripts/score-leads.mjs`

---

## Limites

- **Pas de coordonnées** : DVF ne contient pas les noms, téléphones ou emails
- **Délai de publication** : Les données DVF ont ~6 mois de retard
- **Adresses uniquement** : Le contact se fait par courrier postal ou porte-à-porte
