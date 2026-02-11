/**
 * Script d'import DVF automatique
 *
 * Télécharge les données DVF, filtre les maisons IDF,
 * et les envoie vers Google Sheets via l'API.
 *
 * Usage: node import-dvf.js
 *
 * Variables d'environnement requises:
 * - GOOGLE_SHEETS_ID: ID du Google Sheets CRM
 * - GOOGLE_SERVICE_ACCOUNT_KEY: Clé JSON du service account (base64)
 */

const https = require('https');
const zlib = require('zlib');
const { google } = require('googleapis');

// Configuration
const DEPARTEMENTS_IDF = ['75', '77', '78', '91', '92', '93', '94', '95'];
const DVF_BASE_URL = 'https://files.data.gouv.fr/geo-dvf/latest/csv/2025/departements/';
const MOIS_RECENTS = 3; // Garder les ventes des X derniers mois

async function downloadAndDecompress(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Suivre la redirection
        return downloadAndDecompress(response.headers.location).then(resolve).catch(reject);
      }

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
  const dateLimit = new Date();
  dateLimit.setMonth(dateLimit.getMonth() - MOIS_RECENTS);

  return data.filter(row => {
    // Filtrer par type (Maison uniquement)
    if (row.type_local !== 'Maison') return false;

    // Filtrer par date (ventes récentes)
    const dateMutation = new Date(row.date_mutation);
    if (dateMutation < dateLimit) return false;

    // Filtrer les ventes (pas les donations, etc.)
    if (row.nature_mutation !== 'Vente') return false;

    return true;
  });
}

function formatForCRM(maisons) {
  return maisons.map((m, index) => ({
    id: index + 1,
    dateAjout: new Date().toISOString().split('T')[0],
    source: 'DVF - Import auto',
    nom: '',
    adresse: `${m.adresse_numero} ${m.adresse_nom_voie}`.trim(),
    codePostal: m.code_postal,
    ville: m.nom_commune,
    telephone: '',
    email: '',
    typeProjet: 'Achat récent - Rénovation potentielle',
    surface: m.surface_reelle_bati || '',
    statut: 'Nouveau',
    dateContact: '',
    prochainContact: '',
    notes: `Vente du ${m.date_mutation} - ${Number(m.valeur_fonciere).toLocaleString('fr-FR')}€`
  }));
}

async function appendToGoogleSheets(rows) {
  // Décoder la clé du service account
  const keyBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyBase64) {
    console.log('GOOGLE_SERVICE_ACCOUNT_KEY non définie - mode test');
    console.log(`${rows.length} leads à importer`);
    rows.slice(0, 5).forEach(r => console.log(`  - ${r.ville}: ${r.adresse}`));
    return;
  }

  const key = JSON.parse(Buffer.from(keyBase64, 'base64').toString('utf-8'));

  const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

  // Convertir en tableau de valeurs
  const values = rows.map(r => [
    r.id,
    r.dateAjout,
    r.source,
    r.nom,
    r.adresse,
    r.codePostal,
    r.ville,
    r.telephone,
    r.email,
    r.typeProjet,
    r.surface,
    r.statut,
    r.dateContact,
    r.prochainContact,
    r.notes
  ]);

  // Ajouter les lignes
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Leads Particuliers!A:O',
    valueInputOption: 'USER_ENTERED',
    resource: { values }
  });

  console.log(`✅ ${rows.length} leads importés dans Google Sheets`);
}

async function main() {
  console.log('🚀 Import DVF démarré');

  let allMaisons = [];

  for (const dept of DEPARTEMENTS_IDF) {
    const url = `${DVF_BASE_URL}${dept}.csv.gz`;
    console.log(`📥 Téléchargement ${dept}...`);

    try {
      const csvContent = await downloadAndDecompress(url);
      const data = parseCSV(csvContent);
      const maisons = filterMaisons(data);

      console.log(`   → ${maisons.length} maisons récentes trouvées`);
      allMaisons = allMaisons.concat(maisons);
    } catch (error) {
      console.error(`   ❌ Erreur pour ${dept}: ${error.message}`);
    }
  }

  console.log(`\n📊 Total: ${allMaisons.length} maisons IDF`);

  if (allMaisons.length > 0) {
    const crmRows = formatForCRM(allMaisons);
    await appendToGoogleSheets(crmRows);
  }

  console.log('✅ Import terminé');
}

main().catch(console.error);
