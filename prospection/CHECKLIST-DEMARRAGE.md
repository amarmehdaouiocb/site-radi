# Checklist de Démarrage - Système de Prospection

## Semaine 1 : Mise en place du CRM

### Jour 1 : Création du CRM

- [ ] Créer un nouveau Google Sheets : "CRM RA Bâtiment - Prospection"
- [ ] Aller dans Extensions > Apps Script
- [ ] Copier le contenu de `crm/apps-script/Code.gs`
- [ ] Créer les fichiers supplémentaires :
  - [ ] `SitadelImport.gs`
  - [ ] `DVFImport.gs`
  - [ ] `Alertes.gs`
  - [ ] `CourrierPDF.gs`
- [ ] Sauvegarder (Ctrl+S)
- [ ] Exécuter `setupCRM()` et autoriser les permissions

### Jour 2 : Configuration des alertes

- [ ] Dans Apps Script, aller dans "Déclencheurs" (icône horloge)
- [ ] Ajouter un déclencheur :
  - Fonction : `checkRelances`
  - Événement : Heure
  - Fréquence : Quotidien à 9h
- [ ] Tester l'envoi d'email (exécuter `checkRelances` manuellement)

### Jour 3 : Configurer les alertes Google

- [ ] Aller sur https://www.google.fr/alerts
- [ ] Créer les alertes suivantes :
  - [ ] `"cherche artisan" île-de-france`
  - [ ] `"recommandation plombier" 93`
  - [ ] `"besoin rénovation" paris`
  - [ ] `"artisan maçon" seine-saint-denis`
- [ ] Fréquence : Quotidienne

---

## Semaine 2 : Premier import de leads

### Jour 4-5 : Import Sit@del

- [ ] Aller sur [data.gouv.fr Sit@del](https://www.data.gouv.fr/fr/datasets/base-des-permis-de-construire-sitadel/)
- [ ] Télécharger le CSV le plus récent
- [ ] Ouvrir dans Excel, copier les données
- [ ] Créer un onglet "Import Sitadel" dans le CRM
- [ ] Coller les données
- [ ] Menu Prospection > Import > Permis de construire
- [ ] Vérifier les leads importés

### Jour 6-7 : Import DVF

- [ ] Menu Prospection > Import > Ventes immobilières (DVF)
- [ ] Tester avec le département 93
- [ ] Vérifier les leads importés
- [ ] Répéter pour 2-3 autres départements

---

## Semaine 3 : Lancement courriers

### Préparation

- [ ] Acheter des enveloppes C5 (162x229mm) x50
- [ ] Acheter des timbres lettre verte x50
- [ ] Vérifier l'imprimante (encre, papier)

### Génération et envoi

- [ ] Sélectionner 20 leads qualifiés dans le CRM
- [ ] Pour chaque lead :
  - [ ] Sélectionner la ligne
  - [ ] Menu Prospection > Générer courrier PDF
  - [ ] Choisir le template adapté
  - [ ] Télécharger le PDF
- [ ] Imprimer tous les courriers
- [ ] Mettre sous pli et affranchir
- [ ] Poster les courriers
- [ ] Mettre à jour le CRM (statut "Contacté")

---

## Semaine 4 : Lancement Cold Email B2B

### Constitution de la base

- [ ] Lire `sources/contacts-b2b-starter.md`
- [ ] Rechercher 50 syndics sur Pages Jaunes
- [ ] Trouver les emails via :
  - [ ] Sites web des entreprises
  - [ ] Hunter.io (25 recherches gratuites/mois)
- [ ] Ajouter dans l'onglet "Leads B2B" du CRM

### Première campagne

- [ ] Préparer le template email (voir `templates/emails/syndic-initial.md`)
- [ ] Envoyer 10-15 emails personnalisés
- [ ] Mettre à jour le CRM (statut "Email 1")
- [ ] Planifier les relances (J+3 et J+7)

---

## Semaine 5 : Routine établie

### Check-list quotidienne

- [ ] Matin (15 min) :
  - [ ] Vérifier emails + alertes CRM
  - [ ] Check 5 groupes Facebook
  - [ ] Répondre aux posts pertinents

- [ ] Midi (15 min) :
  - [ ] Envoyer 10-15 emails B2B
  - [ ] Gérer les relances du jour

- [ ] Soir (15 min) :
  - [ ] Recheck Facebook
  - [ ] Mettre à jour le CRM
  - [ ] Préparer demain

---

## Récapitulatif des objectifs

| Action | Objectif Mois 1 |
|--------|-----------------|
| CRM configuré | ✓ |
| Leads Sit@del importés | 50+ |
| Leads DVF importés | 30+ |
| Courriers envoyés | 20+ |
| Contacts B2B collectés | 50+ |
| Emails B2B envoyés | 100+ |
| Alertes Google actives | 4+ |

---

## En cas de problème

### Le script ne fonctionne pas

1. Vérifier que le fichier est un Google Sheets (pas Excel importé)
2. Réexécuter `setupCRM()` et autoriser les permissions
3. Consulter les logs : Extensions > Apps Script > Exécutions

### L'import DVF échoue

1. L'API peut être temporairement indisponible
2. Essayer l'import manuel (créer onglet "Import DVF")
3. Télécharger les données depuis https://app.dvf.etalab.gouv.fr/

### Les emails arrivent en spam

1. Réduire le volume (max 20/jour)
2. Personnaliser davantage chaque email
3. Éviter les mots spam ("gratuit", "urgent", majuscules)

### Pas de réponses aux courriers

1. Vérifier le ciblage (leads récents ?)
2. Tester un nouveau template
3. Augmenter le volume (loi des grands nombres)

---

## Contacts utiles

- **Support CRM** : Consulter la documentation dans `crm/CRM-SETUP.md`
- **Questions Sit@del** : https://www.data.gouv.fr/fr/datasets/base-des-permis-de-construire-sitadel/
- **Questions DVF** : https://app.dvf.etalab.gouv.fr/

---

## Prêt à démarrer !

Une fois cette checklist complétée, le système de prospection est opérationnel.

Rappel des objectifs à long terme :
- **5 RDV/mois** minimum
- **1 chantier signé/mois** minimum
- **Croissance régulière** du pipeline

Bonne prospection !
