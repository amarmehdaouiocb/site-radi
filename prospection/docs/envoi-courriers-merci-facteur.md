# Guide d'envoi de courriers via Merci Facteur API

## Vue d'ensemble

Ce guide explique comment envoyer automatiquement les courriers de prospection RA Bâtiment via l'API Merci Facteur.

**Fichiers impliqués :**
- `prospection/scripts/send-courriers-api.mjs` - Script d'envoi automatisé
- `prospection/data/leads-top-priorite.tsv` - Liste des leads score 90+
- `prospection/courriers-pdf/SCORE-100/` - PDFs des courriers à envoyer

---

## 1. Créer un compte Merci Facteur Pro

1. Va sur https://www.merci-facteur.com/pro/
2. Crée un compte professionnel
3. Recharge ton solde (les courriers sont prépayés)

---

## 2. Obtenir ta clé API

1. Connecte-toi à ton espace pro
2. Va dans **Paramètres** → **API**
3. Copie ta **clé secrète** (secret key)

---

## 3. Configurer les variables d'environnement

### Option A : Variables temporaires (PowerShell)

```powershell
$env:MERCI_FACTEUR_API_KEY = "ta_cle_secrete_ici"
$env:MERCI_FACTEUR_API_URL = "https://www.merci-facteur.com/api/1.2"
```

### Option B : Fichier .env (recommandé)

Crée un fichier `.env` à la racine du projet :

```env
MERCI_FACTEUR_API_KEY=ta_cle_secrete_ici
MERCI_FACTEUR_API_URL=https://www.merci-facteur.com/api/1.2
MERCI_FACTEUR_ENVELOPE_ID=123456
```

Puis charge-le avant d'exécuter le script :
```powershell
# PowerShell
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2])
    }
}
```

---

## 4. Personnaliser l'enveloppe (optionnel mais recommandé)

1. Connecte-toi à https://www.merci-facteur.com/pro/
2. Va dans **Your branding** (menu en haut à droite)
3. Crée une nouvelle enveloppe personnalisée :
   - Upload le logo RA Bâtiment
   - Configure les couleurs (or #d4af37)
   - Valide le template
4. Note l'**ID du template** affiché
5. Configure la variable :
   ```powershell
   $env:MERCI_FACTEUR_ENVELOPE_ID = "123456"
   ```

---

## 5. Utiliser le script d'envoi

### Mode simulation (test sans envoi réel)

```powershell
node prospection/scripts/send-courriers-api.mjs --dry-run
```

Ce mode :
- Vérifie que tous les PDFs existent
- Affiche les courriers qui seraient envoyés
- Ne fait aucun appel API réel
- N'utilise pas de crédits

### Tester avec un nombre limité

```powershell
# Simuler les 10 premiers courriers
node prospection/scripts/send-courriers-api.mjs --dry-run --limit=10

# Envoyer réellement les 5 premiers
node prospection/scripts/send-courriers-api.mjs --send --limit=5
```

### Envoi réel de tous les courriers

```powershell
node prospection/scripts/send-courriers-api.mjs --send
```

---

## 6. Paramètres d'impression

Le script est configuré avec :

| Paramètre | Valeur | Description |
|-----------|--------|-------------|
| Format | `recto` | Impression recto simple |
| Couleur | Auto | Détecté automatiquement (ton PDF doré = couleur) |
| Papier | Blanc 80g/m² | Standard, non modifiable |
| Mode d'envoi | `normal` | Lettre verte J+3 |

### Options de mode d'envoi

| Mode | Délai | Prix estimé |
|------|-------|-------------|
| `normal` | J+3 | ~1.49€ |
| `suivi` | J+2 | ~2.50€ |
| `lrar` | J+2 | ~5.00€ |

Pour changer le mode, modifie `CONFIG.modeEnvoi` dans le script.

---

## 7. Tarification estimée

| Quantité | Coût unitaire | Total |
|----------|---------------|-------|
| 139 courriers (score 100) | 1.49€ | ~207€ |
| 585 courriers (score 90+) | 1.49€ | ~872€ |

*Prix indicatifs, vérifier sur Merci Facteur*

---

## 8. Structure du script

Le script fait automatiquement :

1. **Lecture des leads** depuis `leads-top-priorite.tsv`
2. **Filtrage** des leads score 100 uniquement
3. **Matching PDF → Adresse** via l'ID du lead
4. **Envoi API** avec :
   - PDF encodé en base64
   - Adresse du destinataire
   - Expéditeur RA Bâtiment (5 rue de la Gaîté, 93000 Bobigny)
   - Enveloppe personnalisée (si configurée)

### Chemin des PDFs

Le script cherche les PDFs dans :
```
prospection/courriers-pdf/SCORE-100/{département}/{id}-{ville}.pdf
```

Exemple : `prospection/courriers-pdf/SCORE-100/77/0001-Melun.pdf`

---

## 9. Gestion des erreurs

### Fichier d'erreurs

Si des envois échouent, le script crée :
```
prospection/data/envoi-erreurs.json
```

Contient la liste des leads en erreur avec le message d'erreur.

### Erreurs courantes

| Erreur | Cause | Solution |
|--------|-------|----------|
| `Clé API manquante` | Variable non configurée | Configurer `MERCI_FACTEUR_API_KEY` |
| `PDF non trouvé` | Fichier manquant | Régénérer les PDFs |
| `Erreur authentification` | Clé invalide | Vérifier la clé API |
| `Rate limiting` | Trop de requêtes | Le script pause 500ms entre chaque envoi |

---

## 10. Résumé des commandes

```powershell
# 1. Configurer les variables (une fois par session)
$env:MERCI_FACTEUR_API_KEY = "ta_cle"
$env:MERCI_FACTEUR_ENVELOPE_ID = "123456"  # optionnel

# 2. Tester en mode simulation
node prospection/scripts/send-courriers-api.mjs --dry-run

# 3. Tester avec quelques courriers réels
node prospection/scripts/send-courriers-api.mjs --send --limit=5

# 4. Envoyer tous les courriers
node prospection/scripts/send-courriers-api.mjs --send
```

---

## 11. Checklist avant envoi

- [ ] Compte Merci Facteur Pro créé et crédité
- [ ] Clé API récupérée et configurée
- [ ] Enveloppe personnalisée créée (optionnel)
- [ ] Test `--dry-run` réussi
- [ ] Test `--limit=2 --send` réussi (2 courriers test)
- [ ] Vérifier la réception des 2 courriers test
- [ ] Lancer l'envoi complet

---

## 12. Après l'envoi

1. **Suivre les envois** dans l'interface Merci Facteur Pro
2. **Attendre les retours** (2-3 semaines pour premiers appels)
3. **Tracker dans le CRM** les réponses reçues
4. **Analyser le ROI** : coût total vs chantiers obtenus

---

## Liens utiles

- [Documentation API Merci Facteur](https://www.merci-facteur.com/api/1.2/doc.php)
- [Espace Pro Merci Facteur](https://www.merci-facteur.com/pro/)
- [Scoring des leads](./scoring-leads.md)
