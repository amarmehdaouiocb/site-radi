# Métriques et KPIs de Prospection

## Dashboard Principal

### Objectifs Mensuels

| Métrique | Objectif | Comment mesurer |
|----------|----------|-----------------|
| Leads importés | 80+ | Onglet Activité - Somme "Leads importés" |
| Courriers envoyés | 20+ | Onglet Activité - Somme "Courriers envoyés" |
| Emails B2B envoyés | 200+ | Onglet Activité - Somme "Emails envoyés" |
| Réponses reçues | 10+ | Onglet Activité - Somme "Réponses reçues" |
| RDV obtenus | 5+ | Onglet Activité - Somme "RDV obtenus" |
| Devis envoyés | 3+ | Onglet Activité - Somme "Devis envoyés" |
| Chantiers signés | 1+ | Onglet Activité - Somme "Chantiers signés" |

---

## Taux de Conversion

### Funnel Courrier Postal

```
Leads importés (100)
       ↓
Courriers envoyés (20)
       ↓ 20%
Réponses (2-4)
       ↓ 2-4%
RDV (1-2)
       ↓ 50%
Devis (1)
       ↓ 50%
Signé (0.5)
       ↓ 25-50%
```

**Taux de conversion moyen attendu** : 2-5% courrier → réponse

### Funnel Email B2B

```
Emails envoyés (200)
       ↓
Réponses (10-20)
       ↓ 5-10%
Intéressés (5-10)
       ↓ 50%
RDV/Appel (3-5)
       ↓ 30-50%
Partenariat (1-2)
       ↓ 20-40%
```

**Taux de conversion moyen attendu** : 5-10% email → réponse

### Funnel Facebook

```
Posts identifiés (100)
       ↓
Réponses postées (30)
       ↓ 30%
Contacts reçus (5-10)
       ↓ 17-33%
RDV (2-4)
       ↓ 40%
Devis (1-2)
       ↓ 50%
```

---

## Formules Google Sheets

### Dans l'onglet Activité

Ajouter ces formules pour un calcul automatique :

```
# Total leads du mois (colonne B, lignes du mois en cours)
=SUMIFS(B:B, A:A, ">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1), A:A, "<="&EOMONTH(TODAY(),0))

# Taux de réponse courrier
=D_total / C_total * 100

# Coût par lead (si budget impression)
=Budget_mensuel / Leads_total
```

### Dans l'onglet Leads Particuliers

```
# Nombre de leads par statut
=COUNTIF(L:L, "Nouveau")
=COUNTIF(L:L, "Contacté")
=COUNTIF(L:L, "Gagné")

# Leads sans contact depuis 7 jours
=COUNTIFS(L:L, "<>Gagné", L:L, "<>Perdu", M:M, "<"&TODAY()-7)

# Taux de conversion global
=COUNTIF(L:L, "Gagné") / (COUNTA(L:L)-1) * 100
```

---

## Rapport Hebdomadaire

### Template

```
RAPPORT SEMAINE [XX] - RA Bâtiment

═══════════════════════════════════════
📊 ACTIVITÉ
═══════════════════════════════════════
Leads importés      : [X]
Courriers envoyés   : [X]
Emails B2B envoyés  : [X]
Facebook réponses   : [X]

═══════════════════════════════════════
📈 RÉSULTATS
═══════════════════════════════════════
Réponses reçues     : [X]
RDV planifiés       : [X]
Devis envoyés       : [X]
Chantiers signés    : [X]
CA signé            : [X] €

═══════════════════════════════════════
📉 TAUX DE CONVERSION
═══════════════════════════════════════
Courrier → Réponse  : [X]%
Email → Réponse     : [X]%
RDV → Devis         : [X]%
Devis → Signé       : [X]%

═══════════════════════════════════════
💡 OBSERVATIONS
═══════════════════════════════════════
Ce qui a fonctionné :
- [...]

Ce qui n'a pas fonctionné :
- [...]

Actions pour la semaine prochaine :
- [...]
```

---

## Analyse par Source

### Tableau de suivi

| Source | Leads | Contactés | Réponses | RDV | Devis | Signés | Taux conv. |
|--------|-------|-----------|----------|-----|-------|--------|------------|
| Sit@del | | | | | | | |
| DVF | | | | | | | |
| Facebook | | | | | | | |
| B2B Syndics | | | | | | | |
| B2B Agents | | | | | | | |
| Bouche-à-oreille | | | | | | | |

### Comment remplir

Utiliser les filtres Google Sheets sur la colonne "Source" pour compter chaque catégorie.

---

## Coûts et ROI

### Coûts fixes mensuels

| Poste | Coût estimé |
|-------|-------------|
| Impression courriers (20x) | ~10€ |
| Enveloppes (20x) | ~5€ |
| Timbres lettre verte (20x) | ~26€ |
| **Total** | **~41€** |

### Calcul du ROI

```
ROI = (CA généré - Coûts) / Coûts * 100

Exemple :
- Coûts mensuels : 41€
- 1 chantier signé : 5 000€
- Marge (~30%) : 1 500€

ROI = (1500 - 41) / 41 * 100 = 3 558%
```

### Coût d'acquisition client (CAC)

```
CAC = Coûts totaux / Nombre de clients signés

Exemple :
- Coûts : 41€
- Clients : 1

CAC = 41€ / client
```

---

## Benchmarks du secteur

### Taux de réponse courrier B2C

| Qualité du ciblage | Taux attendu |
|--------------------|--------------|
| Mailing de masse | 0.5-1% |
| Ciblage basique | 1-2% |
| Ciblage qualifié (permis) | 2-5% |
| Ciblage ultra-qualifié (DVF récent) | 3-8% |

### Taux de réponse email B2B

| Type d'email | Taux attendu |
|--------------|--------------|
| Email de masse | 1-3% |
| Email personnalisé | 5-15% |
| Email avec intro | 15-25% |
| Relance | +50% du taux initial |

---

## Alertes et seuils

### Signaux d'alarme

| Métrique | Seuil critique | Action |
|----------|----------------|--------|
| Leads importés/semaine | < 10 | Relancer imports |
| Taux réponse courrier | < 1% | Revoir le template |
| Taux réponse email | < 3% | Revoir l'objet/contenu |
| RDV/mois | < 2 | Augmenter le volume |
| Devis non signés | > 80% | Revoir le pricing |

### Signaux positifs

| Métrique | Seuil succès | Signification |
|----------|--------------|---------------|
| Taux réponse | > 5% | Bon ciblage |
| RDV → Devis | > 70% | Bonne qualification |
| Devis → Signé | > 30% | Prix compétitif |

---

## Outils de suivi recommandés

### Gratuits

1. **Google Sheets** : CRM et tableaux de bord
2. **Google Data Studio** : Visualisation (connecté à Sheets)
3. **Google Forms** : Collecter les retours clients

### Pour aller plus loin (payant)

1. **Brevo** (ex-Sendinblue) : Tracking emails (gratuit jusqu'à 300/jour)
2. **Notion** : Base de données plus avancée
3. **HubSpot CRM** : Version gratuite disponible
