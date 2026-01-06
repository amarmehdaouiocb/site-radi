const fs = require('fs');
const path = require('path');

const portfolioDir = path.join(__dirname, '../public/portfolio');

// Mapping basé sur l'analyse visuelle des images WhatsApp restantes
const imageMapping = {
  // === SDB MOSAIQUE - photos additionnelles (pendant = en cours) ===
  'WhatsApp Image 2026-01-05 at 18.48.38 (1).jpeg': 'sdb-mosaique-pendant-05.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.38 (2).jpeg': 'sdb-mosaique-pendant-06.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.38 (3).jpeg': 'sdb-mosaique-pendant-07.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.39 (1).jpeg': 'sdb-mosaique-artisan-02.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.39 (3).jpeg': 'sdb-mosaique-pendant-08.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.39 (4).jpeg': 'sdb-mosaique-pendant-09.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.39 (6).jpeg': 'sdb-mosaique-pendant-10.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.39 (8).jpeg': 'sdb-mosaique-pendant-11.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.39 (9).jpeg': 'sdb-mosaique-pendant-12.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.40 (1).jpeg': 'sdb-mosaique-apres-08.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.40 (2).jpeg': 'sdb-mosaique-apres-09.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.40 (4).jpeg': 'sdb-mosaique-apres-10.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.40 (5).jpeg': 'sdb-mosaique-apres-11.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.40 (7).jpeg': 'sdb-mosaique-apres-12.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.40 (9).jpeg': 'sdb-mosaique-apres-13.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.40 (11).jpeg': 'sdb-mosaique-apres-14.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.40 (12).jpeg': 'sdb-mosaique-apres-15.jpg',

  // === SDB GRIS (autre salle de bain avec mosaique grise) ===
  'WhatsApp Image 2026-01-05 at 18.48.39 (11).jpeg': 'sdb-gris-pendant-01.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.39 (13).jpeg': 'sdb-gris-pendant-02.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.39 (14).jpeg': 'sdb-gris-pendant-03.jpg',
  'WhatsApp Image 2026-01-05 at 18.48.39 (16).jpeg': 'sdb-gris-pendant-04.jpg',

  // === TERRASSE TRAVERTIN - nouveau projet magnifique ===
  'WhatsApp Image 2026-01-05 at 19.25.48 (6).jpeg': 'terrasse-travertin-apres-01.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.48 (7).jpeg': 'terrasse-travertin-apres-02.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.48 (8).jpeg': 'terrasse-travertin-apres-03.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.48 (9).jpeg': 'terrasse-travertin-apres-04.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.48 (10).jpeg': 'terrasse-travertin-artisan-01.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.49 (1).jpeg': 'terrasse-travertin-artisan-02.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.49 (2).jpeg': 'terrasse-travertin-apres-05.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.49 (3).jpeg': 'terrasse-travertin-artisan-03.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.49 (4).jpeg': 'terrasse-travertin-apres-06.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.49 (6).jpeg': 'terrasse-travertin-artisan-04.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.49 (7).jpeg': 'terrasse-travertin-apres-07.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.49 (8).jpeg': 'terrasse-travertin-apres-08.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.49 (9).jpeg': 'terrasse-travertin-apres-09.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.49 (10).jpeg': 'terrasse-travertin-apres-10.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.49 (11).jpeg': 'terrasse-travertin-apres-11.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.49 (12).jpeg': 'terrasse-travertin-apres-12.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.49 (13).jpeg': 'terrasse-travertin-apres-13.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.49 (14).jpeg': 'terrasse-travertin-apres-14.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.49 (15).jpeg': 'terrasse-travertin-apres-15.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.49 (16).jpeg': 'terrasse-travertin-apres-16.jpg',

  // === COMBLES (aménagement de combles) - belles photos finies ===
  'WhatsApp Image 2026-01-05 at 19.25.51 (1).jpeg': 'combles-apres-01.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.51 (2).jpeg': 'combles-apres-02.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.51 (3).jpeg': 'combles-apres-03.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.51 (4).jpeg': 'combles-apres-04.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.51 (6).jpeg': 'combles-apres-05.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.51 (7).jpeg': 'combles-apres-06.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.51 (8).jpeg': 'combles-apres-07.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.51 (9).jpeg': 'combles-apres-08.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.51 (11).jpeg': 'combles-apres-09.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.51 (12).jpeg': 'combles-apres-10.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.51 (13).jpeg': 'combles-apres-11.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.51 (14).jpeg': 'combles-apres-12.jpg',

  // === SDB HEXAGONALE (lié au projet combles - carrelage hexagonal) ===
  'WhatsApp Image 2026-01-05 at 19.25.50 (1).jpeg': 'sdb-hexagonale-apres-01.jpg',

  // === RENOVATION PLACO (travaux de cloisons en cours) ===
  'WhatsApp Image 2026-01-05 at 19.25.48 (1).jpeg': 'renovation-placo-avant-01.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.48 (2).jpeg': 'renovation-placo-pendant-01.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.48 (3).jpeg': 'renovation-placo-pendant-02.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.48 (4).jpeg': 'renovation-placo-pendant-03.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.50 (2).jpeg': 'renovation-placo-artisan-01.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.50 (3).jpeg': 'renovation-placo-pendant-04.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.50 (4).jpeg': 'renovation-placo-pendant-05.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.50 (5).jpeg': 'renovation-placo-pendant-06.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.50 (6).jpeg': 'renovation-placo-pendant-07.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.50 (8).jpeg': 'renovation-placo-pendant-08.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.50 (9).jpeg': 'renovation-placo-pendant-09.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.50 (10).jpeg': 'renovation-placo-artisan-02.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.50 (11).jpeg': 'renovation-placo-pendant-10.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.50 (12).jpeg': 'renovation-placo-pendant-11.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.50 (13).jpeg': 'renovation-placo-pendant-12.jpg',
  'WhatsApp Image 2026-01-05 at 19.25.50 (14).jpeg': 'renovation-placo-pendant-13.jpg',
};

// Videos à supprimer (pas nécessaires pour le portfolio)
const videosToDelete = [
  'WhatsApp Video 2026-01-06 at 00.01.12 (1).mp4',
  'WhatsApp Video 2026-01-06 at 00.01.12.mp4',
];

console.log('Démarrage du renommage des images du portfolio...\n');

let renamed = 0;
let skipped = 0;
let errors = 0;

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
      errors++;
    }
  } else if (fs.existsSync(newPath)) {
    console.log(`- Déjà renommé: ${newName}`);
    skipped++;
  } else {
    console.log(`? Non trouvé: ${oldName}`);
    skipped++;
  }
}

// Supprimer les vidéos
console.log('\nNettoyage des fichiers vidéo...');
for (const video of videosToDelete) {
  const videoPath = path.join(portfolioDir, video);
  if (fs.existsSync(videoPath)) {
    try {
      fs.unlinkSync(videoPath);
      console.log(`✓ Supprimé: ${video}`);
    } catch (err) {
      console.error(`✗ Erreur suppression ${video}: ${err.message}`);
    }
  }
}

console.log(`\n========================================`);
console.log(`Renommés: ${renamed} fichiers`);
console.log(`Ignorés: ${skipped} fichiers`);
console.log(`Erreurs: ${errors} fichiers`);
console.log(`========================================`);
