# Référence Sit@del2 - Dictionnaire des variables

## Source des données

**Sit@del2** (Système d'Information et de Traitement Automatisé des Données Élémentaires sur les Logements et les locaux) est la base de données officielle des permis de construire et autorisations d'urbanisme en France.

- **URL** : https://www.data.gouv.fr/fr/datasets/liste-des-permis-de-construire-et-autres-autorisations-durbanisme/
- **Mise à jour** : Mensuelle
- **Couverture** : Depuis 2013

---

## Types de permis (`TYPE_DAU`)

| Code | Nom complet | Description |
|------|-------------|-------------|
| **PC** | Permis de Construire | Travaux > 20m² de surface plancher ou > 40m² en zone urbaine avec PLU |
| **DP** | Déclaration Préalable | Petits travaux < 20m² ou modifications extérieures (façade, toiture) |
| **PA** | Permis d'Aménager | Lotissements, campings, parkings > 10 places |
| **PD** | Permis de Démolir | Démolition totale ou partielle d'un bâtiment |

### Pertinence pour la prospection

| Type | Intérêt | Raison |
|------|---------|--------|
| PC | ⭐⭐⭐⭐⭐ | Gros travaux, budget conséquent |
| DP | ⭐⭐⭐ | Petits travaux mais volume important |
| PA | ❌ | Promoteurs/lotisseurs, pas de particuliers |
| PD | ⭐ | Peut précéder une reconstruction |

---

## Nature du projet (`NATURE_PROJET_DECLAREE` / `NATURE_PROJET_COMPLETEE`)

| Code | Signification | Description |
|------|---------------|-------------|
| **1** | Construction neuve | Nouveau bâtiment sur terrain vierge |
| **2** | Travaux sur existant | Extension, surélévation, réhabilitation |

### Détail pour "Travaux sur existant" (code 2)

Les colonnes suivantes précisent le type de travaux :

| Colonne | Valeurs | Description |
|---------|---------|-------------|
| `I_EXTENSION` | true/false | Agrandissement horizontal du bâtiment |
| `I_SURELEVATION` | true/false | Ajout d'étages supplémentaires |
| `I_NIVSUPP` | true/false | Création de niveaux supplémentaires |
| `TYPE_TRANSFO_PRINCIPAL` | code | Type de transformation principale |

---

## État du dossier (`ETAT_DAU`)

| Code | État | Description |
|------|------|-------------|
| **1** | Déposé | Dossier déposé, en attente d'instruction |
| **2** | En cours d'instruction | En cours d'examen |
| **3** | Sursis à statuer | Décision suspendue |
| **4** | Refusé | Permis refusé |
| **5** | Autorisé | ✅ Permis accordé |
| **6** | Annulé | Permis annulé après autorisation |
| **7** | DOC | Déclaration d'ouverture de chantier |
| **8** | DAACT | Déclaration d'achèvement de travaux |

### Pertinence pour la prospection

| État | Intérêt | Raison |
|------|---------|--------|
| 5 (Autorisé) | ⭐⭐⭐⭐⭐ | Projet validé, cherche des artisans |
| 7 (DOC) | ⭐⭐⭐ | Travaux commencés, peut encore changer d'artisan |
| 1-2 | ⭐⭐ | Incertain, peut être refusé |
| 4, 6 | ❌ | Projet annulé |
| 8 | ❌ | Travaux terminés |

---

## Dates importantes

| Colonne | Description |
|---------|-------------|
| `DATE_REELLE_AUTORISATION` | Date d'accord du permis |
| `DATE_REELLE_DOC` | Date de début des travaux |
| `DATE_REELLE_DAACT` | Date de fin des travaux |
| `AN_DEPOT` | Année de dépôt du dossier |

### Calcul de la fraîcheur

Plus le permis est récent, plus le prospect est "chaud" :

| Ancienneté | Score fraîcheur |
|------------|-----------------|
| < 1 mois | 50 pts |
| 1-2 mois | 42 pts |
| 2-3 mois | 35 pts |
| 3-4 mois | 28 pts |
| 4-6 mois | 20 pts |
| 6-12 mois | 12 pts |
| > 12 mois | 5 pts |

---

## Adresse du terrain

| Colonne | Description | Exemple |
|---------|-------------|---------|
| `ADR_NUM_TER` | Numéro de rue | 12 |
| `ADR_TYPEVOIE_TER` | Type de voie | RUE, AVENUE, BOULEVARD |
| `ADR_LIBVOIE_TER` | Nom de la voie | DE LA PAIX |
| `ADR_LIEUDIT_TER` | Lieu-dit | LES MUSIC |
| `ADR_LOCALITE_TER` | Ville | BOBIGNY |
| `ADR_CODPOST_TER` | Code postal | 93000 |

### Construction de l'adresse complète

```
{ADR_NUM_TER} {ADR_TYPEVOIE_TER} {ADR_LIBVOIE_TER}
{ADR_CODPOST_TER} {ADR_LOCALITE_TER}
```

Exemple : `12 RUE DE LA PAIX, 93000 BOBIGNY`

---

## Surfaces

| Colonne | Description | Unité |
|---------|-------------|-------|
| `SUPERFICIE_TERRAIN` | Surface du terrain | m² |
| `SURF_HAB_CREEE` | Surface habitable créée | m² |
| `SURF_HAB_AVANT` | Surface habitable avant travaux | m² |
| `SURF_HAB_DEMOLIE` | Surface habitable démolie | m² |
| `SURF_HAB_TRANSFORMEE` | Surface transformée | m² |

### Indicateur de budget potentiel

| Surface créée | Potentiel |
|---------------|-----------|
| 50-150 m² | ⭐⭐⭐⭐⭐ Idéal (15 pts) |
| 30-200 m² | ⭐⭐⭐⭐ Bon (11 pts) |
| < 30 m² | ⭐⭐⭐ Petit projet (7 pts) |
| > 200 m² | ⭐⭐ Gros chantier (7 pts) |

---

## Catégorie du demandeur (`CAT_DEM`)

| Code | Catégorie |
|------|-----------|
| 10 | Particulier |
| 20 | Société civile immobilière (SCI) |
| 30 | Société privée (hors SCI) |
| 40 | Organisme HLM |
| 50 | Administration publique |
| 60 | Autre personne morale |

### Pertinence pour la prospection

| Catégorie | Intérêt | Raison |
|-----------|---------|--------|
| 10 (Particulier) | ⭐⭐⭐⭐⭐ | Cible principale |
| 20 (SCI) | ⭐⭐⭐⭐ | Souvent des particuliers |
| 30 (Société) | ⭐⭐ | Appels d'offres, concurrence forte |
| 40-60 | ❌ | Marchés publics |

---

## Destination principale (`DESTINATION_PRINCIPALE`)

| Code | Destination |
|------|-------------|
| 1 | Habitation |
| 2 | Hébergement hôtelier |
| 3 | Bureaux |
| 4 | Commerce |
| 5 | Artisanat |
| 6 | Industrie |
| 7 | Exploitation agricole |
| 8 | Entrepôt |
| 9 | Service public |

### Fichier utilisé

Le fichier **"Liste des autorisations créant des logements"** contient uniquement les destinations 1 (Habitation), ce qui correspond à notre cible.

---

## Type principal de logements créés (`TYPE_PRINCIP_LOGTS_CREES`)

| Code | Type |
|------|------|
| 1 | Logement individuel pur |
| 2 | Logement individuel groupé |
| 3 | Logement collectif |
| 4 | Résidence (étudiants, seniors, etc.) |

---

## Utilisation (`UTILISATION`)

| Code | Utilisation |
|------|-------------|
| 1 | Résidence principale |
| 2 | Résidence secondaire |
| 3 | Location |
| 9 | Non déterminé |

---

## Nombre de pièces

| Colonne | Description |
|---------|-------------|
| `NB_LGT_1P` | Nombre de studios (T1) |
| `NB_LGT_2P` | Nombre de T2 |
| `NB_LGT_3P` | Nombre de T3 |
| `NB_LGT_4P` | Nombre de T4 |
| `NB_LGT_5P` | Nombre de T5 |
| `NB_LGT_6P_PLUS` | Nombre de T6+ |

---

## Colonnes géographiques

| Colonne | Description | Exemple |
|---------|-------------|---------|
| `REG_CODE` | Code région | 11 (Île-de-France) |
| `REG_LIBELLE` | Nom région | Île-de-France |
| `DEP_CODE` | Code département | 93 |
| `DEP_LIBELLE` | Nom département | Seine-Saint-Denis |
| `COMM` | Code commune INSEE | 93008 (Bobigny) |

### Codes régions

| Code | Région |
|------|--------|
| 11 | Île-de-France |
| 24 | Centre-Val de Loire |
| 27 | Bourgogne-Franche-Comté |
| 28 | Normandie |
| 32 | Hauts-de-France |
| ... | ... |

---

## Filtres recommandés pour la prospection RA Bâtiment

```
DEP_CODE IN ('75', '77', '78', '91', '92', '93', '94', '95')  -- Île-de-France
AND ETAT_DAU = 5                                              -- Permis autorisé
AND (I_EXTENSION = 'true' OR I_SURELEVATION = 'true')         -- Travaux sur existant
AND DATE_REELLE_AUTORISATION > DATE('now', '-12 months')      -- Récent
AND CAT_DEM IN (10, 20)                                       -- Particuliers / SCI
```

---

## Liens utiles

- [Dataset data.gouv.fr](https://www.data.gouv.fr/fr/datasets/liste-des-permis-de-construire-et-autres-autorisations-durbanisme/)
- [Méthodologie Sit@del2](https://www.statistiques.developpement-durable.gouv.fr/la-base-de-donnees-sitadel2-methodologie)
- [Dictionnaire des variables (XLS)](https://www.data.gouv.fr/fr/datasets/liste-des-permis-de-construire-et-autres-autorisations-durbanisme/) - Télécharger "Dictionnaire variables logements"
