# Guide Sit@del2 - Permis de Construire

## Qu'est-ce que Sit@del2 ?

**Sit@del2** est la base de données officielle des permis de construire et autorisations d'urbanisme en France. Elle est mise à jour mensuellement et contient :

- Permis de construire
- Permis d'aménager
- Déclarations préalables
- Permis de démolir

## Pourquoi c'est utile pour la prospection ?

Les personnes ayant obtenu un permis de construire ou une autorisation de travaux sont des prospects **chauds** :
- Ils ont un projet concret et validé
- Ils cherchent activement des artisans
- Le timing est parfait pour les contacter

## Accès aux données

### 1. Data.gouv.fr (Recommandé)

**URL** : https://www.data.gouv.fr/fr/datasets/base-des-permis-de-construire-sitadel/

**Format** : CSV téléchargeable

**Mise à jour** : Mensuelle (généralement en milieu de mois)

### 2. Géoportail de l'Urbanisme

**URL** : https://www.geoportail-urbanisme.gouv.fr/

Permet de visualiser les permis sur une carte.

## Colonnes importantes du CSV

| Colonne | Description | Utilisation |
|---------|-------------|-------------|
| `DEP` | Code département | Filtrer par IDF (75-95) |
| `COMM` | Code commune | Localisation |
| `LIBELLE_COMMUNE` | Nom de la ville | Adresse |
| `ADRESSE_TERRAIN` | Adresse du chantier | Contact postal |
| `NAT_PROJ` | Nature du projet | Filtrer par type |
| `SURF_PLANCHER` | Surface en m² | Estimer le budget |
| `DATE_REELLE` | Date d'autorisation | Fraîcheur du lead |

## Types de projets à cibler

### ✅ À contacter (rénovation)
- "Travaux sur construction existante"
- "Extension"
- "Surélévation"
- "Changement de destination"
- "Réhabilitation"

### ❌ À ignorer
- "Construction neuve" (déjà un constructeur)
- "Démolition seule"
- "Lotissement"

## Workflow d'import

### Étape 1 : Télécharger les données
1. Aller sur data.gouv.fr
2. Chercher "Sit@del2"
3. Télécharger le CSV le plus récent

### Étape 2 : Préparer l'import
1. Ouvrir le CSV dans Excel ou LibreOffice
2. Copier les données (avec en-têtes)
3. Créer un onglet "Import Sitadel" dans le CRM
4. Coller les données

### Étape 3 : Lancer le filtrage
1. Menu Prospection > Import > Permis de construire
2. Le script filtre automatiquement :
   - Uniquement IDF
   - Uniquement travaux sur existant
   - Suppression des doublons

### Étape 4 : Exploiter les leads
1. Générer les courriers PDF
2. Imprimer et envoyer
3. Suivre les retours dans le CRM

## Fréquence recommandée

- **Import** : 1 fois par mois (après la mise à jour data.gouv)
- **Envoi courriers** : Dans les 2 semaines suivant l'import
- **Relance** : 7 jours après l'envoi du courrier

## Conseils

### Pour améliorer le taux de réponse

1. **Envoyer rapidement** : Plus le permis est récent, plus le prospect cherche des artisans
2. **Personnaliser** : Mentionner l'adresse exacte et le type de travaux
3. **Proposer une valeur** : Devis gratuit, visite technique offerte

### Pour éviter les faux positifs

- Les gros projets (> 500m²) sont souvent gérés par des promoteurs
- Les permis de plus de 6 mois peuvent être déjà en cours de réalisation
- Vérifier sur Google Maps si le chantier n'est pas déjà terminé

## Statistiques attendues

| Département | Permis/mois estimés | Leads qualifiés |
|-------------|---------------------|-----------------|
| 75 Paris | ~500 | ~50-80 |
| 92 Hauts-de-Seine | ~300 | ~40-60 |
| 93 Seine-Saint-Denis | ~200 | ~30-50 |
| 94 Val-de-Marne | ~200 | ~30-50 |
| 77/78/91/95 | ~150 chacun | ~20-40 |

## Limitations

- Pas de coordonnées téléphoniques (uniquement adresse)
- Pas de nom du propriétaire (courrier "À l'attention de l'occupant")
- Délai de publication (~1-2 mois après l'autorisation)
