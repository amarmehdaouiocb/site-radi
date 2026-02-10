/**
 * Module d'import des permis de construire Sit@del2
 *
 * Source : data.gouv.fr - Base Sit@del2
 * https://www.data.gouv.fr/fr/datasets/base-des-permis-de-construire-sitadel/
 */

/**
 * Import manuel des données Sit@del depuis un fichier CSV
 * L'utilisateur doit d'abord télécharger le CSV depuis data.gouv.fr
 */
function importSitadel() {
  const ui = SpreadsheetApp.getUi();

  const result = ui.alert(
    '📥 Import Sit@del2',
    'Cette fonction importe les permis de construire depuis un fichier CSV.\n\n' +
    'Étapes :\n' +
    '1. Téléchargez le CSV depuis data.gouv.fr\n' +
    '2. Créez un onglet "Import Sitadel" et collez les données\n' +
    '3. Cliquez sur OK pour lancer le filtrage\n\n' +
    'Voulez-vous continuer ?',
    ui.ButtonSet.OK_CANCEL
  );

  if (result !== ui.Button.OK) return;

  // Vérifier si l'onglet d'import existe
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const importSheet = ss.getSheetByName('Import Sitadel');

  if (!importSheet) {
    ui.alert(
      '⚠️ Onglet manquant',
      'Créez un onglet "Import Sitadel" et collez-y les données CSV avant de relancer.',
      ui.ButtonSet.OK
    );
    return;
  }

  processSitadelData(importSheet);
}

/**
 * Traite les données Sit@del et les filtre pour l'IDF
 */
function processSitadelData(importSheet) {
  const ui = SpreadsheetApp.getUi();
  const data = importSheet.getDataRange().getValues();

  if (data.length < 2) {
    ui.alert('❌ Erreur', 'Aucune donnée trouvée dans l\'onglet Import Sitadel.', ui.ButtonSet.OK);
    return;
  }

  // Identifier les colonnes importantes
  const headers = data[0].map(h => h.toString().toLowerCase().trim());

  // Colonnes Sit@del typiques (peuvent varier selon les fichiers)
  const colIndex = {
    departement: findColumnIndex(headers, ['dep', 'departement', 'code_dep', 'dpt']),
    commune: findColumnIndex(headers, ['commune', 'libelle_commune', 'nom_commune']),
    codePostal: findColumnIndex(headers, ['code_postal', 'cp', 'postal']),
    adresse: findColumnIndex(headers, ['adresse', 'adresse_terrain', 'localisation']),
    natureProjet: findColumnIndex(headers, ['nature_projet', 'nature', 'type_projet', 'nat_proj']),
    surface: findColumnIndex(headers, ['surface', 'surf_plancher', 'shon', 'surface_plancher']),
    dateAutorisation: findColumnIndex(headers, ['date_autorisation', 'date_decision', 'date_reelle'])
  };

  // Vérifier les colonnes minimales
  if (colIndex.departement === -1 || colIndex.commune === -1) {
    ui.alert(
      '❌ Colonnes non trouvées',
      'Impossible de trouver les colonnes département et commune.\n' +
      'Vérifiez le format du fichier CSV.',
      ui.ButtonSet.OK
    );
    return;
  }

  // Filtrer les données IDF
  const departementsIDF = getConfigValue('Départements IDF') || '75,77,78,91,92,93,94,95';
  const deptList = departementsIDF.split(',').map(d => d.trim());

  let imported = 0;
  let skipped = 0;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const dept = row[colIndex.departement]?.toString().trim();

    // Vérifier si c'est en IDF
    if (!deptList.includes(dept)) {
      skipped++;
      continue;
    }

    // Filtrer par type de projet (travaux sur existant = rénovation)
    const natureProjet = colIndex.natureProjet !== -1 ?
      row[colIndex.natureProjet]?.toString().toLowerCase() : '';

    // On garde les projets de rénovation/modification
    const isRenovation = natureProjet.includes('exist') ||
                        natureProjet.includes('renov') ||
                        natureProjet.includes('modif') ||
                        natureProjet.includes('transform') ||
                        natureProjet.includes('extension');

    // Si on ne peut pas déterminer, on importe quand même
    if (colIndex.natureProjet !== -1 && !isRenovation && natureProjet !== '') {
      skipped++;
      continue;
    }

    // Créer le lead
    const leadData = {
      source: 'Permis Sit@del',
      adresse: colIndex.adresse !== -1 ? row[colIndex.adresse]?.toString() : '',
      codePostal: colIndex.codePostal !== -1 ? row[colIndex.codePostal]?.toString() : '',
      ville: colIndex.commune !== -1 ? row[colIndex.commune]?.toString() : '',
      typeProjet: natureProjet || 'Travaux (permis)',
      surface: colIndex.surface !== -1 ? parseFloat(row[colIndex.surface]) || '' : '',
      notes: 'Import Sit@del - ' +
             (colIndex.dateAutorisation !== -1 ?
               'Autorisé le ' + formatDate(row[colIndex.dateAutorisation]) :
               new Date().toLocaleDateString('fr-FR'))
    };

    // Vérifier les doublons
    if (!isDuplicateLead(leadData.adresse, leadData.codePostal)) {
      addLeadParticulier(leadData);
      imported++;
    } else {
      skipped++;
    }
  }

  ui.alert(
    '✅ Import terminé',
    `Résultats :\n` +
    `• ${imported} leads importés\n` +
    `• ${skipped} lignes ignorées (hors IDF, doublons, ou non-rénovation)`,
    ui.ButtonSet.OK
  );
}

/**
 * Trouve l'index d'une colonne parmi plusieurs noms possibles
 */
function findColumnIndex(headers, possibleNames) {
  for (const name of possibleNames) {
    const index = headers.findIndex(h => h.includes(name));
    if (index !== -1) return index;
  }
  return -1;
}

/**
 * Vérifie si un lead existe déjà (basé sur adresse + CP)
 */
function isDuplicateLead(adresse, codePostal) {
  if (!adresse || !codePostal) return false;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_PARTICULIERS);
  const data = sheet.getDataRange().getValues();

  const adresseLower = adresse.toString().toLowerCase().trim();
  const cpTrim = codePostal.toString().trim();

  for (let i = 1; i < data.length; i++) {
    const existingAdresse = data[i][4]?.toString().toLowerCase().trim();
    const existingCP = data[i][5]?.toString().trim();

    if (existingAdresse === adresseLower && existingCP === cpTrim) {
      return true;
    }
  }

  return false;
}

/**
 * Formate une date
 */
function formatDate(dateValue) {
  if (!dateValue) return '';

  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return dateValue.toString();
    return date.toLocaleDateString('fr-FR');
  } catch (e) {
    return dateValue.toString();
  }
}

/**
 * Guide d'utilisation Sit@del
 */
function showSitadelGuide() {
  const html = HtmlService.createHtmlOutput(`
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; max-width: 600px; }
      h2 { color: #1a365d; }
      h3 { color: #2c5282; margin-top: 20px; }
      ol { line-height: 2; }
      .link { color: #2b6cb0; }
      .warning { background: #fef3c7; padding: 10px; border-radius: 5px; margin: 10px 0; }
    </style>

    <h2>📥 Guide Import Sit@del2</h2>

    <h3>Étape 1 : Télécharger les données</h3>
    <ol>
      <li>Aller sur <a class="link" href="https://www.data.gouv.fr/fr/datasets/base-des-permis-de-construire-sitadel/" target="_blank">data.gouv.fr - Sit@del2</a></li>
      <li>Télécharger le fichier CSV le plus récent</li>
      <li>Ouvrir le fichier dans Excel ou LibreOffice</li>
    </ol>

    <h3>Étape 2 : Préparer l'import</h3>
    <ol>
      <li>Dans ce Google Sheets, créer un onglet "Import Sitadel"</li>
      <li>Copier-coller les données du CSV (avec les en-têtes)</li>
      <li>Vérifier que les colonnes sont bien séparées</li>
    </ol>

    <h3>Étape 3 : Lancer l'import</h3>
    <ol>
      <li>Menu Prospection > Import > Permis de construire</li>
      <li>Le script filtrera automatiquement :</li>
      <ul>
        <li>Uniquement Île-de-France (75-95)</li>
        <li>Travaux sur existant (rénovation)</li>
        <li>Doublons exclus</li>
      </ul>
    </ol>

    <div class="warning">
      ⚠️ <strong>Fréquence recommandée</strong> : 1 import par mois<br>
      Les données Sit@del sont mises à jour mensuellement.
    </div>

  `).setWidth(500).setHeight(550);

  SpreadsheetApp.getUi().showModalDialog(html, 'Guide Sit@del2');
}
