import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cartes = [
  { html: 'carte-visite-v3-radi.html', pdf: 'carte-visite-v3-radi.pdf' },
  { html: 'carte-visite-v3-slimane.html', pdf: 'carte-visite-v3-slimane.pdf' },
];

async function exportToPDF() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const carte of cartes) {
    const htmlPath = path.resolve(__dirname, '..', 'public', 'documents', carte.html);
    const pdfPath = path.resolve(__dirname, '..', 'public', 'documents', carte.pdf);

    console.log(`Génération de ${carte.pdf}...`);

    const page = await browser.newPage();

    // Charger le fichier HTML
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

    // Attendre que les fonts et le QR code soient chargés
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Générer le PDF haute qualité
    // Format carte de visite : 85mm x 55mm
    // On génère une page par carte (recto et verso séparés)
    await page.pdf({
      path: pdfPath,
      width: '210mm',  // A4 width pour avoir les deux cartes
      height: '297mm', // A4 height
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

    console.log(`✓ ${carte.pdf} créé avec succès`);
    await page.close();
  }

  await browser.close();
  console.log('\nExportation terminée !');
  console.log('Les fichiers PDF sont dans public/documents/');
}

exportToPDF().catch(console.error);
