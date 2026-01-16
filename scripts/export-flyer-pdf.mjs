import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function exportToPDF() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const htmlPath = path.resolve(__dirname, '..', 'flyer', 'flyer-combined.html');
  const pdfPath = path.resolve(__dirname, '..', 'flyer', 'flyer-ra-batiment.pdf');

  console.log('Génération du flyer PDF haute qualité...');

  const page = await browser.newPage();

  // Charger le fichier HTML
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  // Attendre que les fonts et le QR code soient chargés
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Générer le PDF haute qualité
  // Format A5 avec fond perdu : 154mm x 216mm
  await page.pdf({
    path: pdfPath,
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

  console.log('✓ flyer-ra-batiment.pdf créé avec succès');
  console.log(`  → ${pdfPath}`);

  await page.close();
  await browser.close();

  console.log('\nExportation terminée !');
}

exportToPDF().catch(console.error);
