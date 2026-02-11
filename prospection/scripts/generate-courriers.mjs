/**
 * Génère les courriers PDF pour les leads top priorité
 * Utilise le template courrier-dvf.html et Puppeteer
 */

import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const LEADS_FILE = 'prospection/data/leads-top-priorite.tsv';
const TEMPLATE_FILE = 'prospection/templates/courrier/courrier-dvf.html';
const OUTPUT_DIR = 'prospection/courriers-pdf';
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

async function main() {
  console.log('📄 Génération des courriers PDF\n');

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

  const leads = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split('\t');
    leads.push({
      id: values[0],
      adresse: values[4],
      codePostal: values[5],
      ville: values[6],
      departement: values[7],
      score: values[17]
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
    .replace('{{DATE}}', dateStr);
  await page.setContent(firstHtml, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  console.log('✅ Polices chargées\n');

  let generated = 0;
  const startTime = Date.now();

  for (const lead of leads) {
    // Remplacer les placeholders
    const html = template
      .replace('{{ADRESSE}}', lead.adresse)
      .replace('{{CODE_POSTAL}}', lead.codePostal)
      .replace('{{VILLE}}', lead.ville)
      .replace('{{DATE}}', dateStr);

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

    generated++;

    // Afficher la progression tous les 50 courriers
    if (generated % 50 === 0 || generated === leads.length) {
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

  console.log('\n📋 Prochaines étapes :');
  console.log('   1. Ouvre le dossier prospection/courriers-pdf/');
  console.log('   2. Imprime les PDF (recto simple, couleur recommandée)');
  console.log('   3. Mets sous enveloppe avec adresse visible');
  console.log('   4. Affranchis (lettre verte : 1.29€ ou lettre prioritaire : 1.96€)');
}

main().catch(console.error);
