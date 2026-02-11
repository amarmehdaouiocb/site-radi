/**
 * Génère un CSV de leads prêt à importer dans Google Sheets
 */

const https = require('https');
const zlib = require('zlib');
const fs = require('fs');

const DEPARTEMENTS_IDF = ['93', '94', '92', '77', '78', '91', '95'];
const DVF_BASE_URL = 'https://files.data.gouv.fr/geo-dvf/latest/csv/2025/departements/';

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
  const seen = new Set();
  const maisons = data.filter(row => {
    if (row.type_local !== 'Maison') return false;
    if (row.nature_mutation !== 'Vente') return false;

    // Dédoublonner par adresse
    const key = `${row.adresse_numero}-${row.adresse_nom_voie}-${row.code_postal}`;
    if (seen.has(key)) return false;
    seen.add(key);

    return true;
  });

  maisons.sort((a, b) => new Date(b.date_mutation) - new Date(a.date_mutation));
  return maisons.slice(0, 100); // 100 par département
}

async function main() {
  console.log('🚀 Export des leads DVF IDF\n');

  let allLeads = [];
  let id = 1;

  for (const dept of DEPARTEMENTS_IDF) {
    const url = `${DVF_BASE_URL}${dept}.csv.gz`;
    console.log(`📥 Département ${dept}...`);

    try {
      const csvContent = await downloadAndDecompress(url);
      const data = parseCSV(csvContent);
      const maisons = filterMaisons(data);

      console.log(`   → ${maisons.length} maisons`);

      maisons.forEach(m => {
        allLeads.push({
          id: id++,
          dateAjout: new Date().toISOString().split('T')[0],
          source: 'DVF - Import auto',
          nom: '',
          adresse: `${m.adresse_numero} ${m.adresse_nom_voie}`.trim(),
          codePostal: m.code_postal,
          ville: m.nom_commune,
          telephone: '',
          email: '',
          typeProjet: 'Achat récent',
          surface: m.surface_reelle_bati || '',
          statut: 'Nouveau',
          dateContact: '',
          prochainContact: '',
          notes: `Vente ${m.date_mutation} - ${Number(m.valeur_fonciere).toLocaleString('fr-FR')}€`
        });
      });
    } catch (e) {
      console.log(`   ❌ Erreur: ${e.message}`);
    }
  }

  // Générer le CSV
  const headers = ['ID', 'Date ajout', 'Source', 'Nom', 'Adresse', 'Code postal', 'Ville', 'Téléphone', 'Email', 'Type projet', 'Surface', 'Statut', 'Date contact', 'Prochain contact', 'Notes'];
  const csvLines = [headers.join('\t')];

  allLeads.forEach(l => {
    csvLines.push([
      l.id, l.dateAjout, l.source, l.nom, l.adresse, l.codePostal, l.ville,
      l.telephone, l.email, l.typeProjet, l.surface, l.statut,
      l.dateContact, l.prochainContact, l.notes
    ].join('\t'));
  });

  const outputPath = 'prospection/data/leads-dvf-idf.tsv';
  fs.mkdirSync('prospection/data', { recursive: true });
  fs.writeFileSync(outputPath, csvLines.join('\n'));

  console.log(`\n✅ ${allLeads.length} leads exportés dans ${outputPath}`);
  console.log('\n📋 Pour importer dans Google Sheets:');
  console.log('   1. Ouvre le fichier leads-dvf-idf.tsv');
  console.log('   2. Copie tout (Ctrl+A, Ctrl+C)');
  console.log('   3. Colle dans l\'onglet "Leads Particuliers" (ligne 2)');
}

main().catch(console.error);
