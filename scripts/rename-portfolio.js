const fs = require('fs');
const path = require('path');

const portfolioDir = path.join(__dirname, '../public/portfolio');

// Mapping basé sur l'analyse visuelle des images
const imageMapping = {
  // === CUISINE MODERNE ===
  'WhatsApp Image 2026-01-05 at 18.48.38.jpeg': 'cuisine-moderne-01.jpg',
  'WhatsApp Image 2026-01-06 at 00.01.30.jpeg': 'cuisine-moderne-02.jpg',

  // === SALLE DE BAIN MOSAIQUE (projet principal) ===
  // Avant/Pendant
  'WhatsApp Image 2026-01-05 at 18.48.39 (2).jpeg': 'sdb-mosaique-avant-01.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.39 (5).jpeg': 'sdb-mosaique-avant-02.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.39 (7).jpeg': 'sdb-mosaique-pendant-01.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.39 (10).jpeg': 'sdb-mosaique-pendant-02.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.39 (12).jpeg': 'sdb-mosaique-pendant-03.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.40 (3).jpeg': 'sdb-mosaique-pendant-04.jpg',
  // Après
  'WhatsApp Image 2026-01-05 at 18.48.38 (4).jpeg': 'sdb-mosaique-apres-01.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.38 (5).jpeg': 'sdb-mosaique-apres-02.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.39 (15).jpeg': 'sdb-mosaique-apres-03.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.40.jpeg': 'sdb-mosaique-apres-04.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.40 (6).jpeg': 'sdb-mosaique-apres-05.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.40 (8).jpeg': 'sdb-mosaique-apres-06.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.40 (10).jpeg': 'sdb-mosaique-apres-07.jpg',
  // Artisan
  'WhatsApp Image 2026-01-05 at 18.48.39.jpeg': 'sdb-mosaique-artisan-01.jpg',

  // === SALLE DE BAIN MARBRE ===
  'WhatsApp Image 2026-01-05 at 19.25.50.jpeg': 'sdb-marbre-apres-01.jpg',

  // === WC SUSPENDU ===
  'WhatsApp Image 2026-01-05 at 19.25.48.jpeg': 'wc-suspendu-avant-01.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.38 (6).jpeg': 'wc-suspendu-apres-01.jpg',

  // === TERRASSE PIERRE ===
  'WhatsApp Image 2026-01-05 at 19.25.48 (5).jpeg': 'terrasse-pierre-apres-01.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.49.jpeg': 'terrasse-pierre-apres-02.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.49 (5).jpeg': 'terrasse-pierre-artisan-01.jpg',

  // === TERRASSE BOIS ===
  'WhatsApp Image 2026-01-06 at 00.01.12 (2).jpeg': 'terrasse-bois-apres-01.jpg',
  'WhatsApp Image 2026-01-06 at 00.01.12 (3).jpeg': 'terrasse-bois-apres-02.jpg',
  'WhatsApp Image 2026-01-06 at 00.01.30 (1).jpeg': 'terrasse-bois-apres-03.jpg',

  // === PISCINE ===
  'WhatsApp Image 2026-01-06 at 00.01.12.jpeg': 'piscine-avant-01.jpg',
  'WhatsApp Image 2026-01-06 at 00.01.12 (1).jpeg': 'piscine-apres-01.jpg',

  // === ESCALIER ===
  'WhatsApp Image 2026-01-05 at 19.25.51 (5).jpeg': 'escalier-design-apres-01.jpg',

  // === RENOVATION COMPLETE ===
  'WhatsApp Image 2026-01-05 at 19.25.50 (7).jpeg': 'renovation-placo-pendant-01.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.51.jpeg': 'renovation-couloir-apres-01.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.51 (10).jpeg': 'renovation-tableau-elec-01.jpg',
};

// Renommer les fichiers
let renamed = 0;
let skipped = 0;

for (const [oldName, newName] of Object.entries(imageMapping)) {
  const oldPath = path.join(portfolioDir, oldName);
  const newPath = path.join(portfolioDir, newName);

  if (fs.existsSync(oldPath)) {
    try {
      fs.renameSync(oldPath, newPath);
      console.log(`✓ ${oldName} → ${newName}`);
      renamed++;
    } catch (err) {
      console.error(`✗ Erreur: ${oldName} - ${err.message}`);
    }
  } else {
    console.log(`⊘ Fichier non trouvé: ${oldName}`);
    skipped++;
  }
}

console.log(`\n=== Résumé ===`);
console.log(`Renommés: ${renamed}`);
console.log(`Ignorés: ${skipped}`);
