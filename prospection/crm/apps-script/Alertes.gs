/**
 * Module de gestion des alertes et relances
 *
 * Ce script envoie des rappels pour les leads à relancer
 * et génère des rapports d'activité.
 */

/**
 * Vérifie les leads à relancer et envoie un email récapitulatif
 * À configurer comme déclencheur quotidien (9h)
 */
function checkRelances() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const emailAlerte = getConfigValue('Email alerte') || CONFIG.COMPANY_EMAIL;

  const relancesParticuliers = getLeadsARelancer(CONFIG.SHEET_PARTICULIERS, 'particulier');
  const relancesB2B = getLeadsARelancer(CONFIG.SHEET_B2B, 'b2b');

  const urgentsParticuliers = getLeadsUrgents(CONFIG.SHEET_PARTICULIERS);
  const urgentsB2B = getLeadsUrgentsB2B(CONFIG.SHEET_B2B);

  // Si rien à signaler, ne pas envoyer d'email
  if (relancesParticuliers.length === 0 &&
      relancesB2B.length === 0 &&
      urgentsParticuliers.length === 0 &&
      urgentsB2B.length === 0) {
    Logger.log('Aucune relance à effectuer aujourd\'hui');
    return;
  }

  // Construire l'email
  const subject = `🔔 CRM RA Bâtiment - ${relancesParticuliers.length + relancesB2B.length} relances à faire`;

  let body = `Bonjour,\n\nVoici le récapitulatif des relances à effectuer aujourd'hui.\n\n`;

  // Section Particuliers
  if (relancesParticuliers.length > 0 || urgentsParticuliers.length > 0) {
    body += `═══════════════════════════════════════\n`;
    body += `👤 LEADS PARTICULIERS\n`;
    body += `═══════════════════════════════════════\n\n`;

    if (relancesParticuliers.length > 0) {
      body += `📅 À relancer aujourd'hui (${relancesParticuliers.length}) :\n`;
      for (const lead of relancesParticuliers) {
        body += `  • ${lead.ville || 'NC'} - ${lead.adresse || 'Adresse NC'}\n`;
        body += `    Statut: ${lead.statut} | Source: ${lead.source}\n`;
        if (lead.notes) body += `    Notes: ${lead.notes.substring(0, 50)}...\n`;
        body += `\n`;
      }
    }

    if (urgentsParticuliers.length > 0) {
      body += `\n⚠️ Sans contact depuis +7 jours (${urgentsParticuliers.length}) :\n`;
      for (const lead of urgentsParticuliers) {
        body += `  • ${lead.ville || 'NC'} - ${lead.adresse || 'Adresse NC'}\n`;
        body += `    Dernier contact: ${formatDate(lead.dateContact) || 'Jamais'}\n`;
        body += `\n`;
      }
    }
  }

  // Section B2B
  if (relancesB2B.length > 0 || urgentsB2B.length > 0) {
    body += `\n═══════════════════════════════════════\n`;
    body += `🏢 LEADS B2B\n`;
    body += `═══════════════════════════════════════\n\n`;

    if (relancesB2B.length > 0) {
      body += `📅 À relancer aujourd'hui (${relancesB2B.length}) :\n`;
      for (const lead of relancesB2B) {
        body += `  • ${lead.entreprise} - ${lead.contact || 'Contact NC'}\n`;
        body += `    ${lead.email || 'Email NC'} | Type: ${lead.type}\n`;
        body += `    Statut: ${lead.statut}\n`;
        body += `\n`;
      }
    }

    if (urgentsB2B.length > 0) {
      body += `\n⚠️ Relance en retard (${urgentsB2B.length}) :\n`;
      for (const lead of urgentsB2B) {
        body += `  • ${lead.entreprise} - ${lead.email || 'Email NC'}\n`;
        body += `    Dernier email: ${formatDate(lead.dateContact) || 'NC'}\n`;
        body += `\n`;
      }
    }
  }

  // Stats globales
  body += `\n═══════════════════════════════════════\n`;
  body += `📊 STATISTIQUES RAPIDES\n`;
  body += `═══════════════════════════════════════\n`;

  const stats = getQuickStats();
  body += `\nLeads particuliers : ${stats.particuliers.total} total\n`;
  body += `  • Nouveaux : ${stats.particuliers.nouveau}\n`;
  body += `  • En cours : ${stats.particuliers.enCours}\n`;
  body += `  • Gagnés : ${stats.particuliers.gagne}\n`;

  body += `\nLeads B2B : ${stats.b2b.total} total\n`;
  body += `  • Nouveaux : ${stats.b2b.nouveau}\n`;
  body += `  • En attente : ${stats.b2b.enAttente}\n`;
  body += `  • Partenaires : ${stats.b2b.partenaire}\n`;

  body += `\n---\n`;
  body += `Accéder au CRM : ${ss.getUrl()}\n`;
  body += `\nBonne prospection !\n`;
  body += `RA Bâtiment - Système automatisé`;

  // Envoyer l'email
  try {
    MailApp.sendEmail({
      to: emailAlerte,
      subject: subject,
      body: body
    });
    Logger.log(`Email de relance envoyé à ${emailAlerte}`);
  } catch (e) {
    Logger.log(`Erreur envoi email: ${e.message}`);
  }
}

/**
 * Récupère les leads à relancer aujourd'hui
 */
function getLeadsARelancer(sheetName, type) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const leads = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    // Colonne "Prochain contact" : index 13 pour particuliers, 10 pour B2B
    const colProchainContact = type === 'particulier' ? 13 : 10;
    const prochainContact = row[colProchainContact];

    if (!prochainContact) continue;

    const dateRelance = new Date(prochainContact);
    dateRelance.setHours(0, 0, 0, 0);

    if (dateRelance.getTime() === today.getTime()) {
      if (type === 'particulier') {
        leads.push({
          id: row[0],
          source: row[2],
          adresse: row[4],
          ville: row[6],
          statut: row[11],
          notes: row[14]
        });
      } else {
        leads.push({
          id: row[0],
          entreprise: row[2],
          contact: row[3],
          email: row[4],
          type: row[6],
          statut: row[8]
        });
      }
    }
  }

  return leads;
}

/**
 * Récupère les leads particuliers sans contact depuis X jours
 */
function getLeadsUrgents(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();

  const joursRelance = parseInt(getConfigValue('Jours avant relance particulier')) || 7;
  const dateLimite = new Date();
  dateLimite.setDate(dateLimite.getDate() - joursRelance);

  const leads = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const statut = row[11];

    // Ignorer les leads terminés
    if (statut === 'Gagné' || statut === 'Perdu') continue;

    const dateContact = row[12];

    // Lead jamais contacté (statut Nouveau)
    if (statut === 'Nouveau') {
      const dateAjout = new Date(row[1]);
      if (dateAjout < dateLimite) {
        leads.push({
          id: row[0],
          adresse: row[4],
          ville: row[6],
          dateContact: null
        });
      }
    }
    // Lead contacté mais pas de nouvelle depuis longtemps
    else if (dateContact) {
      const lastContact = new Date(dateContact);
      if (lastContact < dateLimite) {
        leads.push({
          id: row[0],
          adresse: row[4],
          ville: row[6],
          dateContact: lastContact
        });
      }
    }
  }

  return leads;
}

/**
 * Récupère les leads B2B en retard de relance
 */
function getLeadsUrgentsB2B(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();

  const joursRelance = parseInt(getConfigValue('Jours avant relance B2B')) || 3;
  const dateLimite = new Date();
  dateLimite.setDate(dateLimite.getDate() - joursRelance);

  const leads = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const statut = row[8];

    // Ignorer les leads terminés
    if (statut === 'Partenaire' || statut === 'Perdu' || statut === 'Répondu') continue;

    // Ignorer les nouveaux (pas encore contactés)
    if (statut === 'Nouveau') continue;

    const dateContact = row[9];
    if (dateContact) {
      const lastContact = new Date(dateContact);
      if (lastContact < dateLimite) {
        leads.push({
          id: row[0],
          entreprise: row[2],
          email: row[4],
          dateContact: lastContact,
          statut: statut
        });
      }
    }
  }

  return leads;
}

/**
 * Calcule des statistiques rapides
 */
function getQuickStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Stats particuliers
  const sheetPart = ss.getSheetByName(CONFIG.SHEET_PARTICULIERS);
  const dataPart = sheetPart.getDataRange().getValues();

  const statsPart = {
    total: dataPart.length - 1,
    nouveau: 0,
    enCours: 0,
    gagne: 0
  };

  for (let i = 1; i < dataPart.length; i++) {
    const statut = dataPart[i][11];
    if (statut === 'Nouveau') statsPart.nouveau++;
    else if (statut === 'Gagné') statsPart.gagne++;
    else if (statut !== 'Perdu') statsPart.enCours++;
  }

  // Stats B2B
  const sheetB2B = ss.getSheetByName(CONFIG.SHEET_B2B);
  const dataB2B = sheetB2B.getDataRange().getValues();

  const statsB2B = {
    total: dataB2B.length - 1,
    nouveau: 0,
    enAttente: 0,
    partenaire: 0
  };

  for (let i = 1; i < dataB2B.length; i++) {
    const statut = dataB2B[i][8];
    if (statut === 'Nouveau') statsB2B.nouveau++;
    else if (statut === 'Partenaire') statsB2B.partenaire++;
    else if (statut !== 'Perdu' && statut !== 'Répondu') statsB2B.enAttente++;
  }

  return {
    particuliers: statsPart,
    b2b: statsB2B
  };
}

/**
 * Met à jour l'onglet Activité avec les stats du jour
 */
function mettreAJourActivite() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_ACTIVITE);

  const today = new Date();
  const dateStr = Utilities.formatDate(today, 'Europe/Paris', 'dd/MM/yyyy');

  // Vérifier si une ligne existe déjà pour aujourd'hui
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;

  for (let i = 1; i < data.length; i++) {
    const cellDate = data[i][0];
    if (cellDate) {
      const existingDate = Utilities.formatDate(new Date(cellDate), 'Europe/Paris', 'dd/MM/yyyy');
      if (existingDate === dateStr) {
        rowIndex = i + 1;
        break;
      }
    }
  }

  // Créer une nouvelle ligne si pas de ligne aujourd'hui
  if (rowIndex === -1) {
    sheet.appendRow([today, 0, 0, 0, 0, 0, 0, 0, 0]);
    rowIndex = sheet.getLastRow();
  }

  SpreadsheetApp.getUi().alert(
    '📈 Activité du jour',
    'Ligne d\'activité créée/mise à jour pour aujourd\'hui.\n\n' +
    'Complétez manuellement les colonnes :\n' +
    '• Courriers envoyés\n' +
    '• Emails envoyés\n' +
    '• Réponses reçues\n' +
    '• RDV obtenus\n' +
    '• Devis envoyés\n' +
    '• Chantiers signés',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Génère un rapport hebdomadaire
 */
function genererRapportHebdo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetActivite = ss.getSheetByName(CONFIG.SHEET_ACTIVITE);
  const data = sheetActivite.getDataRange().getValues();

  // Récupérer les 7 derniers jours
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  let totalLeads = 0;
  let totalCourriers = 0;
  let totalEmails = 0;
  let totalReponses = 0;
  let totalRDV = 0;
  let totalDevis = 0;
  let totalChantiers = 0;
  let totalCA = 0;

  for (let i = 1; i < data.length; i++) {
    const rowDate = new Date(data[i][0]);
    if (rowDate >= weekAgo && rowDate <= today) {
      totalLeads += parseInt(data[i][1]) || 0;
      totalCourriers += parseInt(data[i][2]) || 0;
      totalEmails += parseInt(data[i][3]) || 0;
      totalReponses += parseInt(data[i][4]) || 0;
      totalRDV += parseInt(data[i][5]) || 0;
      totalDevis += parseInt(data[i][6]) || 0;
      totalChantiers += parseInt(data[i][7]) || 0;
      totalCA += parseFloat(data[i][8]) || 0;
    }
  }

  const rapport = `
📊 RAPPORT HEBDOMADAIRE - RA Bâtiment
Semaine du ${formatDate(weekAgo)} au ${formatDate(today)}

═══════════════════════════════════════
📥 PROSPECTION
═══════════════════════════════════════
Leads importés      : ${totalLeads}
Courriers envoyés   : ${totalCourriers}
Emails B2B envoyés  : ${totalEmails}

═══════════════════════════════════════
📈 RÉSULTATS
═══════════════════════════════════════
Réponses reçues     : ${totalReponses}
RDV obtenus         : ${totalRDV}
Devis envoyés       : ${totalDevis}
Chantiers signés    : ${totalChantiers}
CA signé            : ${formatMontant(totalCA)} €

═══════════════════════════════════════
📉 TAUX DE CONVERSION
═══════════════════════════════════════
Courriers → Réponse : ${totalCourriers > 0 ? ((totalReponses / totalCourriers) * 100).toFixed(1) : 0}%
RDV → Devis         : ${totalRDV > 0 ? ((totalDevis / totalRDV) * 100).toFixed(1) : 0}%
Devis → Signé       : ${totalDevis > 0 ? ((totalChantiers / totalDevis) * 100).toFixed(1) : 0}%
  `;

  SpreadsheetApp.getUi().alert('Rapport Hebdomadaire', rapport, SpreadsheetApp.getUi().ButtonSet.OK);

  return rapport;
}
