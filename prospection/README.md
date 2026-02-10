# Système de Prospection RA Bâtiment

Système automatisé de prospection outbound pour décrocher des contrats de rénovation en Île-de-France.

## Architecture

```
prospection/
├── README.md                    # Ce fichier
├── crm/
│   ├── CRM-SETUP.md            # Guide de configuration Google Sheets
│   └── apps-script/            # Scripts Google Apps Script
│       ├── Code.gs             # Script principal
│       ├── SitadelImport.gs    # Import permis de construire
│       ├── DVFImport.gs        # Import ventes immobilières
│       ├── Alertes.gs          # Système d'alertes
│       └── CourrierPDF.gs      # Génération de courriers
├── templates/
│   ├── courrier/
│   │   ├── courrier-permis.html
│   │   └── courrier-dvf.html
│   └── emails/
│       ├── syndic-initial.md
│       ├── syndic-relance-1.md
│       ├── syndic-relance-2.md
│       ├── agent-immo-initial.md
│       └── agent-immo-relance.md
├── sources/
│   ├── sitadel-guide.md        # Guide Sit@del2 (permis)
│   ├── dvf-guide.md            # Guide DVF (ventes immo)
│   └── facebook-groups.md      # Liste groupes Facebook IDF
└── docs/
    ├── routine-quotidienne.md  # Check-list quotidienne
    └── metriques.md            # Suivi des KPIs
```

## Démarrage Rapide

### 1. Configurer le CRM Google Sheets

1. Créer un nouveau Google Sheets
2. Copier/coller le script `apps-script/Code.gs` dans Extensions > Apps Script
3. Exécuter la fonction `setupCRM()` pour créer les onglets
4. Autoriser les permissions demandées

### 2. Importer les premiers leads

**Permis de construire (Sit@del2) :**
1. Télécharger les données sur [data.gouv.fr](https://www.data.gouv.fr/fr/datasets/base-des-permis-de-construire-sitadel/)
2. Utiliser la fonction `importSitadel()` dans le CRM

**Ventes immobilières (DVF) :**
1. Utiliser la fonction `importDVF()` qui appelle l'API automatiquement

### 3. Configurer les alertes

1. Aller dans Extensions > Apps Script
2. Cliquer sur "Déclencheurs" (icône horloge)
3. Ajouter un déclencheur quotidien pour `checkRelances()`

### 4. Lancer la prospection

- **Courrier postal** : Utiliser le menu "Prospection > Générer courrier PDF"
- **Cold email B2B** : Utiliser les templates dans `templates/emails/`
- **Veille Facebook** : Suivre la liste dans `sources/facebook-groups.md`

## Budget

**0€** - Tous les outils utilisés sont gratuits :
- Google Sheets (CRM)
- Google Apps Script (automatisation)
- data.gouv.fr (données publiques)
- API DVF etalab (gratuite)
- Gmail (envoi emails)

## Zone de couverture

Île-de-France uniquement :
- 75 - Paris
- 77 - Seine-et-Marne
- 78 - Yvelines
- 91 - Essonne
- 92 - Hauts-de-Seine
- 93 - Seine-Saint-Denis
- 94 - Val-de-Marne
- 95 - Val-d'Oise

## Objectifs mensuels

| Métrique | Objectif |
|----------|----------|
| Leads permis importés | 50+ |
| Leads DVF importés | 30+ |
| Courriers envoyés | 20+ |
| Emails B2B envoyés | 200+ |
| RDV obtenus | 5+ |
| Devis envoyés | 3+ |

## Support

Pour toute question, consulter les guides détaillés dans chaque dossier.
