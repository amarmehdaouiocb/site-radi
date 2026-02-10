/**
 * Module de génération de courriers PDF
 *
 * Génère des courriers personnalisés à partir des leads
 * pour envoi postal.
 */

/**
 * Génère un courrier PDF pour le lead sélectionné
 */
function genererCourrier() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const ui = SpreadsheetApp.getUi();

  // Vérifier qu'on est sur l'onglet Leads Particuliers
  if (sheet.getName() !== CONFIG.SHEET_PARTICULIERS) {
    ui.alert(
      '⚠️ Mauvais onglet',
      'Sélectionnez une ligne dans l\'onglet "Leads Particuliers" puis relancez.',
      ui.ButtonSet.OK
    );
    return;
  }

  // Récupérer la ligne sélectionnée
  const selection = sheet.getActiveRange();
  const row = selection.getRow();

  if (row <= 1) {
    ui.alert('⚠️ Sélection invalide', 'Sélectionnez une ligne de données (pas l\'en-tête).', ui.ButtonSet.OK);
    return;
  }

  // Récupérer les données du lead
  const rowData = sheet.getRange(row, 1, 1, 15).getValues()[0];

  const lead = {
    id: rowData[0],
    dateAjout: rowData[1],
    source: rowData[2],
    nom: rowData[3] || 'Madame, Monsieur',
    adresse: rowData[4],
    codePostal: rowData[5],
    ville: rowData[6],
    typeProjet: rowData[9] || 'travaux',
    surface: rowData[10],
    notes: rowData[14]
  };

  // Choisir le template
  const templateChoice = ui.prompt(
    '📬 Type de courrier',
    'Quel template utiliser ?\n\n' +
    '1 = Permis de construire (lead Sit@del)\n' +
    '2 = Achat récent (lead DVF)\n' +
    '3 = Générique',
    ui.ButtonSet.OK_CANCEL
  );

  if (templateChoice.getSelectedButton() !== ui.Button.OK) return;

  const templateType = templateChoice.getResponseText().trim();

  // Générer le HTML du courrier
  let html;
  switch (templateType) {
    case '1':
      html = generateCourrierPermis(lead);
      break;
    case '2':
      html = generateCourrierDVF(lead);
      break;
    default:
      html = generateCourrierGenerique(lead);
  }

  // Créer le PDF
  const blob = Utilities.newBlob(html, 'text/html', 'courrier.html');
  const pdfBlob = blob.getAs('application/pdf');
  pdfBlob.setName(`Courrier_${lead.id}_${lead.ville || 'Lead'}.pdf`);

  // Sauvegarder dans Google Drive (dossier Courriers)
  const folder = getOrCreateFolder('Courriers RA Bâtiment');
  const file = folder.createFile(pdfBlob);

  // Mettre à jour le statut du lead
  sheet.getRange(row, 12).setValue('Contacté'); // Statut
  sheet.getRange(row, 13).setValue(new Date()); // Date contact

  // Calculer la date de relance
  const joursRelance = parseInt(getConfigValue('Jours avant relance particulier')) || 7;
  const dateRelance = new Date();
  dateRelance.setDate(dateRelance.getDate() + joursRelance);
  sheet.getRange(row, 14).setValue(dateRelance); // Prochain contact

  ui.alert(
    '✅ Courrier généré',
    `Le PDF a été créé et sauvegardé dans Google Drive.\n\n` +
    `📁 Dossier : Courriers RA Bâtiment\n` +
    `📄 Fichier : ${file.getName()}\n\n` +
    `Le statut du lead a été mis à jour.\n` +
    `Relance prévue : ${formatDate(dateRelance)}`,
    ui.ButtonSet.OK
  );

  // Ouvrir le PDF
  const url = file.getUrl();
  const htmlOutput = HtmlService.createHtmlOutput(
    `<script>window.open('${url}', '_blank'); google.script.host.close();</script>`
  );
  ui.showModalDialog(htmlOutput, 'Ouverture du PDF...');
}

/**
 * Template courrier pour leads Permis de construire
 */
function generateCourrierPermis(lead) {
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { margin: 2cm; size: A4; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #333;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 24pt;
      font-weight: bold;
      color: #1a365d;
    }
    .logo-subtitle {
      font-size: 10pt;
      color: #666;
    }
    .contact-info {
      text-align: right;
      font-size: 9pt;
      color: #666;
    }
    .destinataire {
      margin: 40px 0;
      margin-left: 50%;
    }
    .date {
      text-align: right;
      margin-bottom: 30px;
    }
    .objet {
      font-weight: bold;
      margin-bottom: 20px;
    }
    .corps {
      text-align: justify;
    }
    .services {
      margin: 20px 0;
      padding-left: 20px;
    }
    .services li {
      margin: 8px 0;
    }
    .signature {
      margin-top: 40px;
    }
    .footer {
      position: fixed;
      bottom: 1cm;
      left: 2cm;
      right: 2cm;
      text-align: center;
      font-size: 8pt;
      color: #999;
      border-top: 1px solid #ddd;
      padding-top: 10px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">RA Bâtiment</div>
      <div class="logo-subtitle">Artisan Multi-Services BTP</div>
    </div>
    <div class="contact-info">
      ${CONFIG.COMPANY_PHONE}<br>
      ${CONFIG.COMPANY_EMAIL}<br>
      ${CONFIG.COMPANY_WEBSITE}
    </div>
  </div>

  <div class="destinataire">
    <strong>${lead.nom}</strong><br>
    ${lead.adresse}<br>
    ${lead.codePostal} ${lead.ville}
  </div>

  <div class="date">
    Bobigny, le ${today}
  </div>

  <div class="objet">
    Objet : Votre projet de travaux
  </div>

  <div class="corps">
    <p>Madame, Monsieur,</p>

    <p>
      Nous avons constaté que vous avez un <strong>projet de travaux en cours</strong>
      au ${lead.adresse}, ${lead.codePostal} ${lead.ville}.
    </p>

    <p>
      <strong>RA Bâtiment</strong>, entreprise de rénovation générale basée en Île-de-France,
      serait ravie de vous accompagner dans la réalisation de votre projet.
    </p>

    <p>Notre équipe d'artisans qualifiés intervient sur :</p>

    <ul class="services">
      <li>✓ Maçonnerie et gros œuvre</li>
      <li>✓ Rénovation intérieure complète</li>
      <li>✓ Plomberie et électricité</li>
      <li>✓ Carrelage, peinture et finitions</li>
      <li>✓ Aménagements extérieurs</li>
    </ul>

    <p>
      Nous vous proposons un <strong>devis gratuit et sans engagement</strong>,
      établi après une visite technique à votre convenance.
    </p>

    <p>
      N'hésitez pas à nous contacter au <strong>${CONFIG.COMPANY_PHONE}</strong>
      ou par email à <strong>${CONFIG.COMPANY_EMAIL}</strong>.
    </p>

    <p>
      Vous pouvez également découvrir nos réalisations sur notre site :
      <strong>${CONFIG.COMPANY_WEBSITE}</strong>
    </p>
  </div>

  <div class="signature">
    <p>Dans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur,
    l'expression de mes salutations distinguées.</p>

    <p style="margin-top: 30px;">
      <strong>Radi</strong><br>
      Gérant - RA Bâtiment
    </p>
  </div>

  <div class="footer">
    RA Bâtiment - ${CONFIG.COMPANY_ADDRESS} - SIRET 933 728 610 00017<br>
    Garantie décennale - Assurance RC Pro
  </div>
</body>
</html>
  `;
}

/**
 * Template courrier pour leads DVF (achat récent)
 */
function generateCourrierDVF(lead) {
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { margin: 2cm; size: A4; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #333;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 24pt;
      font-weight: bold;
      color: #1a365d;
    }
    .logo-subtitle {
      font-size: 10pt;
      color: #666;
    }
    .contact-info {
      text-align: right;
      font-size: 9pt;
      color: #666;
    }
    .destinataire {
      margin: 40px 0;
      margin-left: 50%;
    }
    .date {
      text-align: right;
      margin-bottom: 30px;
    }
    .objet {
      font-weight: bold;
      margin-bottom: 20px;
    }
    .corps {
      text-align: justify;
    }
    .encadre {
      background: #f7fafc;
      border-left: 4px solid #1a365d;
      padding: 15px;
      margin: 20px 0;
    }
    .services {
      margin: 20px 0;
      padding-left: 20px;
    }
    .services li {
      margin: 8px 0;
    }
    .signature {
      margin-top: 40px;
    }
    .footer {
      position: fixed;
      bottom: 1cm;
      left: 2cm;
      right: 2cm;
      text-align: center;
      font-size: 8pt;
      color: #999;
      border-top: 1px solid #ddd;
      padding-top: 10px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">RA Bâtiment</div>
      <div class="logo-subtitle">Artisan Multi-Services BTP</div>
    </div>
    <div class="contact-info">
      ${CONFIG.COMPANY_PHONE}<br>
      ${CONFIG.COMPANY_EMAIL}<br>
      ${CONFIG.COMPANY_WEBSITE}
    </div>
  </div>

  <div class="destinataire">
    <strong>${lead.nom}</strong><br>
    ${lead.adresse}<br>
    ${lead.codePostal} ${lead.ville}
  </div>

  <div class="date">
    Bobigny, le ${today}
  </div>

  <div class="objet">
    Objet : Bienvenue dans votre nouveau bien !
  </div>

  <div class="corps">
    <p>Madame, Monsieur,</p>

    <p>
      Toutes nos <strong>félicitations</strong> pour l'acquisition de votre bien immobilier
      situé au ${lead.adresse} !
    </p>

    <p>
      L'achat d'une maison est souvent le moment idéal pour envisager des travaux
      de rénovation ou d'aménagement. C'est pourquoi nous nous permettons de
      vous présenter nos services.
    </p>

    <div class="encadre">
      <strong>RA Bâtiment</strong> est une entreprise de rénovation générale
      qui accompagne les propriétaires d'Île-de-France depuis plus de 15 ans.
    </div>

    <p>Nos domaines d'intervention :</p>

    <ul class="services">
      <li>✓ Rénovation de cuisine et salle de bain</li>
      <li>✓ Mise aux normes électrique et plomberie</li>
      <li>✓ Peinture et revêtements de sols</li>
      <li>✓ Aménagement de combles</li>
      <li>✓ Extension et maçonnerie</li>
      <li>✓ Terrasse et aménagements extérieurs</li>
    </ul>

    <p>
      Nous serions ravis de vous rencontrer pour discuter de vos projets et vous
      proposer un <strong>devis gratuit et personnalisé</strong>.
    </p>

    <p>
      Contactez-nous au <strong>${CONFIG.COMPANY_PHONE}</strong> ou sur
      <strong>${CONFIG.COMPANY_WEBSITE}</strong> pour découvrir nos réalisations.
    </p>
  </div>

  <div class="signature">
    <p>En vous souhaitant une excellente installation dans votre nouveau chez-vous.</p>

    <p style="margin-top: 30px;">
      Bien cordialement,<br><br>
      <strong>Radi</strong><br>
      Gérant - RA Bâtiment
    </p>
  </div>

  <div class="footer">
    RA Bâtiment - ${CONFIG.COMPANY_ADDRESS} - SIRET 933 728 610 00017<br>
    Garantie décennale - Assurance RC Pro
  </div>
</body>
</html>
  `;
}

/**
 * Template courrier générique
 */
function generateCourrierGenerique(lead) {
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { margin: 2cm; size: A4; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #333;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 24pt;
      font-weight: bold;
      color: #1a365d;
    }
    .logo-subtitle {
      font-size: 10pt;
      color: #666;
    }
    .contact-info {
      text-align: right;
      font-size: 9pt;
      color: #666;
    }
    .destinataire {
      margin: 40px 0;
      margin-left: 50%;
    }
    .date {
      text-align: right;
      margin-bottom: 30px;
    }
    .objet {
      font-weight: bold;
      margin-bottom: 20px;
    }
    .corps {
      text-align: justify;
    }
    .services {
      margin: 20px 0;
      padding-left: 20px;
    }
    .services li {
      margin: 8px 0;
    }
    .signature {
      margin-top: 40px;
    }
    .footer {
      position: fixed;
      bottom: 1cm;
      left: 2cm;
      right: 2cm;
      text-align: center;
      font-size: 8pt;
      color: #999;
      border-top: 1px solid #ddd;
      padding-top: 10px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">RA Bâtiment</div>
      <div class="logo-subtitle">Artisan Multi-Services BTP</div>
    </div>
    <div class="contact-info">
      ${CONFIG.COMPANY_PHONE}<br>
      ${CONFIG.COMPANY_EMAIL}<br>
      ${CONFIG.COMPANY_WEBSITE}
    </div>
  </div>

  <div class="destinataire">
    <strong>${lead.nom}</strong><br>
    ${lead.adresse}<br>
    ${lead.codePostal} ${lead.ville}
  </div>

  <div class="date">
    Bobigny, le ${today}
  </div>

  <div class="objet">
    Objet : Vos projets de travaux
  </div>

  <div class="corps">
    <p>Madame, Monsieur,</p>

    <p>
      Vous avez un projet de rénovation, d'aménagement ou de construction ?
      <strong>RA Bâtiment</strong> est là pour vous accompagner.
    </p>

    <p>
      Entreprise de rénovation générale basée en Île-de-France, nous intervenons
      sur tous types de travaux, du plus simple au plus complexe.
    </p>

    <p>Nos prestations :</p>

    <ul class="services">
      <li>✓ Rénovation intérieure (cuisine, salle de bain, sols)</li>
      <li>✓ Maçonnerie et gros œuvre</li>
      <li>✓ Plomberie et électricité</li>
      <li>✓ Peinture et finitions</li>
      <li>✓ Carrelage et revêtements</li>
      <li>✓ Aménagements extérieurs</li>
    </ul>

    <p>
      Nous vous proposons un <strong>devis gratuit et sans engagement</strong>,
      établi après une visite à votre convenance.
    </p>

    <p>
      Pour nous contacter :<br>
      📞 <strong>${CONFIG.COMPANY_PHONE}</strong><br>
      📧 <strong>${CONFIG.COMPANY_EMAIL}</strong><br>
      🌐 <strong>${CONFIG.COMPANY_WEBSITE}</strong>
    </p>
  </div>

  <div class="signature">
    <p>Dans l'attente de votre retour, recevez nos salutations les meilleures.</p>

    <p style="margin-top: 30px;">
      <strong>Radi</strong><br>
      Gérant - RA Bâtiment
    </p>
  </div>

  <div class="footer">
    RA Bâtiment - ${CONFIG.COMPANY_ADDRESS} - SIRET 933 728 610 00017<br>
    Garantie décennale - Assurance RC Pro
  </div>
</body>
</html>
  `;
}

/**
 * Récupère ou crée un dossier dans Google Drive
 */
function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);

  if (folders.hasNext()) {
    return folders.next();
  }

  return DriveApp.createFolder(folderName);
}

/**
 * Prépare un email B2B pour le lead sélectionné
 */
function preparerEmailB2B() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const ui = SpreadsheetApp.getUi();

  // Vérifier qu'on est sur l'onglet B2B
  if (sheet.getName() !== CONFIG.SHEET_B2B) {
    ui.alert(
      '⚠️ Mauvais onglet',
      'Sélectionnez une ligne dans l\'onglet "Leads B2B" puis relancez.',
      ui.ButtonSet.OK
    );
    return;
  }

  // Récupérer la ligne sélectionnée
  const selection = sheet.getActiveRange();
  const row = selection.getRow();

  if (row <= 1) {
    ui.alert('⚠️ Sélection invalide', 'Sélectionnez une ligne de données.', ui.ButtonSet.OK);
    return;
  }

  const rowData = sheet.getRange(row, 1, 1, 12).getValues()[0];

  const lead = {
    entreprise: rowData[2],
    contact: rowData[3],
    email: rowData[4],
    type: rowData[6],
    statut: rowData[8]
  };

  if (!lead.email) {
    ui.alert('❌ Email manquant', 'Ce lead n\'a pas d\'email renseigné.', ui.ButtonSet.OK);
    return;
  }

  // Déterminer le template selon le statut
  let template;
  if (lead.statut === 'Nouveau') {
    template = getEmailTemplateSyndicInitial(lead);
  } else {
    template = getEmailTemplateRelance(lead);
  }

  // Afficher le template dans une fenêtre
  const html = HtmlService.createHtmlOutput(`
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      h3 { color: #1a365d; margin-bottom: 10px; }
      .field { margin-bottom: 15px; }
      .label { font-weight: bold; color: #666; }
      .value { background: #f7fafc; padding: 10px; border-radius: 5px; margin-top: 5px; }
      textarea { width: 100%; height: 200px; font-family: inherit; }
      button {
        background: #1a365d;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 15px;
      }
      button:hover { background: #2c5282; }
    </style>

    <h3>📧 Email à envoyer</h3>

    <div class="field">
      <div class="label">Destinataire :</div>
      <div class="value">${lead.email}</div>
    </div>

    <div class="field">
      <div class="label">Objet :</div>
      <div class="value">${template.subject}</div>
    </div>

    <div class="field">
      <div class="label">Corps du message :</div>
      <textarea id="body" readonly>${template.body}</textarea>
    </div>

    <button onclick="copyAndOpen()">📋 Copier et ouvrir Gmail</button>

    <script>
      function copyAndOpen() {
        const body = document.getElementById('body').value;
        navigator.clipboard.writeText(body).then(() => {
          const mailto = 'mailto:${lead.email}?subject=' +
            encodeURIComponent('${template.subject}');
          window.open(mailto);
          google.script.host.close();
        });
      }
    </script>
  `).setWidth(600).setHeight(550);

  ui.showModalDialog(html, 'Préparer Email B2B');
}

/**
 * Template email initial pour syndic
 */
function getEmailTemplateSyndicInitial(lead) {
  return {
    subject: `Partenariat artisan pour vos copropriétés - RA Bâtiment`,
    body: `Bonjour${lead.contact ? ' ' + lead.contact : ''},

Je suis Radi, gérant de RA Bâtiment, entreprise de rénovation générale basée en Île-de-France (93).

Nous intervenons régulièrement auprès de syndics et copropriétés sur :
• Ravalement de façades
• Réfection de parties communes
• Travaux de plomberie et électricité
• Mise aux normes et rénovation

Seriez-vous ouvert à un échange de 10 minutes pour voir si nous pouvons collaborer ?

Bien cordialement,

Radi
RA Bâtiment
📞 ${CONFIG.COMPANY_PHONE}
🌐 ${CONFIG.COMPANY_WEBSITE}`
  };
}

/**
 * Template email de relance
 */
function getEmailTemplateRelance(lead) {
  return {
    subject: `Re: Partenariat RA Bâtiment - Relance`,
    body: `Bonjour${lead.contact ? ' ' + lead.contact : ''},

Je me permets de revenir vers vous suite à mon précédent message.

Nous serions ravis de vous présenter nos services lors d'un court échange téléphonique.

Êtes-vous disponible cette semaine pour un appel de 10 minutes ?

Bien cordialement,

Radi
RA Bâtiment
📞 ${CONFIG.COMPANY_PHONE}`
  };
}
