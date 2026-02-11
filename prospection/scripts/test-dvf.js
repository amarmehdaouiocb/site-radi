/**
 * Script de test - Télécharge et affiche les leads DVF
 * Sans dépendances externes
 */

const https = require('https');
const zlib = require('zlib');

const DEPARTEMENTS_IDF = ['93']; // Test avec 93 uniquement
const DVF_BASE_URL = 'https://files.data.gouv.fr/geo-dvf/latest/csv/2024/departements/';
const MOIS_RECENTS = 6; // 6 derniers mois de données 2024

async function downloadAndDecompress(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      const chunks = [];
      const gunzip = zlib.createGunzip();

      response.pipe(gunzip);

      gunzip.on('data', (chunk) => chunks.push(chunk));
      gunzip.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      gunzip.on('error', reject);
    }).on('error', reject);
  });
}

function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',');
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });
}

function filterMaisons(data) {
  // Prendre les 6 derniers mois de données disponibles
  const maisons = data.filter(row => {
    if (row.type_local !== 'Maison') return false;
    if (row.nature_mutation !== 'Vente') return false;
    return true;
  });

  // Trier par date décroissante et prendre les plus récentes
  maisons.sort((a, b) => new Date(b.date_mutation) - new Date(a.date_mutation));

  // Garder les 200 dernières ventes de maisons
  return maisons.slice(0, 200);
}

async function main() {
  console.log('🚀 Test import DVF\n');

  for (const dept of DEPARTEMENTS_IDF) {
    const url = `${DVF_BASE_URL}${dept}.csv.gz`;
    console.log(`📥 Téléchargement département ${dept}...`);

    const csvContent = await downloadAndDecompress(url);
    const data = parseCSV(csvContent);
    const maisons = filterMaisons(data);

    console.log(`✅ ${maisons.length} maisons récentes trouvées\n`);

    console.log('📋 Exemples de leads:');
    maisons.slice(0, 10).forEach((m, i) => {
      console.log(`${i + 1}. ${m.nom_commune} - ${m.adresse_numero} ${m.adresse_nom_voie}`);
      console.log(`   Prix: ${Number(m.valeur_fonciere).toLocaleString('fr-FR')}€ | Date: ${m.date_mutation}\n`);
    });
  }
}

main().catch(console.error);
