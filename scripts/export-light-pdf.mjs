import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cartes de visite light
const cartes = [
  { html: 'carte-visite-v3-radi-light.html', pdf: 'carte-visite-v3-radi-light.pdf' },
  { html: 'carte-visite-v3-slimane-light.html', pdf: 'carte-visite-v3-slimane-light.pdf' },
];

async function exportToPDF() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  console.log('═══════════════════════════════════════════════════════');
  console.log('  Export PDF - Versions Light');
  console.log('═══════════════════════════════════════════════════════\n');

  // Export des cartes de visite light
  console.log('📇 Cartes de visite...\n');
  for (const carte of cartes) {
    const htmlPath = path.resolve(__dirname, '..', 'public', 'documents', carte.html);
    const pdfPath = path.resolve(__dirname, '..', 'public', 'documents', carte.pdf);

    console.log(`  Génération de ${carte.pdf}...`);

    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.pdf({
      path: pdfPath,
      width: '210mm',
      height: '297mm',
      printBackground: true,
      preferCSSPageSize: false,
      scale: 1,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    console.log(`  ✓ ${carte.pdf} créé`);
    await page.close();
  }

  // Export du flyer light
  console.log('\n📄 Flyer A5...\n');

  const flyerHtmlPath = path.resolve(__dirname, '..', 'flyer', 'flyer-combined-light.html');
  const flyerPdfPath = path.resolve(__dirname, '..', 'flyer', 'flyer-ra-batiment-light.pdf');

  console.log('  Génération du flyer light PDF...');

  const flyerPage = await browser.newPage();
  await flyerPage.goto(`file://${flyerHtmlPath}`, { waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 3000));

  await flyerPage.pdf({
    path: flyerPdfPath,
    width: '154mm',
    height: '216mm',
    printBackground: true,
    preferCSSPageSize: true,
    scale: 1,
    margin: {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0'
    }
  });

  console.log(`  ✓ flyer-ra-batiment-light.pdf créé`);

  await flyerPage.close();
  await browser.close();

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  ✅ Exportation terminée !');
  console.log('═══════════════════════════════════════════════════════');
  console.log('\nFichiers générés :');
  console.log('  • public/documents/carte-visite-v3-radi-light.pdf');
  console.log('  • public/documents/carte-visite-v3-slimane-light.pdf');
  console.log('  • flyer/flyer-ra-batiment-light.pdf');
}

exportToPDF().catch(console.error);
