/**
 * Parse le fichier DVF officiel (ValeursFoncieres-2025-S1.txt)
 * Extrait les maisons vendues en Île-de-France
 * Agrège les lots d'une même mutation
 * Génère un TSV prêt à importer dans Google Sheets
 */

import fs from 'fs';
import readline from 'readline';

const DEPARTEMENTS_IDF = ['75', '77', '78', '91', '92', '93', '94', '95'];
const INPUT_FILE = 'prospection/data/ValeursFoncieres-2025-S1.txt';
const OUTPUT_FILE = 'prospection/data/leads-dvf-2025-s1-idf.tsv';

async function parseFile() {
  console.log('🚀 Parsing du fichier DVF officiel S1 2025\n');

  const fileStream = fs.createReadStream(INPUT_FILE, { encoding: 'utf-8' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  // Map pour agréger les mutations (une mutation peut avoir plusieurs lignes/lots)
  const mutations = new Map();
  let lineCount = 0;
  let headers = [];

  for await (const line of rl) {
    lineCount++;

    // Première ligne = headers
    if (lineCount === 1) {
      headers = line.split('|');
      console.log(`📋 ${headers.length} colonnes détectées`);
      continue;
    }

    const values = line.split('|');

    // Colonnes importantes (index basé sur le header)
    const codeDept = values[18]; // Code departement
    const typeLocal = values[36]; // Type local
    const natureMutation = values[9]; // Nature mutation

    // Filtrer : IDF + Vente (on garde toutes les lignes de la mutation, pas seulement "Maison")
    if (!DEPARTEMENTS_IDF.includes(codeDept)) continue;
    if (natureMutation !== 'Vente') continue;

    const idDocument = values[0]; // Identifiant de document
    const dateMutation = values[8]; // Date mutation (format JJ/MM/AAAA)
    const valeurFonciere = values[10]; // Valeur fonciere
    const noVoie = values[11]; // Numéro de voie
    const typeVoie = values[13]; // Type de voie
    const nomVoie = values[15]; // Nom de voie
    const codePostal = values[16]; // Code postal
    const commune = values[17]; // Commune
    const surfaceBati = parseFloat(values[38]) || 0; // Surface reelle bati
    const nbPieces = parseInt(values[39]) || 0; // Nombre pieces principales
    const surfaceTerrain = parseFloat(values[42]) || 0; // Surface terrain
    const nbLots = parseInt(values[34]) || 0; // Nombre de lots

    // Clé d'agrégation : identifiant document + date + valeur (une mutation unique)
    const valeur = parseFloat(valeurFonciere.replace(',', '.')) || 0;
    const mutationKey = `${idDocument}-${dateMutation}-${valeur}`;

    // Construire l'adresse
    const adresse = [noVoie, typeVoie, nomVoie].filter(Boolean).join(' ').trim();

    if (mutations.has(mutationKey)) {
      // Agréger à la mutation existante
      const existing = mutations.get(mutationKey);
      existing.surfaceBatiTotal += surfaceBati;
      existing.surfaceTerrainTotal += surfaceTerrain;
      existing.nbPiecesTotal += nbPieces;
      existing.nbLignes++;
      if (typeLocal === 'Maison') existing.hasMaison = true;
      // Garder la meilleure adresse (celle avec le plus d'info)
      if (adresse.length > existing.adresse.length) {
        existing.adresse = adresse;
      }
    } else {
      // Nouvelle mutation
      const [jour, mois, annee] = dateMutation.split('/');
      const dateISO = `${annee}-${mois}-${jour}`;

      mutations.set(mutationKey, {
        dateVente: dateISO,
        adresse,
        codePostal,
        ville: commune,
        departement: codeDept,
        valeur,
        surfaceBatiTotal: surfaceBati,
        surfaceTerrainTotal: surfaceTerrain,
        nbPiecesTotal: nbPieces,
        nbLots,
        nbLignes: 1,
        hasMaison: typeLocal === 'Maison'
      });
    }
  }

  console.log(`\n✅ ${lineCount.toLocaleString()} lignes analysées`);
  console.log(`✅ ${mutations.size} mutations uniques détectées`);

  // Filtrer : garder seulement les mutations avec au moins une maison
  const maisons = [...mutations.values()].filter(m => m.hasMaison);
  console.log(`✅ ${maisons.length} mutations avec maison en IDF\n`);

  // Dédoublonner par adresse (garder la plus récente)
  const byAddress = new Map();
  maisons.forEach(m => {
    const key = `${m.adresse}-${m.codePostal}`;
    if (!byAddress.has(key) || new Date(m.dateVente) > new Date(byAddress.get(key).dateVente)) {
      byAddress.set(key, m);
    }
  });

  const leads = [...byAddress.values()];
  console.log(`✅ ${leads.length} adresses uniques après déduplication\n`);

  // Calculer le prix/m² pour chaque lead
  leads.forEach(lead => {
    if (lead.surfaceBatiTotal > 0) {
      lead.prixM2 = Math.round(lead.valeur / lead.surfaceBatiTotal);
    } else {
      lead.prixM2 = 0;
    }
  });

  // Trier par date décroissante
  leads.sort((a, b) => new Date(b.dateVente) - new Date(a.dateVente));

  // Générer le TSV avec nouvelles colonnes
  const tsvHeaders = [
    'ID', 'Date_Vente', 'Adresse', 'Code_Postal', 'Ville', 'Département',
    'Valeur_Vente', 'Surface_Bâtie', 'Surface_Terrain', 'Nb_Pièces', 'Nb_Lots',
    'Prix_M2', 'Statut', 'Notes'
  ];

  const tsvLines = [tsvHeaders.join('\t')];

  leads.forEach((lead, index) => {
    const notes = [];
    if (lead.nbLignes > 1) notes.push(`${lead.nbLignes} parcelles`);
    if (lead.surfaceTerrainTotal > 1000) notes.push(`Grand terrain`);

    tsvLines.push([
      index + 1,
      lead.dateVente,
      lead.adresse,
      lead.codePostal,
      lead.ville,
      lead.departement,
      lead.valeur.toLocaleString('fr-FR') + ' €',
      lead.surfaceBatiTotal > 0 ? lead.surfaceBatiTotal + ' m²' : '',
      lead.surfaceTerrainTotal > 0 ? lead.surfaceTerrainTotal + ' m²' : '',
      lead.nbPiecesTotal || '',
      lead.nbLots || lead.nbLignes,
      lead.prixM2 > 0 ? lead.prixM2.toLocaleString('fr-FR') + ' €/m²' : '',
      'Nouveau',
      notes.join(', ')
    ].join('\t'));
  });

  fs.writeFileSync(OUTPUT_FILE, tsvLines.join('\n'), 'utf-8');

  console.log(`📁 Fichier généré : ${OUTPUT_FILE}`);
  console.log(`📊 ${leads.length} leads prêts à importer\n`);

  // Stats par département
  console.log('📊 Répartition par département :');
  const byDept = {};
  leads.forEach(l => {
    byDept[l.departement] = (byDept[l.departement] || 0) + 1;
  });
  Object.entries(byDept).sort((a, b) => b[1] - a[1]).forEach(([dept, count]) => {
    console.log(`   ${dept}: ${count} maisons`);
  });

  // Stats prix/m²
  const validPrixM2 = leads.filter(l => l.prixM2 > 0);
  if (validPrixM2.length > 0) {
    const avgPrixM2 = Math.round(validPrixM2.reduce((sum, l) => sum + l.prixM2, 0) / validPrixM2.length);
    const minPrixM2 = Math.min(...validPrixM2.map(l => l.prixM2));
    const maxPrixM2 = Math.max(...validPrixM2.map(l => l.prixM2));
    console.log(`\n📊 Prix au m² :`)
    console.log(`   Moyenne : ${avgPrixM2.toLocaleString('fr-FR')} €/m²`);
    console.log(`   Min : ${minPrixM2.toLocaleString('fr-FR')} €/m²`);
    console.log(`   Max : ${maxPrixM2.toLocaleString('fr-FR')} €/m²`);
  }

  console.log('\n📋 Pour importer dans Google Sheets :');
  console.log('   1. Ouvre le CRM RA Bâtiment');
  console.log('   2. Crée un nouvel onglet "DVF S1 2025"');
  console.log('   3. Ouvre le fichier leads-dvf-2025-s1-idf.tsv');
  console.log('   4. Copie tout (Ctrl+A, Ctrl+C)');
  console.log('   5. Colle dans l\'onglet (Ctrl+V)');
}

parseFile().catch(console.error);
