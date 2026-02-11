/**
 * Ajoute un score de priorité aux leads DVF
 * Score de 0 à 100 basé sur :
 * - Fraîcheur de la vente (50 pts)
 * - Budget potentiel (30 pts)
 * - Surface (15 pts)
 * - Prix/m² cohérent (5 pts bonus)
 *
 * Filtre les prix/m² aberrants (< 500 ou > 15000 €/m²)
 */

import fs from 'fs';

const INPUT_FILE = 'prospection/data/leads-dvf-2025-s1-idf.tsv';
const OUTPUT_FILE = 'prospection/data/leads-dvf-2025-s1-idf-scored.tsv';
const OUTPUT_TOP = 'prospection/data/leads-dvf-score-70.tsv';

// Colonnes du nouveau format
const COL = {
  ID: 0,
  DATE_VENTE: 1,
  ADRESSE: 2,
  CODE_POSTAL: 3,
  VILLE: 4,
  DEPARTEMENT: 5,
  VALEUR: 6,
  SURFACE_BATIE: 7,
  SURFACE_TERRAIN: 8,
  NB_PIECES: 9,
  NB_LOTS: 10,
  PRIX_M2: 11,
  STATUT: 12,
  NOTES: 13
};

// Score fraîcheur RELATIF (par rapport aux données du fichier)
function scoreFraicheur(dateVente, datePlusRecente) {
  const vente = new Date(dateVente);
  const reference = new Date(datePlusRecente);
  const joursDepuis = Math.floor((reference - vente) / (1000 * 60 * 60 * 24));

  if (joursDepuis <= 7) return 50;       // Même semaine que le plus récent
  if (joursDepuis <= 30) return 42;      // Même mois
  if (joursDepuis <= 60) return 33;      // 1-2 mois avant
  if (joursDepuis <= 90) return 25;      // 2-3 mois avant
  if (joursDepuis <= 120) return 17;     // 3-4 mois avant
  return 8;                               // Plus ancien
}

// Score budget (sweet spot = 200k-500k)
function scoreBudget(valeurStr) {
  const valeur = parseInt(valeurStr.replace(/[^\d]/g, '')) || 0;

  if (valeur >= 200000 && valeur <= 500000) return 30;  // Sweet spot
  if (valeur >= 150000 && valeur <= 600000) return 24;  // Bon
  if (valeur >= 100000 && valeur <= 800000) return 16;  // OK
  if (valeur < 100000) return 8;                         // Petit budget
  return 12;                                             // > 800k (luxe)
}

// Score surface (80-150m² = travaux moyens)
function scoreSurface(surfaceStr) {
  const surface = parseInt(surfaceStr) || 0;

  if (surface >= 80 && surface <= 150) return 15;   // Idéal
  if (surface >= 60 && surface <= 200) return 11;   // Bon
  if (surface > 0) return 6;                         // Autre
  return 3;                                          // Inconnu
}

// Bonus prix/m² cohérent (filtre les aberrations)
function scorePrixM2(prixM2Str) {
  const prixM2 = parseInt(prixM2Str.replace(/[^\d]/g, '')) || 0;

  // Prix/m² aberrant = malus
  if (prixM2 > 0 && prixM2 < 500) return -10;    // Trop bas = suspect
  if (prixM2 > 15000) return -10;                 // Trop haut = suspect

  // Prix/m² cohérent = bonus
  if (prixM2 >= 2000 && prixM2 <= 6000) return 5;  // Prix normal IDF
  if (prixM2 >= 1000 && prixM2 <= 10000) return 3; // Acceptable

  return 0;
}

// Vérifier si le prix/m² est aberrant
function isPrixM2Aberrant(prixM2Str) {
  const prixM2 = parseInt(prixM2Str.replace(/[^\d]/g, '')) || 0;
  if (prixM2 === 0) return false; // Pas de données = OK
  return prixM2 < 500 || prixM2 > 15000;
}

function main() {
  console.log('🎯 Scoring des leads DVF (sur 100 pts)\n');

  const content = fs.readFileSync(INPUT_FILE, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split('\t');

  // Trouver la date la plus récente dans les données
  let datePlusRecente = '2025-01-01';
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split('\t');
    const dateVente = values[COL.DATE_VENTE];
    if (dateVente > datePlusRecente) {
      datePlusRecente = dateVente;
    }
  }
  console.log(`📅 Date de vente la plus récente : ${datePlusRecente}\n`);

  // Ajouter colonnes Score et Priorité
  const newHeaders = [...headers, 'Score', 'Priorité'];

  const scoredLeads = [];
  let filteredAberrant = 0;

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = lines[i].split('\t');
    const dateVente = values[COL.DATE_VENTE];
    const dept = values[COL.DEPARTEMENT];
    const valeur = values[COL.VALEUR];
    const surface = values[COL.SURFACE_BATIE];
    const prixM2 = values[COL.PRIX_M2];
    const ville = values[COL.VILLE];

    // Filtrer les prix/m² aberrants
    if (isPrixM2Aberrant(prixM2)) {
      filteredAberrant++;
      continue;
    }

    // Calculer le score
    const scoreFr = scoreFraicheur(dateVente, datePlusRecente);
    const scoreBu = scoreBudget(valeur);
    const scoreSu = scoreSurface(surface);
    const scorePx = scorePrixM2(prixM2);

    const score = Math.max(0, Math.min(100, scoreFr + scoreBu + scoreSu + scorePx));

    // Déterminer la priorité (seuil à 70)
    let priorite;
    if (score >= 85) priorite = '🔥 Très haute';
    else if (score >= 70) priorite = '⭐ Haute';
    else if (score >= 50) priorite = '👍 Moyenne';
    else priorite = '📋 Basse';

    scoredLeads.push({
      line: values,
      score,
      priorite,
      dept,
      ville
    });
  }

  console.log(`⚠️  ${filteredAberrant} leads filtrés (prix/m² aberrant)\n`);

  // Trier par score décroissant
  scoredLeads.sort((a, b) => b.score - a.score);

  // Générer le TSV
  const outputLines = [newHeaders.join('\t')];

  scoredLeads.forEach((lead, index) => {
    lead.line[0] = index + 1;
    outputLines.push([...lead.line, lead.score, lead.priorite].join('\t'));
  });

  fs.writeFileSync(OUTPUT_FILE, outputLines.join('\n'), 'utf-8');

  // Stats
  const stats = {
    tresHaute: scoredLeads.filter(l => l.score >= 85).length,
    haute: scoredLeads.filter(l => l.score >= 70 && l.score < 85).length,
    moyenne: scoredLeads.filter(l => l.score >= 50 && l.score < 70).length,
    basse: scoredLeads.filter(l => l.score < 50).length,
  };

  console.log(`✅ ${scoredLeads.length} leads scorés et triés\n`);
  console.log('📊 Répartition par priorité :');
  console.log(`   🔥 Très haute (85+):   ${stats.tresHaute} leads`);
  console.log(`   ⭐ Haute (70-84):      ${stats.haute} leads`);
  console.log(`   👍 Moyenne (50-69):    ${stats.moyenne} leads`);
  console.log(`   📋 Basse (<50):        ${stats.basse} leads`);

  // Stats par département pour score >= 70
  console.log('\n📊 Répartition "Score ≥ 70" par département :');
  const byDept = {};
  scoredLeads.filter(l => l.score >= 70).forEach(l => {
    byDept[l.dept] = (byDept[l.dept] || 0) + 1;
  });
  Object.entries(byDept).sort((a, b) => b[1] - a[1]).forEach(([dept, count]) => {
    console.log(`   ${dept}: ${count} leads`);
  });

  console.log('\n🎯 Top 20 leads prioritaires :');
  scoredLeads.slice(0, 20).forEach((lead, i) => {
    const ville = lead.line[COL.VILLE];
    const dept = lead.line[COL.DEPARTEMENT];
    const valeur = lead.line[COL.VALEUR];
    const surface = lead.line[COL.SURFACE_BATIE];
    const prixM2 = lead.line[COL.PRIX_M2];
    console.log(`   ${i + 1}. ${ville} (${dept}) - ${valeur} - ${surface} - ${prixM2} - Score: ${lead.score}/100`);
  });

  console.log(`\n📁 Fichier complet : ${OUTPUT_FILE}`);

  // Générer le fichier score >= 70
  const topLeads = scoredLeads.filter(l => l.score >= 70);
  if (topLeads.length > 0) {
    const topLines = [newHeaders.join('\t')];
    topLeads.forEach((lead, index) => {
      lead.line[0] = index + 1;
      topLines.push([...lead.line, lead.score, lead.priorite].join('\t'));
    });
    fs.writeFileSync(OUTPUT_TOP, topLines.join('\n'), 'utf-8');
    console.log(`📁 Fichier score ≥ 70 : ${OUTPUT_TOP} (${topLeads.length} leads)`);
  }
}

main();
