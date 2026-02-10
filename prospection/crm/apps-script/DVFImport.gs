/**
 * Module d'import des ventes immobilières DVF
 *
 * Source : API DVF Etalab (gratuite)
 * https://api.cquest.org/dvf
 *
 * Documentation : https://app.dvf.etalab.gouv.fr/
 */

// Configuration DVF
const DVF_CONFIG = {
  API_BASE_URL: 'https://api.cquest.org/dvf',
  // Nombre de mois à remonter pour les ventes récentes
  MOIS_RECENTS: 3,
  // Année de construction max pour cibler les maisons à rénover
  ANNEE_CONSTRUCTION_MAX: 1990,
  // Types de biens à cibler
  TYPES_BIENS: ['Maison']
};

/**
 * Lance l'import DVF interactif
 */
function importDVF() {
  const ui = SpreadsheetApp.getUi();

  // Demander le département
  const deptResponse = ui.prompt(
    '📥 Import DVF - Ventes immobilières',
    'Entrez le code département (ex: 93, 94, 75) :\n\n' +
    'Astuce : Vous pouvez entrer plusieurs départements séparés par des virgules (ex: 93,94)',
    ui.ButtonSet.OK_CANCEL
  );

  if (deptResponse.getSelectedButton() !== ui.Button.OK) return;

  const departements = deptResponse.getResponseText()
    .split(',')
    .map(d => d.trim())
    .filter(d => /^\d{2}$/.test(d));

  if (departements.length === 0) {
    ui.alert('❌ Erreur', 'Veuillez entrer un code département valide (2 chiffres).', ui.ButtonSet.OK);
    return;
  }

  // Confirmer les paramètres
  const confirm = ui.alert(
    '🔍 Paramètres de recherche',
    `Départements : ${departements.join(', ')}\n` +
    `Période : ${DVF_CONFIG.MOIS_RECENTS} derniers mois\n` +
    `Type de bien : ${DVF_CONFIG.TYPES_BIENS.join(', ')}\n` +
    `Construction avant : ${DVF_CONFIG.ANNEE_CONSTRUCTION_MAX}\n\n` +
    'Lancer la recherche ?',
    ui.ButtonSet.OK_CANCEL
  );

  if (confirm !== ui.Button.OK) return;

  // Afficher un message de chargement
  SpreadsheetApp.getActiveSpreadsheet().toast('Recherche en cours...', '⏳', -1);

  let totalImported = 0;
  let totalSkipped = 0;

  for (const dept of departements) {
    const result = fetchDVFData(dept);
    totalImported += result.imported;
    totalSkipped += result.skipped;
  }

  SpreadsheetApp.getActiveSpreadsheet().toast('', '', 1);

  ui.alert(
    '✅ Import DVF terminé',
    `Résultats :\n` +
    `• ${totalImported} leads importés\n` +
    `• ${totalSkipped} ventes ignorées (doublons, hors critères)`,
    ui.ButtonSet.OK
  );
}

/**
 * Récupère les données DVF pour un département
 */
function fetchDVFData(departement) {
  // Calculer la date de début (X mois en arrière)
  const dateDebut = new Date();
  dateDebut.setMonth(dateDebut.getMonth() - DVF_CONFIG.MOIS_RECENTS);
  const dateDebutStr = formatDateISO(dateDebut);

  // L'API DVF utilise des paramètres géographiques
  // On va chercher par code département
  let imported = 0;
  let skipped = 0;

  try {
    // L'API DVF de cquest permet de filtrer par département
    // Format : https://api.cquest.org/dvf?code_departement=93
    const url = `${DVF_CONFIG.API_BASE_URL}?code_departement=${departement}`;

    const response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.getResponseCode() !== 200) {
      Logger.log(`Erreur API DVF pour ${departement}: ${response.getResponseCode()}`);
      return { imported: 0, skipped: 0 };
    }

    const data = JSON.parse(response.getContentText());

    if (!data.resultats || !Array.isArray(data.resultats)) {
      Logger.log(`Pas de résultats pour ${departement}`);
      return { imported: 0, skipped: 0 };
    }

    for (const vente of data.resultats) {
      const result = processVente(vente, dateDebut);
      if (result === 'imported') imported++;
      else skipped++;
    }

  } catch (e) {
    Logger.log(`Erreur lors de l'import DVF: ${e.message}`);
    // Fallback : utiliser l'API alternative ou les données locales
    const fallbackResult = fetchDVFFallback(departement);
    imported = fallbackResult.imported;
    skipped = fallbackResult.skipped;
  }

  return { imported, skipped };
}

/**
 * Traite une vente DVF individuelle
 */
function processVente(vente, dateDebut) {
  // Vérifier la date de mutation
  const dateMutation = new Date(vente.date_mutation);
  if (dateMutation < dateDebut) {
    return 'skipped';
  }

  // Vérifier le type de bien
  const typeBien = vente.type_local || '';
  if (!DVF_CONFIG.TYPES_BIENS.some(t => typeBien.toLowerCase().includes(t.toLowerCase()))) {
    return 'skipped';
  }

  // Vérifier l'année de construction (si disponible)
  // Note : Cette info n'est pas toujours dans DVF, mais on peut la croiser

  // Construire l'adresse
  const adresse = [
    vente.adresse_numero,
    vente.adresse_suffixe,
    vente.adresse_nom_voie
  ].filter(Boolean).join(' ').trim();

  const codePostal = vente.code_postal || '';
  const ville = vente.nom_commune || '';

  // Vérifier les doublons
  if (isDuplicateLead(adresse, codePostal)) {
    return 'skipped';
  }

  // Créer le lead
  const leadData = {
    source: 'DVF - Vente récente',
    adresse: adresse,
    codePostal: codePostal,
    ville: ville,
    typeProjet: 'Achat récent - Rénovation potentielle',
    surface: vente.surface_reelle_bati || '',
    notes: `Vente du ${formatDate(dateMutation)} - ` +
           `${vente.valeur_fonciere ? formatMontant(vente.valeur_fonciere) + '€' : 'Prix NC'} - ` +
           `${typeBien}`
  };

  addLeadParticulier(leadData);
  return 'imported';
}

/**
 * Fallback : Import manuel depuis données téléchargées
 */
function fetchDVFFallback(departement) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const importSheet = ss.getSheetByName('Import DVF');

  if (!importSheet) {
    // Créer un onglet avec instructions
    const newSheet = ss.insertSheet('Import DVF');
    newSheet.getRange('A1').setValue(
      'L\'API DVF n\'est pas accessible. Téléchargez les données manuellement depuis :\n' +
      'https://app.dvf.etalab.gouv.fr/\n\n' +
      'Puis collez les données ici et relancez l\'import.'
    );
    return { imported: 0, skipped: 0 };
  }

  // Traiter les données locales (même logique que Sitadel)
  const data = importSheet.getDataRange().getValues();
  let imported = 0;
  let skipped = 0;

  const headers = data[0].map(h => h.toString().toLowerCase().trim());

  const colIndex = {
    dateMutation: findColumnIndex(headers, ['date_mutation', 'date']),
    adresse: findColumnIndex(headers, ['adresse', 'adresse_nom_voie']),
    numero: findColumnIndex(headers, ['no_voie', 'adresse_numero']),
    codePostal: findColumnIndex(headers, ['code_postal', 'cp']),
    commune: findColumnIndex(headers, ['commune', 'nom_commune']),
    typeLocal: findColumnIndex(headers, ['type_local', 'type']),
    surface: findColumnIndex(headers, ['surface_reelle_bati', 'surface']),
    valeur: findColumnIndex(headers, ['valeur_fonciere', 'prix', 'valeur'])
  };

  const dateDebut = new Date();
  dateDebut.setMonth(dateDebut.getMonth() - DVF_CONFIG.MOIS_RECENTS);

  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    // Filtrer par date
    if (colIndex.dateMutation !== -1) {
      const dateMutation = new Date(row[colIndex.dateMutation]);
      if (dateMutation < dateDebut) {
        skipped++;
        continue;
      }
    }

    // Filtrer par type
    if (colIndex.typeLocal !== -1) {
      const typeLocal = row[colIndex.typeLocal]?.toString().toLowerCase() || '';
      if (!typeLocal.includes('maison')) {
        skipped++;
        continue;
      }
    }

    // Construire l'adresse
    let adresse = '';
    if (colIndex.numero !== -1) adresse += row[colIndex.numero] + ' ';
    if (colIndex.adresse !== -1) adresse += row[colIndex.adresse];
    adresse = adresse.trim();

    const codePostal = colIndex.codePostal !== -1 ? row[colIndex.codePostal]?.toString() : '';

    if (isDuplicateLead(adresse, codePostal)) {
      skipped++;
      continue;
    }

    const leadData = {
      source: 'DVF - Import manuel',
      adresse: adresse,
      codePostal: codePostal,
      ville: colIndex.commune !== -1 ? row[colIndex.commune]?.toString() : '',
      typeProjet: 'Achat récent - Rénovation potentielle',
      surface: colIndex.surface !== -1 ? parseFloat(row[colIndex.surface]) || '' : '',
      notes: 'Import DVF manuel'
    };

    addLeadParticulier(leadData);
    imported++;
  }

  return { imported, skipped };
}

/**
 * Formate une date en ISO
 */
function formatDateISO(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Formate un montant
 */
function formatMontant(montant) {
  return new Intl.NumberFormat('fr-FR').format(montant);
}

/**
 * Affiche le guide DVF
 */
function showDVFGuide() {
  const html = HtmlService.createHtmlOutput(`
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; max-width: 600px; }
      h2 { color: #1a365d; }
      h3 { color: #2c5282; margin-top: 20px; }
      .tip { background: #e6fffa; padding: 10px; border-radius: 5px; margin: 10px 0; }
      .warning { background: #fef3c7; padding: 10px; border-radius: 5px; margin: 10px 0; }
    </style>

    <h2>📊 Guide Import DVF</h2>

    <h3>Qu'est-ce que DVF ?</h3>
    <p>
      <strong>Demandes de Valeurs Foncières</strong> : Base de données publique
      de toutes les ventes immobilières en France.
    </p>

    <h3>Pourquoi c'est utile ?</h3>
    <div class="tip">
      💡 Les acheteurs récents de maisons anciennes sont très susceptibles
      de faire des travaux de rénovation dans les mois suivant leur achat.
    </div>

    <h3>Critères de filtrage</h3>
    <ul>
      <li><strong>Type de bien</strong> : Maisons uniquement</li>
      <li><strong>Période</strong> : Ventes des 3 derniers mois</li>
      <li><strong>Zone</strong> : Île-de-France</li>
    </ul>

    <h3>Sources de données</h3>
    <ul>
      <li><a href="https://app.dvf.etalab.gouv.fr/" target="_blank">app.dvf.etalab.gouv.fr</a> (visualisation)</li>
      <li><a href="https://api.cquest.org/dvf" target="_blank">api.cquest.org/dvf</a> (API)</li>
    </ul>

    <div class="warning">
      ⚠️ L'API peut être lente ou indisponible temporairement.
      En cas d'erreur, téléchargez les données manuellement.
    </div>

  `).setWidth(500).setHeight(500);

  SpreadsheetApp.getUi().showModalDialog(html, 'Guide DVF');
}
