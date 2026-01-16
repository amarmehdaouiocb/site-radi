import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.resolve(__dirname, '..', 'print-ready', 'single-pages');

// Configuration des cartes de visite
const cartes = [
  { name: 'radi', variant: 'dark', html: 'carte-visite-v3-radi.html' },
  { name: 'radi', variant: 'light', html: 'carte-visite-v3-radi-light.html' },
  { name: 'slimane', variant: 'dark', html: 'carte-visite-v3-slimane.html' },
  { name: 'slimane', variant: 'light', html: 'carte-visite-v3-slimane-light.html' },
];

// Configuration des flyers
const flyers = [
  { variant: 'dark', html: 'flyer-combined.html' },
  { variant: 'light', html: 'flyer-combined-light.html' },
];

async function exportSinglePages() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  console.log('═══════════════════════════════════════════════════════');
  console.log('  Export PDF - Fichiers Mono-Page pour Impression');
  console.log('═══════════════════════════════════════════════════════\n');

  // ========================================
  // CARTES DE VISITE - Pages séparées
  // ========================================
  console.log('📇 Cartes de visite (recto/verso séparés)...\n');

  for (const carte of cartes) {
    const htmlPath = path.resolve(__dirname, '..', 'public', 'documents', carte.html);

    // Recto
    const rectoPath = path.join(outputDir, `carte-${carte.name}-${carte.variant}-recto.pdf`);
    console.log(`  Génération carte-${carte.name}-${carte.variant}-recto.pdf...`);

    const pageRecto = await browser.newPage();
    await pageRecto.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Masquer le verso (deuxième carte)
    await pageRecto.evaluate(() => {
      const cards = document.querySelectorAll('.card');
      const h2s = document.querySelectorAll('h2');
      if (cards[1]) cards[1].style.display = 'none';
      if (h2s[1]) h2s[1].style.display = 'none';
    });

    await pageRecto.pdf({
      path: rectoPath,
      width: '85mm',
      height: '55mm',
      printBackground: true,
      preferCSSPageSize: false,
      scale: 1,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    await pageRecto.close();
    console.log(`  ✓ carte-${carte.name}-${carte.variant}-recto.pdf`);

    // Verso
    const versoPath = path.join(outputDir, `carte-${carte.name}-${carte.variant}-verso.pdf`);
    console.log(`  Génération carte-${carte.name}-${carte.variant}-verso.pdf...`);

    const pageVerso = await browser.newPage();
    await pageVerso.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Masquer le recto (première carte)
    await pageVerso.evaluate(() => {
      const cards = document.querySelectorAll('.card');
      const h2s = document.querySelectorAll('h2');
      if (cards[0]) cards[0].style.display = 'none';
      if (h2s[0]) h2s[0].style.display = 'none';
    });

    await pageVerso.pdf({
      path: versoPath,
      width: '85mm',
      height: '55mm',
      printBackground: true,
      preferCSSPageSize: false,
      scale: 1,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    await pageVerso.close();
    console.log(`  ✓ carte-${carte.name}-${carte.variant}-verso.pdf`);
  }

  // ========================================
  // FLYERS - Pages séparées
  // ========================================
  console.log('\n📄 Flyers A5 (recto/verso séparés)...\n');

  for (const flyer of flyers) {
    const htmlPath = path.resolve(__dirname, '..', 'flyer', flyer.html);

    // Recto
    const rectoPath = path.join(outputDir, `flyer-${flyer.variant}-recto.pdf`);
    console.log(`  Génération flyer-${flyer.variant}-recto.pdf...`);

    const pageRecto = await browser.newPage();
    await pageRecto.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Masquer le verso
    await pageRecto.evaluate(() => {
      const verso = document.getElementById('verso');
      if (verso) verso.style.display = 'none';
    });

    await pageRecto.pdf({
      path: rectoPath,
      width: '154mm',
      height: '216mm',
      printBackground: true,
      preferCSSPageSize: true,
      scale: 1,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    await pageRecto.close();
    console.log(`  ✓ flyer-${flyer.variant}-recto.pdf`);

    // Verso
    const versoPath = path.join(outputDir, `flyer-${flyer.variant}-verso.pdf`);
    console.log(`  Génération flyer-${flyer.variant}-verso.pdf...`);

    const pageVerso = await browser.newPage();
    await pageVerso.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Masquer le recto
    await pageVerso.evaluate(() => {
      const recto = document.getElementById('recto');
      if (recto) recto.style.display = 'none';
    });

    await pageVerso.pdf({
      path: versoPath,
      width: '154mm',
      height: '216mm',
      printBackground: true,
      preferCSSPageSize: true,
      scale: 1,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    await pageVerso.close();
    console.log(`  ✓ flyer-${flyer.variant}-verso.pdf`);
  }

  await browser.close();

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  ✅ Exportation mono-page terminée !');
  console.log('═══════════════════════════════════════════════════════');
  console.log('\nFichiers générés dans print-ready/single-pages/ :');
  console.log('\n  Cartes de visite (85mm x 55mm) :');
  console.log('  • carte-radi-dark-recto.pdf / verso.pdf');
  console.log('  • carte-radi-light-recto.pdf / verso.pdf');
  console.log('  • carte-slimane-dark-recto.pdf / verso.pdf');
  console.log('  • carte-slimane-light-recto.pdf / verso.pdf');
  console.log('\n  Flyers A5 (154mm x 216mm avec fond perdu) :');
  console.log('  • flyer-dark-recto.pdf / verso.pdf');
  console.log('  • flyer-light-recto.pdf / verso.pdf');
}

exportSinglePages().catch(console.error);
