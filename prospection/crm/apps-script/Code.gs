/**
 * CRM RA Bâtiment - Script Principal
 *
 * Ce script gère le CRM de prospection pour RA Bâtiment.
 * Il crée la structure, les menus et coordonne les autres modules.
 */

// Configuration globale
const CONFIG = {
  COMPANY_NAME: "RA Bâtiment",
  COMPANY_PHONE: "06 89 12 46 21",
  COMPANY_EMAIL: "contact@ra-batiment.fr",
  COMPANY_WEBSITE: "ra-batiment.fr",
  COMPANY_ADDRESS: "5 rue de la Gaîté, 93000 Bobigny",

  // Départements IDF
  DEPARTEMENTS_IDF: ["75", "77", "78", "91", "92", "93", "94", "95"],

  // Délais de relance (en jours)
  RELANCE_PARTICULIER: 7,
  RELANCE_B2B: 3,

  // Noms des onglets
  SHEET_PARTICULIERS: "Leads Particuliers",
  SHEET_B2B: "Leads B2B",
  SHEET_ACTIVITE: "Activité",
  SHEET_CONFIG: "Config"
};

/**
 * Crée le menu personnalisé au chargement du document
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🏗️ Prospection')
    .addItem('📊 Initialiser CRM', 'setupCRM')
    .addSeparator()
    .addSubMenu(ui.createMenu('📥 Import')
      .addItem('Permis de construire (Sit@del)', 'importSitadel')
      .addItem('Ventes immobilières (DVF)', 'importDVF'))
    .addSeparator()
    .addItem('📬 Générer courrier PDF', 'genererCourrier')
    .addItem('📧 Préparer email B2B', 'preparerEmailB2B')
    .addSeparator()
    .addItem('🔔 Vérifier relances', 'checkRelances')
    .addItem('📈 Mise à jour activité', 'mettreAJourActivite')
    .addSeparator()
    .addItem('❓ Aide', 'showHelp')
    .addToUi();
}

/**
 * Initialise la structure du CRM avec tous les onglets
 */
function setupCRM() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Créer ou récupérer chaque onglet
  createOrGetSheet(ss, CONFIG.SHEET_PARTICULIERS, getHeadersParticuliers());
  createOrGetSheet(ss, CONFIG.SHEET_B2B, getHeadersB2B());
  createOrGetSheet(ss, CONFIG.SHEET_ACTIVITE, getHeadersActivite());
  createOrGetSheet(ss, CONFIG.SHEET_CONFIG, getHeadersConfig());

  // Remplir la config par défaut
  setupDefaultConfig(ss);

  // Formater les onglets
  formatSheets(ss);

  SpreadsheetApp.getUi().alert(
    '✅ CRM initialisé !',
    'Les onglets ont été créés avec succès.\n\n' +
    'Prochaines étapes :\n' +
    '1. Importer des leads via le menu Prospection\n' +
    '2. Configurer les alertes dans Apps Script > Déclencheurs',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Crée un onglet s'il n'existe pas
 */
function createOrGetSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground('#1a365d')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * En-têtes pour l'onglet Leads Particuliers
 */
function getHeadersParticuliers() {
  return [
    'ID', 'Date ajout', 'Source', 'Nom', 'Adresse', 'Code postal',
    'Ville', 'Téléphone', 'Email', 'Type projet', 'Surface (m²)',
    'Statut', 'Date contact', 'Prochain contact', 'Notes'
  ];
}

/**
 * En-têtes pour l'onglet Leads B2B
 */
function getHeadersB2B() {
  return [
    'ID', 'Date ajout', 'Entreprise', 'Contact', 'Email', 'Téléphone',
    'Type', 'Ville', 'Statut', 'Date contact', 'Prochain contact', 'Notes'
  ];
}

/**
 * En-têtes pour l'onglet Activité
 */
function getHeadersActivite() {
  return [
    'Date', 'Leads importés', 'Courriers envoyés', 'Emails envoyés',
    'Réponses reçues', 'RDV obtenus', 'Devis envoyés', 'Chantiers signés', 'CA signé (€)'
  ];
}

/**
 * En-têtes pour l'onglet Config
 */
function getHeadersConfig() {
  return ['Paramètre', 'Valeur'];
}

/**
 * Configuration par défaut
 */
function setupDefaultConfig(ss) {
  const sheet = ss.getSheetByName(CONFIG.SHEET_CONFIG);
  const existingData = sheet.getDataRange().getValues();

  // Ne pas écraser si des données existent déjà
  if (existingData.length > 1) return;

  const configData = [
    ['Email alerte', CONFIG.COMPANY_EMAIL],
    ['Jours avant relance particulier', CONFIG.RELANCE_PARTICULIER],
    ['Jours avant relance B2B', CONFIG.RELANCE_B2B],
    ['Départements IDF', CONFIG.DEPARTEMENTS_IDF.join(',')],
    ['Téléphone entreprise', CONFIG.COMPANY_PHONE],
    ['Adresse entreprise', CONFIG.COMPANY_ADDRESS],
    ['Site web', CONFIG.COMPANY_WEBSITE]
  ];

  sheet.getRange(2, 1, configData.length, 2).setValues(configData);
}

/**
 * Applique le formatage aux onglets
 */
function formatSheets(ss) {
  // Formater Leads Particuliers
  const sheetPart = ss.getSheetByName(CONFIG.SHEET_PARTICULIERS);
  if (sheetPart) {
    sheetPart.setColumnWidth(1, 50);   // ID
    sheetPart.setColumnWidth(2, 100);  // Date
    sheetPart.setColumnWidth(3, 80);   // Source
    sheetPart.setColumnWidth(4, 120);  // Nom
    sheetPart.setColumnWidth(5, 250);  // Adresse
    sheetPart.setColumnWidth(6, 80);   // CP
    sheetPart.setColumnWidth(7, 120);  // Ville
    sheetPart.setColumnWidth(8, 110);  // Téléphone
    sheetPart.setColumnWidth(9, 180);  // Email
    sheetPart.setColumnWidth(10, 120); // Type projet
    sheetPart.setColumnWidth(11, 80);  // Surface
    sheetPart.setColumnWidth(12, 90);  // Statut
    sheetPart.setColumnWidth(13, 100); // Date contact
    sheetPart.setColumnWidth(14, 110); // Prochain contact
    sheetPart.setColumnWidth(15, 250); // Notes

    // Validation des statuts
    const statutRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Nouveau', 'Contacté', 'Répondu', 'RDV', 'Devis', 'Gagné', 'Perdu'])
      .build();
    sheetPart.getRange('L2:L1000').setDataValidation(statutRule);
  }

  // Formater Leads B2B
  const sheetB2B = ss.getSheetByName(CONFIG.SHEET_B2B);
  if (sheetB2B) {
    sheetB2B.setColumnWidth(1, 50);   // ID
    sheetB2B.setColumnWidth(2, 100);  // Date
    sheetB2B.setColumnWidth(3, 200);  // Entreprise
    sheetB2B.setColumnWidth(4, 150);  // Contact
    sheetB2B.setColumnWidth(5, 200);  // Email
    sheetB2B.setColumnWidth(6, 110);  // Téléphone
    sheetB2B.setColumnWidth(7, 100);  // Type
    sheetB2B.setColumnWidth(8, 120);  // Ville
    sheetB2B.setColumnWidth(9, 90);   // Statut
    sheetB2B.setColumnWidth(10, 100); // Date contact
    sheetB2B.setColumnWidth(11, 110); // Prochain contact
    sheetB2B.setColumnWidth(12, 250); // Notes

    // Validation des types
    const typeRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Syndic', 'Agent immo', 'Architecte', 'Courtier', 'Autre'])
      .build();
    sheetB2B.getRange('G2:G1000').setDataValidation(typeRule);

    // Validation des statuts
    const statutRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Nouveau', 'Email 1', 'Email 2', 'Email 3', 'Répondu', 'Partenaire', 'Perdu'])
      .build();
    sheetB2B.getRange('I2:I1000').setDataValidation(statutRule);
  }
}

/**
 * Récupère une valeur de configuration
 */
function getConfigValue(paramName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_CONFIG);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === paramName) {
      return data[i][1];
    }
  }
  return null;
}

/**
 * Génère un nouvel ID unique
 */
function generateId(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) return 1;

  const lastId = sheet.getRange(lastRow, 1).getValue();
  return (parseInt(lastId) || 0) + 1;
}

/**
 * Ajoute un lead particulier
 */
function addLeadParticulier(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_PARTICULIERS);

  const id = generateId(CONFIG.SHEET_PARTICULIERS);
  const dateAjout = new Date();

  const row = [
    id,
    dateAjout,
    data.source || '',
    data.nom || '',
    data.adresse || '',
    data.codePostal || '',
    data.ville || '',
    data.telephone || '',
    data.email || '',
    data.typeProjet || '',
    data.surface || '',
    'Nouveau',
    '',
    '',
    data.notes || ''
  ];

  sheet.appendRow(row);
  return id;
}

/**
 * Ajoute un lead B2B
 */
function addLeadB2B(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_B2B);

  const id = generateId(CONFIG.SHEET_B2B);
  const dateAjout = new Date();

  const row = [
    id,
    dateAjout,
    data.entreprise || '',
    data.contact || '',
    data.email || '',
    data.telephone || '',
    data.type || '',
    data.ville || '',
    'Nouveau',
    '',
    '',
    data.notes || ''
  ];

  sheet.appendRow(row);
  return id;
}

/**
 * Affiche l'aide
 */
function showHelp() {
  const html = HtmlService.createHtmlOutput(`
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      h2 { color: #1a365d; }
      h3 { color: #2c5282; margin-top: 20px; }
      ul { line-height: 1.8; }
      .tip { background: #e6fffa; padding: 10px; border-radius: 5px; margin: 10px 0; }
    </style>
    <h2>🏗️ CRM RA Bâtiment - Aide</h2>

    <h3>📥 Import de leads</h3>
    <ul>
      <li><strong>Sit@del</strong> : Importe les permis de construire IDF</li>
      <li><strong>DVF</strong> : Importe les ventes immobilières récentes</li>
    </ul>

    <h3>📬 Génération de courriers</h3>
    <ul>
      <li>Sélectionnez une ligne dans "Leads Particuliers"</li>
      <li>Cliquez sur "Générer courrier PDF"</li>
      <li>Le PDF s'ouvrira dans un nouvel onglet</li>
    </ul>

    <h3>🔔 Alertes de relance</h3>
    <ul>
      <li>Configurez un déclencheur quotidien dans Apps Script</li>
      <li>Vous recevrez un email avec les leads à relancer</li>
    </ul>

    <div class="tip">
      💡 <strong>Astuce</strong> : Utilisez les filtres Google Sheets pour trier vos leads par statut ou date.
    </div>

    <h3>📞 Support</h3>
    <p>Pour toute question, contactez : ${CONFIG.COMPANY_EMAIL}</p>
  `).setWidth(450).setHeight(500);

  SpreadsheetApp.getUi().showModalDialog(html, 'Aide - CRM Prospection');
}
