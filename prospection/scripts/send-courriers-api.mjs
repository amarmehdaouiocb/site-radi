/**
 * Envoi automatisé de courriers via l'API Merci Facteur
 * https://www.merci-facteur.com/api/1.2/doc.php
 *
 * CONFIGURATION REQUISE :
 * 1. Créer un compte pro sur https://www.merci-facteur.com/pro/
 * 2. Obtenir ta clé API (secret key) dans ton espace pro
 * 3. Créer un fichier .env avec :
 *    MERCI_FACTEUR_API_KEY=ta_cle_secrete
 *    MERCI_FACTEUR_API_URL=https://www.merci-facteur.com/api/1.2
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Configuration
const CONFIG = {
  apiUrl: process.env.MERCI_FACTEUR_API_URL || 'https://www.merci-facteur.com/api/1.2',
  apiKey: process.env.MERCI_FACTEUR_API_KEY || '',

  // Expéditeur (RA Bâtiment)
  expediteur: {
    civilite: 'Société',
    nom: 'RA Bâtiment',
    prenom: '',
    adresse1: '5 rue de la Gaîté',
    adresse2: '',
    adresse3: '',
    cp: '93000',
    ville: 'Bobigny',
    pays: 'France'
  },

  // ═══════════════════════════════════════════════════════════════
  // ENVELOPPE PERSONNALISÉE
  // ═══════════════════════════════════════════════════════════════
  // 1. Connecte-toi à https://www.merci-facteur.com/pro/
  // 2. Va dans "Your branding" (menu en haut à droite)
  // 3. Crée ton enveloppe avec le logo RA Bâtiment
  // 4. Copie l'ID du template et colle-le ci-dessous
  // ═══════════════════════════════════════════════════════════════
  enveloppeTemplateId: process.env.MERCI_FACTEUR_ENVELOPE_ID || null, // Ex: '123456'

  // ═══════════════════════════════════════════════════════════════
  // OPTIONS D'IMPRESSION
  // ═══════════════════════════════════════════════════════════════
  impression: {
    format: 'recto',      // 'recto' | 'rectoverso' | 'distinctrectoverso'
    // Couleur : automatique selon le PDF (ton PDF doré = impression couleur)
    // Papier : blanc premium 80g/m² (non modifiable)
  },

  // Mode d'envoi : 'normal' (lettre verte J+3), 'suivi' (J+2), 'lrar' (recommandé AR)
  modeEnvoi: 'normal',

  // Dossier des courriers à envoyer
  courriersDir: 'prospection/courriers-pdf/SCORE-100',

  // Fichier des leads pour récupérer les adresses
  leadsFile: 'prospection/data/leads-top-priorite.tsv',

  // Limite de courriers à envoyer (pour test)
  limite: null, // null = tous, ou un nombre pour limiter

  // Mode simulation (true = pas d'envoi réel)
  dryRun: true
};

// Générer le token d'authentification
async function getToken(apiKey) {
  const hash = crypto.createHash('sha256').update(apiKey).digest('hex');

  const response = await fetch(`${CONFIG.apiUrl}/getToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hash })
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(`Erreur authentification: ${data.error}`);
  }

  return data.token;
}

// Charger les leads depuis le TSV
function loadLeads() {
  const content = fs.readFileSync(CONFIG.leadsFile, 'utf-8');
  const lines = content.split('\n');
  const leads = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = lines[i].split('\t');
    const score = parseInt(values[17]);

    // Uniquement les scores 100
    if (score !== 100) continue;

    leads.push({
      id: values[0],
      adresse: values[4],
      codePostal: values[5],
      ville: values[6],
      departement: values[7],
      score
    });
  }

  return leads;
}

// Construire le chemin du PDF
function getPdfPath(lead) {
  const idPadded = lead.id.padStart(4, '0');
  const villeClean = lead.ville
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);

  return path.join(CONFIG.courriersDir, lead.departement, `${idPadded}-${villeClean}.pdf`);
}

// Envoyer un courrier
async function sendCourrier(token, lead, pdfPath) {
  // Lire le PDF et le convertir en base64
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfBase64 = pdfBuffer.toString('base64');

  const payload = {
    token,
    content: {
      letter: {
        objects: [
          {
            type: 'file',
            value: `data:application/pdf;base64,${pdfBase64}`,
            format: CONFIG.impression.format
          }
        ]
      }
    },
    adress: {
      // Expéditeur
      exp: CONFIG.expediteur,
      // Destinataire
      dest: [{
        civilite: '',
        nom: 'Propriétaire',
        prenom: '',
        adresse1: lead.adresse,
        adresse2: '',
        adresse3: '',
        cp: lead.codePostal,
        ville: lead.ville,
        pays: 'France'
      }]
    },
    mode_envoi: CONFIG.modeEnvoi
  };

  // Ajouter l'enveloppe personnalisée si configurée
  if (CONFIG.enveloppeTemplateId) {
    payload.enveloppe = {
      type: 'template',
      value: CONFIG.enveloppeTemplateId
    };
  }

  if (CONFIG.dryRun) {
    return { success: true, dryRun: true };
  }

  const response = await fetch(`${CONFIG.apiUrl}/sendCourrier`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return await response.json();
}

// Fonction principale
async function main() {
  console.log('📬 Envoi de courriers via Merci Facteur API\n');

  // Vérifier la clé API
  if (!CONFIG.apiKey && !CONFIG.dryRun) {
    console.error('❌ Clé API manquante !');
    console.log('\n📋 Configuration requise :');
    console.log('   1. Créer un compte pro sur https://www.merci-facteur.com/pro/');
    console.log('   2. Obtenir ta clé API dans ton espace pro');
    console.log('   3. Exporter la variable : export MERCI_FACTEUR_API_KEY=ta_cle');
    console.log('\n   Ou lancer en mode simulation : node send-courriers-api.mjs --dry-run');
    process.exit(1);
  }

  // Afficher la configuration
  console.log('📋 Configuration :');
  console.log(`   • Mode d'envoi : ${CONFIG.modeEnvoi === 'normal' ? 'Lettre verte (J+3)' : CONFIG.modeEnvoi === 'suivi' ? 'Lettre suivie (J+2)' : 'Recommandé AR'}`);
  console.log(`   • Impression : ${CONFIG.impression.format}`);
  console.log(`   • Enveloppe : ${CONFIG.enveloppeTemplateId ? `Personnalisée (ID: ${CONFIG.enveloppeTemplateId})` : 'Standard blanche'}`);
  console.log('');

  // Charger les leads
  const leads = loadLeads();
  console.log(`📊 ${leads.length} leads score 100 trouvés\n`);

  // Appliquer la limite si définie
  const leadsToSend = CONFIG.limite ? leads.slice(0, CONFIG.limite) : leads;
  console.log(`📤 ${leadsToSend.length} courriers à envoyer\n`);

  if (CONFIG.dryRun) {
    console.log('⚠️  MODE SIMULATION (--dry-run) - Aucun envoi réel\n');
  }

  // Obtenir le token (sauf en dry-run)
  let token = null;
  if (!CONFIG.dryRun) {
    console.log('🔐 Authentification...');
    token = await getToken(CONFIG.apiKey);
    console.log('✅ Token obtenu\n');
  }

  // Statistiques
  const stats = { sent: 0, errors: 0, missing: 0 };
  const errors = [];

  // Envoyer les courriers
  for (const lead of leadsToSend) {
    const pdfPath = getPdfPath(lead);

    // Vérifier que le PDF existe
    if (!fs.existsSync(pdfPath)) {
      console.log(`   ⚠️  PDF non trouvé: ${pdfPath}`);
      stats.missing++;
      continue;
    }

    try {
      const result = await sendCourrier(token, lead, pdfPath);

      if (result.error) {
        console.log(`   ❌ ${lead.id} - ${lead.ville}: ${result.error}`);
        errors.push({ lead, error: result.error });
        stats.errors++;
      } else {
        const status = CONFIG.dryRun ? '🔹 [SIMULATION]' : '✅';
        console.log(`   ${status} ${lead.id} - ${lead.adresse}, ${lead.ville}`);
        stats.sent++;
      }

      // Pause entre les envois (éviter le rate limiting)
      if (!CONFIG.dryRun) {
        await new Promise(r => setTimeout(r, 500));
      }

    } catch (err) {
      console.log(`   ❌ ${lead.id} - ${lead.ville}: ${err.message}`);
      errors.push({ lead, error: err.message });
      stats.errors++;
    }
  }

  // Résumé
  console.log('\n' + '='.repeat(50));
  console.log('📊 RÉSUMÉ');
  console.log('='.repeat(50));
  console.log(`   ✅ Envoyés : ${stats.sent}`);
  console.log(`   ❌ Erreurs : ${stats.errors}`);
  console.log(`   ⚠️  PDFs manquants : ${stats.missing}`);

  if (CONFIG.dryRun) {
    console.log('\n⚠️  Mode simulation - Pour envoyer réellement :');
    console.log('   1. Configurer MERCI_FACTEUR_API_KEY');
    console.log('   2. Modifier dryRun: false dans le script');
    console.log('   3. Relancer le script');
  }

  // Estimation des coûts
  const coutLettre = 1.49; // Lettre verte estimée
  console.log(`\n💰 Coût estimé : ${(stats.sent * coutLettre).toFixed(2)}€ (${stats.sent} × ${coutLettre}€)`);

  // Sauvegarder les erreurs
  if (errors.length > 0) {
    fs.writeFileSync(
      'prospection/data/envoi-erreurs.json',
      JSON.stringify(errors, null, 2),
      'utf-8'
    );
    console.log('\n📁 Erreurs sauvegardées dans : prospection/data/envoi-erreurs.json');
  }
}

// Gérer les arguments
if (process.argv.includes('--dry-run')) {
  CONFIG.dryRun = true;
}

if (process.argv.includes('--send')) {
  CONFIG.dryRun = false;
}

// Limite personnalisée (ex: --limit=10)
const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
if (limitArg) {
  CONFIG.limite = parseInt(limitArg.split('=')[1]);
}

main().catch(console.error);
