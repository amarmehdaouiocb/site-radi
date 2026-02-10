# Configuration du CRM Google Sheets

## Création du CRM

### Étape 1 : Créer le fichier

1. Aller sur [sheets.google.com](https://sheets.google.com)
2. Créer un nouveau document
3. Renommer : **"CRM RA Bâtiment - Prospection"**

### Étape 2 : Installer le script

1. Aller dans **Extensions > Apps Script**
2. Supprimer le code existant
3. Créer les fichiers suivants et copier le code :
   - `Code.gs` (depuis `apps-script/Code.gs`)
   - `SitadelImport.gs` (depuis `apps-script/SitadelImport.gs`)
   - `DVFImport.gs` (depuis `apps-script/DVFImport.gs`)
   - `Alertes.gs` (depuis `apps-script/Alertes.gs`)
   - `CourrierPDF.gs` (depuis `apps-script/CourrierPDF.gs`)
4. Cliquer sur **Sauvegarder** (Ctrl+S)
5. Exécuter `setupCRM()` depuis le menu déroulant
6. Autoriser les permissions

### Étape 3 : Configurer les déclencheurs automatiques

1. Dans Apps Script, cliquer sur l'icône **horloge** (Déclencheurs)
2. Ajouter un déclencheur :
   - Fonction : `checkRelances`
   - Événement : Heure
   - Fréquence : Quotidien (9h du matin recommandé)

---

## Structure des onglets

### Onglet 1 : Leads Particuliers

| Colonne | Type | Description |
|---------|------|-------------|
| A - ID | Auto | Identifiant unique |
| B - Date ajout | Auto | Date d'import |
| C - Source | Texte | Permis / DVF / Facebook / Autre |
| D - Nom | Texte | Nom du prospect (si connu) |
| E - Adresse | Texte | Adresse complète |
| F - Code postal | Texte | Pour filtres géographiques |
| G - Ville | Texte | Commune |
| H - Téléphone | Texte | Numéro si trouvé |
| I - Email | Texte | Email si trouvé |
| J - Type projet | Texte | Rénovation, façade, extension... |
| K - Surface | Nombre | m² (si disponible) |
| L - Statut | Liste | Nouveau / Contacté / RDV / Devis / Gagné / Perdu |
| M - Date contact | Date | Dernier contact |
| N - Prochain contact | Date | Relance prévue |
| O - Notes | Texte | Informations libres |

**Statuts possibles :**
- `Nouveau` : Lead importé, pas encore contacté
- `Contacté` : Courrier/email envoyé
- `Répondu` : Le prospect a répondu
- `RDV` : RDV planifié
- `Devis` : Devis envoyé
- `Gagné` : Chantier signé
- `Perdu` : Refus ou sans suite

### Onglet 2 : Leads B2B

| Colonne | Type | Description |
|---------|------|-------------|
| A - ID | Auto | Identifiant unique |
| B - Date ajout | Auto | Date d'ajout |
| C - Entreprise | Texte | Nom du syndic/agence |
| D - Contact | Texte | Nom de la personne |
| E - Email | Texte | Email professionnel |
| F - Téléphone | Texte | Fixe ou mobile |
| G - Type | Liste | Syndic / Agent immo / Architecte / Courtier |
| H - Ville | Texte | Localisation |
| I - Statut | Liste | Nouveau / Email 1 / Email 2 / Email 3 / Répondu / Partenaire / Perdu |
| J - Date contact | Date | Dernier email envoyé |
| K - Prochain contact | Date | Relance prévue |
| L - Notes | Texte | Historique des échanges |

**Séquence email recommandée :**
- J0 : Email 1 (initial)
- J+3 : Email 2 (relance courte)
- J+7 : Email 3 (dernière tentative)

### Onglet 3 : Activité

Suivi quotidien des métriques :

| Colonne | Description |
|---------|-------------|
| A - Date | Date du jour |
| B - Leads importés | Nombre |
| C - Courriers envoyés | Nombre |
| D - Emails envoyés | Nombre |
| E - Réponses reçues | Nombre |
| F - RDV obtenus | Nombre |
| G - Devis envoyés | Nombre |
| H - Chantiers signés | Nombre |
| I - CA signé | Montant € |

### Onglet 4 : Config

Paramètres du système :

| Paramètre | Valeur |
|-----------|--------|
| Email alerte | contact@ra-batiment.fr |
| Jours avant relance particulier | 7 |
| Jours avant relance B2B | 3 |
| Départements IDF | 75,77,78,91,92,93,94,95 |

---

## Utilisation quotidienne

### Import de leads

**Menu : Prospection > Importer Sit@del**
- Télécharge et filtre les permis de construire IDF
- Ajoute automatiquement les nouveaux leads

**Menu : Prospection > Importer DVF**
- Appelle l'API des ventes immobilières
- Filtre les maisons anciennes vendues récemment

### Génération de courriers

**Menu : Prospection > Générer courrier**
- Sélectionner une ligne dans "Leads Particuliers"
- Génère un PDF personnalisé
- Le PDF s'ouvre dans un nouvel onglet

### Alertes de relance

Chaque matin à 9h (si configuré) :
- Le système envoie un email récapitulatif
- Liste des leads à relancer aujourd'hui
- Rappel des leads sans contact depuis 7+ jours

---

## Formules utiles

### Compter les leads par statut
```
=COUNTIF('Leads Particuliers'!L:L,"Nouveau")
=COUNTIF('Leads Particuliers'!L:L,"Gagné")
```

### Leads à relancer (sans contact > 7 jours)
```
=COUNTIFS('Leads Particuliers'!L:L,"<>Gagné",'Leads Particuliers'!L:L,"<>Perdu",'Leads Particuliers'!M:M,"<"&TODAY()-7)
```

### Taux de conversion
```
=COUNTIF('Leads Particuliers'!L:L,"Gagné")/COUNTA('Leads Particuliers'!A:A)-1
```

---

## Dépannage

### Le script ne s'exécute pas
1. Vérifier les autorisations (Exécuter > Autoriser)
2. Vérifier que le fichier est bien un Google Sheets (pas Excel)

### Les données ne s'importent pas
1. Vérifier la connexion internet
2. Vérifier que les APIs sont accessibles
3. Consulter les logs : Extensions > Apps Script > Exécutions

### L'email d'alerte n'arrive pas
1. Vérifier l'email dans l'onglet Config
2. Vérifier les spams
3. Vérifier que le déclencheur est actif
