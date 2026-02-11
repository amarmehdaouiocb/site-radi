/**
 * Parse et score les données Sitadel (permis de construire)
 * Filtre uniquement les travaux sur existant en Île-de-France
 *
 * Source : https://www.data.gouv.fr/fr/datasets/liste-des-permis-de-construire-et-autres-autorisations-durbanisme/
 */

import fs from 'fs';
import readline from 'readline';

const INPUT_FILE = 'prospection/data/sitadel-logements-raw.csv';
const OUTPUT_FILE = 'prospection/data/leads-sitadel-idf.tsv';
const OUTPUT_SCORED = 'prospection/data/leads-sitadel-idf-scored.tsv';
const OUTPUT_TOP = 'prospection/data/leads-sitadel-top-priorite.tsv';

// Départements Île-de-France
const DEPTS_IDF = ['75', '77', '78', '91', '92', '93', '94', '95'];

// Colonnes importantes (index basé sur le header)
let COL = {};

// Score fraîcheur (par rapport à aujourd'hui)
function scoreFraicheur(dateAutorisation) {
  if (!dateAutorisation) return 5;

  const date = new Date(dateAutorisation);
  const now = new Date();
  const joursDepuis = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (joursDepuis <= 30) return 50;      // Moins d'1 mois
  if (joursDepuis <= 60) return 42;      // 1-2 mois
  if (joursDepuis <= 90) return 35;      // 2-3 mois
  if (joursDepuis <= 120) return 28;     // 3-4 mois
  if (joursDepuis <= 180) return 20;     // 4-6 mois
  if (joursDepuis <= 365) return 12;     // 6-12 mois
  return 5;                               // Plus d'1 an
}

// Score type de travaux (extension = plus de potentiel)
function scoreTypeTravaux(row) {
  let score = 0;

  // Extension = gros potentiel (agrandissement)
  if (row[COL.I_EXTENSION] === 'true') score += 20;

  // Surélévation = gros potentiel
  if (row[COL.I_SURELEVATION] === 'true') score += 18;

  // Niveau supplémentaire
  if (row[COL.I_NIVSUPP] === 'true') score += 15;

  // Si aucun indicateur mais nature du projet indique travaux
  if (score === 0) {
    const nature = (row[COL.NATURE_PROJET_DECLAREE] || '').toLowerCase();
    if (nature.includes('réhabilitation') || nature.includes('rehabilitation')) score += 15;
    if (nature.includes('transformation')) score += 12;
    if (nature.includes('extension')) score += 20;
  }

  return Math.min(score, 35); // Max 35 points
}

// Score surface (indicateur de budget)
function scoreSurface(row) {
  const surfCreee = parseInt(row[COL.SURF_HAB_CREEE]) || 0;

  if (surfCreee >= 50 && surfCreee <= 150) return 15;   // Idéal
  if (surfCreee >= 30 && surfCreee <= 200) return 11;   // Bon
  if (surfCreee > 0) return 7;                           // Petit
  return 3;                                              // Inconnu
}

// Parser une ligne CSV avec séparateur ;
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ';' && !inQuotes) {
      values.push(current.replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.replace(/^"|"$/g, ''));

  return values;
}

// Construire l'adresse complète
function buildAdresse(row) {
  const parts = [];

  const num = row[COL.ADR_NUM_TER];
  const typeVoie = row[COL.ADR_TYPEVOIE_TER];
  const libVoie = row[COL.ADR_LIBVOIE_TER];
  const lieuDit = row[COL.ADR_LIEUDIT_TER];

  if (num) parts.push(num);
  if (typeVoie) parts.push(typeVoie);
  if (libVoie) parts.push(libVoie);

  let adresse = parts.join(' ').trim();

  if (!adresse && lieuDit) {
    adresse = lieuDit;
  }

  return adresse || 'Adresse non précisée';
}

async function main() {
  console.log('📋 Parsing des données Sitadel (permis de construire)\n');

  const fileStream = fs.createReadStream(INPUT_FILE);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineNumber = 0;
  let leads = [];
  let stats = {
    total: 0,
    idf: 0,
    travauxExistant: 0,
    recent: 0
  };

  // Date limite : permis des 12 derniers mois
  const dateLimit = new Date();
  dateLimit.setFullYear(dateLimit.getFullYear() - 1);

  for await (const line of rl) {
    lineNumber++;

    // Header
    if (lineNumber === 1) {
      const headers = parseCSVLine(line);
      headers.forEach((h, i) => {
        COL[h] = i;
      });
      console.log(`✅ ${headers.length} colonnes détectées\n`);
      continue;
    }

    stats.total++;

    // Afficher progression
    if (stats.total % 100000 === 0) {
      console.log(`   📊 ${stats.total.toLocaleString()} lignes traitées...`);
    }

    const row = parseCSVLine(line);

    // Filtre 1 : Île-de-France uniquement
    const dept = row[COL.DEP_CODE];
    if (!DEPTS_IDF.includes(dept)) continue;
    stats.idf++;

    // Filtre 2 : Travaux sur existant (extension, surélévation, etc.)
    const isExtension = row[COL.I_EXTENSION] === 'true';
    const isSurelevation = row[COL.I_SURELEVATION] === 'true';
    const isNivSupp = row[COL.I_NIVSUPP] === 'true';
    const nature = (row[COL.NATURE_PROJET_DECLAREE] || '').toLowerCase();
    const isRehab = nature.includes('réhabilitation') || nature.includes('rehabilitation');
    const isTransfo = nature.includes('transformation');

    if (!isExtension && !isSurelevation && !isNivSupp && !isRehab && !isTransfo) continue;
    stats.travauxExistant++;

    // Filtre 3 : Permis récent (< 12 mois)
    const dateAuto = row[COL.DATE_REELLE_AUTORISATION];
    if (dateAuto) {
      const datePermis = new Date(dateAuto);
      if (datePermis < dateLimit) continue;
    }
    stats.recent++;

    // Construire le lead
    const lead = {
      id: stats.recent,
      numPermis: row[COL.NUM_DAU] || '',
      typePermis: row[COL.TYPE_DAU] || '',
      dateAutorisation: dateAuto || '',
      adresse: buildAdresse(row),
      codePostal: row[COL.ADR_CODPOST_TER] || '',
      ville: row[COL.ADR_LOCALITE_TER] || '',
      departement: dept,
      surfaceCreee: parseInt(row[COL.SURF_HAB_CREEE]) || 0,
      isExtension,
      isSurelevation,
      natureProjet: row[COL.NATURE_PROJET_DECLAREE] || '',
      row // Garder la ligne complète pour le scoring
    };

    leads.push(lead);
  }

  console.log(`\n📊 Statistiques de filtrage :`);
  console.log(`   Total lignes : ${stats.total.toLocaleString()}`);
  console.log(`   Île-de-France : ${stats.idf.toLocaleString()}`);
  console.log(`   Travaux existant : ${stats.travauxExistant.toLocaleString()}`);
  console.log(`   Récents (< 12 mois) : ${stats.recent.toLocaleString()}`);

  // Scorer les leads
  console.log('\n🎯 Scoring des leads...');

  leads = leads.map(lead => {
    const fraicheur = scoreFraicheur(lead.dateAutorisation);
    const typeTravaux = scoreTypeTravaux(lead.row);
    const surface = scoreSurface(lead.row);

    const score = fraicheur + typeTravaux + surface;

    let priorite;
    if (score >= 85) priorite = '🔥 Très haute';
    else if (score >= 70) priorite = '⭐ Haute';
    else if (score >= 50) priorite = '👍 Moyenne';
    else priorite = '📋 Basse';

    return {
      ...lead,
      score,
      priorite,
      scoreFraicheur: fraicheur,
      scoreTypeTravaux: typeTravaux,
      scoreSurface: surface
    };
  });

  // Trier par score décroissant
  leads.sort((a, b) => b.score - a.score);

  // Réassigner les IDs
  leads.forEach((lead, i) => lead.id = i + 1);

  // Générer le fichier TSV
  const headers = [
    'ID', 'Num_Permis', 'Type_Permis', 'Date_Autorisation',
    'Adresse', 'Code_Postal', 'Ville', 'Departement',
    'Surface_Creee', 'Extension', 'Surelevation', 'Nature_Projet',
    'Score', 'Priorite', 'Score_Fraicheur', 'Score_Type', 'Score_Surface'
  ];

  const lines = [headers.join('\t')];

  leads.forEach(lead => {
    lines.push([
      lead.id,
      lead.numPermis,
      lead.typePermis,
      lead.dateAutorisation,
      lead.adresse,
      lead.codePostal,
      lead.ville,
      lead.departement,
      lead.surfaceCreee,
      lead.isExtension ? 'Oui' : 'Non',
      lead.isSurelevation ? 'Oui' : 'Non',
      lead.natureProjet,
      lead.score,
      lead.priorite,
      lead.scoreFraicheur,
      lead.scoreTypeTravaux,
      lead.scoreSurface
    ].join('\t'));
  });

  fs.writeFileSync(OUTPUT_SCORED, lines.join('\n'), 'utf-8');

  // Stats par priorité
  const byPriority = {
    tresHaute: leads.filter(l => l.score >= 85).length,
    haute: leads.filter(l => l.score >= 70 && l.score < 85).length,
    moyenne: leads.filter(l => l.score >= 50 && l.score < 70).length,
    basse: leads.filter(l => l.score < 50).length
  };

  console.log(`\n📊 Répartition par priorité :`);
  console.log(`   🔥 Très haute (85+) : ${byPriority.tresHaute} leads`);
  console.log(`   ⭐ Haute (70-84) : ${byPriority.haute} leads`);
  console.log(`   👍 Moyenne (50-69) : ${byPriority.moyenne} leads`);
  console.log(`   📋 Basse (<50) : ${byPriority.basse} leads`);

  // Stats par département
  console.log(`\n📊 Répartition par département :`);
  const byDept = {};
  leads.forEach(l => {
    byDept[l.departement] = (byDept[l.departement] || 0) + 1;
  });
  Object.entries(byDept).sort((a, b) => b[1] - a[1]).forEach(([dept, count]) => {
    console.log(`   ${dept} : ${count} leads`);
  });

  // Fichier top priorité (score >= 70)
  const topLeads = leads.filter(l => l.score >= 70);
  if (topLeads.length > 0) {
    const topLines = [headers.join('\t')];
    topLeads.forEach((lead, i) => {
      lead.id = i + 1;
      topLines.push([
        lead.id,
        lead.numPermis,
        lead.typePermis,
        lead.dateAutorisation,
        lead.adresse,
        lead.codePostal,
        lead.ville,
        lead.departement,
        lead.surfaceCreee,
        lead.isExtension ? 'Oui' : 'Non',
        lead.isSurelevation ? 'Oui' : 'Non',
        lead.natureProjet,
        lead.score,
        lead.priorite,
        lead.scoreFraicheur,
        lead.scoreTypeTravaux,
        lead.scoreSurface
      ].join('\t'));
    });
    fs.writeFileSync(OUTPUT_TOP, topLines.join('\n'), 'utf-8');
    console.log(`\n📁 Fichier top priorité : ${OUTPUT_TOP} (${topLeads.length} leads)`);
  }

  console.log(`\n📁 Fichier complet : ${OUTPUT_SCORED}`);

  // Top 20
  console.log('\n🎯 Top 20 leads :');
  leads.slice(0, 20).forEach((lead, i) => {
    const type = lead.isExtension ? '📐 Extension' : lead.isSurelevation ? '⬆️ Surélévation' : '🔧 Travaux';
    console.log(`   ${i + 1}. ${lead.ville} (${lead.departement}) - ${type} - ${lead.surfaceCreee}m² - Score: ${lead.score}/100`);
  });
}

main().catch(console.error);
