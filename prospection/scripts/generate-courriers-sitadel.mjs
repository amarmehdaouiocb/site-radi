/**
 * Génère les courriers PDF pour les leads Sitadel (permis de construire)
 * Utilise le template courrier-permis.html et Puppeteer
 */

import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const LEADS_FILE = 'prospection/data/leads-sitadel-top-priorite.tsv';
const TEMPLATE_FILE = 'prospection/templates/courrier/courrier-permis.html';
const OUTPUT_DIR = 'prospection/courriers-pdf-sitadel';
const LOGO_FILE = 'public/documents/logo-ra-batiment.png';

// Formater la date en français
function formatDate(date) {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}

// Nettoyer le nom de fichier
function sanitizeFilename(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Retirer les accents
    .replace(/[^a-zA-Z0-9\-_]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
}

// Déterminer le type de travaux pour l'objet
function getTypeTravaux(lead) {
  if (lead.isExtension === 'Oui') return "d'extension";
  if (lead.isSurelevation === 'Oui') return 'de surélévation';
  return 'de rénovation';
}

async function main() {
  console.log('📄 Génération des courriers PDF Sitadel (permis de construire)\n');

  // Vérifier que le fichier existe
  if (!fs.existsSync(LEADS_FILE)) {
    console.error(`❌ Fichier non trouvé : ${LEADS_FILE}`);
    console.log('   Exécute d\'abord : node prospection/scripts/parse-sitadel.mjs');
    process.exit(1);
  }

  // Lire le template
  let template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');
  console.log('✅ Template chargé\n');

  // Lire le logo PNG et le convertir en base64
  const logoBuffer = fs.readFileSync(LOGO_FILE);
  const logoBase64 = logoBuffer.toString('base64');
  const logoDataUri = `data:image/png;base64,${logoBase64}`;

  // Injecter le logo dans le template
  template = template.replace(/{{LOGO_DATA_URI}}/g, logoDataUri);
  console.log('✅ Logo intégré\n');

  // Lire les leads
  const leadsContent = fs.readFileSync(LEADS_FILE, 'utf-8');
  const lines = leadsContent.split('\n');
  const headers = lines[0].split('\t');

  // Mapper les colonnes
  const colIndex = {};
  headers.forEach((h, i) => colIndex[h] = i);

  const leads = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split('\t');
    leads.push({
      id: values[colIndex['ID']],
      numPermis: values[colIndex['Num_Permis']],
      adresse: values[colIndex['Adresse']],
      codePostal: values[colIndex['Code_Postal']],
      ville: values[colIndex['Ville']],
      departement: values[colIndex['Departement']],
      isExtension: values[colIndex['Extension']],
      isSurelevation: values[colIndex['Surelevation']],
      score: values[colIndex['Score']]
    });
  }

  console.log(`📊 ${leads.length} leads à traiter\n`);

  // Créer le dossier de sortie
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Créer les sous-dossiers par département
  const depts = [...new Set(leads.map(l => l.departement))];
  depts.forEach(dept => {
    fs.mkdirSync(path.join(OUTPUT_DIR, dept), { recursive: true });
  });

  // Créer aussi un dossier SCORE-70+ pour les top priorité
  fs.mkdirSync(path.join(OUTPUT_DIR, 'SCORE-70+'), { recursive: true });
  depts.forEach(dept => {
    fs.mkdirSync(path.join(OUTPUT_DIR, 'SCORE-70+', dept), { recursive: true });
  });

  // Lancer Puppeteer
  console.log('🚀 Lancement de Puppeteer...\n');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const dateStr = formatDate(new Date());

  // Charger les polices une seule fois au début
  const firstHtml = template
    .replace('{{ADRESSE}}', 'Test')
    .replace('{{CODE_POSTAL}}', '00000')
    .replace('{{VILLE}}', 'Test')
    .replace('{{DATE}}', dateStr)
    .replace('{{TYPE_TRAVAUX}}', "d'extension");
  await page.setContent(firstHtml, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  console.log('✅ Polices chargées\n');

  let generated = 0;
  const startTime = Date.now();

  for (const lead of leads) {
    const typeTravaux = getTypeTravaux(lead);

    // Remplacer les placeholders
    const html = template
      .replace(/{{ADRESSE}}/g, lead.adresse)
      .replace(/{{CODE_POSTAL}}/g, lead.codePostal)
      .replace(/{{VILLE}}/g, lead.ville)
      .replace(/{{DATE}}/g, dateStr)
      .replace(/{{TYPE_TRAVAUX}}/g, typeTravaux);

    // Charger le HTML (polices déjà en cache)
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 5000 });

    // Générer le PDF
    const filename = `${lead.id.padStart(4, '0')}-${sanitizeFilename(lead.ville)}.pdf`;
    const filepath = path.join(OUTPUT_DIR, lead.departement, filename);

    await page.pdf({
      path: filepath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    // Copier aussi dans SCORE-70+
    const score = parseInt(lead.score) || 0;
    if (score >= 70) {
      const topPath = path.join(OUTPUT_DIR, 'SCORE-70+', lead.departement, filename);
      fs.copyFileSync(filepath, topPath);
    }

    generated++;

    // Afficher la progression tous les 10 courriers
    if (generated % 10 === 0 || generated === leads.length) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const rate = (generated / elapsed * 60).toFixed(0);
      console.log(`   📄 ${generated}/${leads.length} générés (${rate}/min)`);
    }
  }

  await browser.close();

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n✅ ${generated} courriers générés en ${totalTime}s`);
  console.log(`\n📁 Dossier : ${OUTPUT_DIR}/`);

  // Afficher les stats par département
  console.log('\n📊 Répartition par département :');
  depts.sort().forEach(dept => {
    const count = leads.filter(l => l.departement === dept).length;
    console.log(`   ${dept}: ${count} courriers`);
  });

  // Compter les score 70+
  const topCount = leads.filter(l => parseInt(l.score) >= 70).length;
  console.log(`\n🔥 Score 70+ : ${topCount} courriers dans ${OUTPUT_DIR}/SCORE-70+/`);

  console.log('\n📋 Prochaines étapes :');
  console.log('   1. Ouvre le dossier prospection/courriers-pdf-sitadel/SCORE-70+/');
  console.log('   2. Imprime les PDF (recto simple, couleur recommandée)');
  console.log('   3. Mets sous enveloppe avec adresse visible');
  console.log('   4. Ou utilise send-courriers-api.mjs pour envoi via Merci Facteur');
}

main().catch(console.error);
