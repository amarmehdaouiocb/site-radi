/**
 * Générateur de devis Word pour RA Bâtiment
 * Utilise le template existant et remplace les placeholders
 */

import { promises as fs } from "fs";
import path from "path";
import JSZip from "jszip";
import { SERVICES, ROOM_OPTIONS } from "./constants";

// ============================================================================
// TYPES
// ============================================================================

export interface QuoteDocumentData {
  quoteNumber: string;
  date: string;
  clientName: string;
  clientCity?: string;
  clientPhone?: string;
  clientEmail?: string;
  projectDescription: string;
  lineItems: Array<{ description: string }>;
  surface?: string;
  budget?: string;
  timeline?: string;
}

export interface QuoteFormData {
  services: string[];
  selectedFeatures: Record<string, string[]>;
  selectedRooms: Record<string, string[]>;
  surface?: string;
  budget?: string;
  timeline?: string;
  city?: string;
  name: string;
  phone?: string;
  email?: string;
  message?: string;
}

// ============================================================================
// HELPERS
// ============================================================================

/** Génère un numéro de devis unique */
export function generateQuoteNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DEV-${year}-${random}`;
}

/** Récupère le titre d'un service par son ID */
function getServiceTitle(serviceId: string): string {
  const service = SERVICES.find((s) => s.id === serviceId);
  return service?.title || serviceId;
}

/** Récupère le label d'une pièce par sa valeur */
function getRoomLabel(roomValue: string): string {
  const room = ROOM_OPTIONS.find((r) => r.value === roomValue);
  return room?.label || roomValue;
}

/** Transforme les données du formulaire en lignes de devis */
export function formDataToLineItems(
  data: QuoteFormData
): Array<{ description: string }> {
  const items: Array<{ description: string }> = [];

  for (const serviceId of data.services) {
    const serviceTitle = getServiceTitle(serviceId);
    const features = data.selectedFeatures[serviceId] || [];
    const rooms = data.selectedRooms?.[serviceId] || [];

    if (features.length === 0) {
      // Service sans features spécifiques
      items.push({ description: `${serviceTitle} - Demande générale` });
    } else {
      // Chaque feature = une ligne
      for (const feature of features) {
        const roomSuffix =
          rooms.length > 0
            ? ` (${rooms.map((r) => getRoomLabel(r)).join(", ")})`
            : "";
        items.push({ description: `${serviceTitle} - ${feature}${roomSuffix}` });
      }
    }
  }

  return items;
}

/** Construit la description du projet à partir des données du formulaire */
export function buildProjectDescription(data: QuoteFormData): string {
  const serviceNames = data.services.map((id) => getServiceTitle(id));
  let description = `Travaux de ${serviceNames.join(", ").toLowerCase()}`;

  if (data.city) {
    description += ` à ${data.city}`;
  }

  if (data.surface) {
    description += ` - Surface estimée : ${data.surface} m²`;
  }

  return description;
}

// ============================================================================
// TEMPLATE MANIPULATION
// ============================================================================

/**
 * Échappe les caractères spéciaux XML
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Remplace un placeholder dans le XML en préservant le style
 * Le placeholder peut être fragmenté sur plusieurs <w:t> elements
 */
function replacePlaceholder(
  xml: string,
  placeholder: string,
  value: string
): string {
  const escapedValue = escapeXml(value);

  // Essayer d'abord un remplacement simple
  if (xml.includes(placeholder)) {
    return xml.replace(new RegExp(escapeRegex(placeholder), "g"), escapedValue);
  }

  return xml;
}

/**
 * Échappe les caractères spéciaux pour RegExp
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Génère une ligne de prestation pour le tableau (copie du format template)
 */
function generatePrestationRow(description: string, isEven: boolean): string {
  const bgColor = isEven ? "FFFFFF" : "FAFAFA";
  const escapedDesc = escapeXml(description);
  const hasContent = description.trim().length > 0;

  // Style pour les cellules avec contenu vs placeholder
  const textColor = hasContent ? "1A1A1A" : "666666";
  const isItalic = !hasContent;
  const rPrStyle = isItalic
    ? `<w:rPr><w:i/><w:iCs/><w:color w:val="${textColor}"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr>`
    : `<w:rPr><w:color w:val="${textColor}"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr>`;

  return `<w:tr><w:tc><w:tcPr><w:tcW w:type="dxa" w:w="4000"/><w:tcBorders><w:top w:val="single" w:color="E0E0E0" w:sz="1"/><w:left w:val="single" w:color="E0E0E0" w:sz="1"/><w:bottom w:val="single" w:color="E0E0E0" w:sz="1"/><w:right w:val="single" w:color="E0E0E0" w:sz="1"/></w:tcBorders><w:shd w:fill="${bgColor}" w:val="clear"/></w:tcPr><w:p><w:r>${rPrStyle}<w:t xml:space="preserve">${escapedDesc || ""}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:type="dxa" w:w="1000"/><w:tcBorders><w:top w:val="single" w:color="E0E0E0" w:sz="1"/><w:left w:val="single" w:color="E0E0E0" w:sz="1"/><w:bottom w:val="single" w:color="E0E0E0" w:sz="1"/><w:right w:val="single" w:color="E0E0E0" w:sz="1"/></w:tcBorders><w:shd w:fill="${bgColor}" w:val="clear"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:color w:val="1A1A1A"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr><w:t xml:space="preserve"></w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:type="dxa" w:w="1000"/><w:tcBorders><w:top w:val="single" w:color="E0E0E0" w:sz="1"/><w:left w:val="single" w:color="E0E0E0" w:sz="1"/><w:bottom w:val="single" w:color="E0E0E0" w:sz="1"/><w:right w:val="single" w:color="E0E0E0" w:sz="1"/></w:tcBorders><w:shd w:fill="${bgColor}" w:val="clear"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:color w:val="1A1A1A"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr><w:t xml:space="preserve"></w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:type="dxa" w:w="1500"/><w:tcBorders><w:top w:val="single" w:color="E0E0E0" w:sz="1"/><w:left w:val="single" w:color="E0E0E0" w:sz="1"/><w:bottom w:val="single" w:color="E0E0E0" w:sz="1"/><w:right w:val="single" w:color="E0E0E0" w:sz="1"/></w:tcBorders><w:shd w:fill="${bgColor}" w:val="clear"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:color w:val="1A1A1A"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr><w:t xml:space="preserve"></w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:type="dxa" w:w="1000"/><w:tcBorders><w:top w:val="single" w:color="E0E0E0" w:sz="1"/><w:left w:val="single" w:color="E0E0E0" w:sz="1"/><w:bottom w:val="single" w:color="E0E0E0" w:sz="1"/><w:right w:val="single" w:color="E0E0E0" w:sz="1"/></w:tcBorders><w:shd w:fill="${bgColor}" w:val="clear"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:color w:val="1A1A1A"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr><w:t xml:space="preserve">10%</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:type="dxa" w:w="1500"/><w:tcBorders><w:top w:val="single" w:color="E0E0E0" w:sz="1"/><w:left w:val="single" w:color="E0E0E0" w:sz="1"/><w:bottom w:val="single" w:color="E0E0E0" w:sz="1"/><w:right w:val="single" w:color="E0E0E0" w:sz="1"/></w:tcBorders><w:shd w:fill="${bgColor}" w:val="clear"/></w:tcPr><w:p><w:pPr><w:jc w:val="right"/></w:pPr><w:r><w:rPr><w:b/><w:bCs/><w:color w:val="1A1A1A"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr><w:t xml:space="preserve"></w:t></w:r></w:p></w:tc></w:tr>`;
}

/**
 * Remplace le tableau des prestations par les lignes dynamiques
 */
function replacePrestationsTable(xml: string, lineItems: Array<{ description: string }>): string {
  // Trouver le début du tableau des prestations (après le header avec DESCRIPTION)
  // Note: [\s\S]*? est équivalent à .*? avec le flag 's' (dotAll)
  const headerPattern = /<w:tr><w:trPr><w:tblHeader\/><\/w:trPr><w:tc>[\s\S]*?DESCRIPTION[\s\S]*?<\/w:tr>/;
  const headerMatch = xml.match(headerPattern);

  if (!headerMatch) {
    console.warn("Could not find prestations table header");
    return xml;
  }

  // Trouver la fin du tableau (6 colonnes avec les prestations)
  // Le tableau se termine avant le tableau des totaux
  const tableStartIndex = xml.indexOf(headerMatch[0]);

  // Chercher toutes les lignes <w:tr> après le header jusqu'au </w:tbl>
  const afterHeader = xml.substring(tableStartIndex + headerMatch[0].length);
  const tableEndMatch = afterHeader.match(/<\/w:tbl>/);

  if (!tableEndMatch) {
    console.warn("Could not find end of prestations table");
    return xml;
  }

  // Générer les nouvelles lignes
  const minRows = 6; // Minimum de lignes à afficher
  const items = [...lineItems];

  // Compléter avec des lignes vides si nécessaire
  while (items.length < minRows) {
    items.push({ description: "" });
  }

  const newRows = items
    .map((item, index) => generatePrestationRow(item.description, index % 2 === 0))
    .join("");

  // Reconstruire le XML
  const beforeTable = xml.substring(0, tableStartIndex + headerMatch[0].length);
  const afterTable = xml.substring(tableStartIndex + headerMatch[0].length + tableEndMatch.index!);

  return beforeTable + newRows + afterTable;
}

// ============================================================================
// MAIN GENERATOR FUNCTION
// ============================================================================

/**
 * Génère un document de devis à partir du template existant
 */
export async function generateQuoteDocument(
  data: QuoteDocumentData
): Promise<Buffer> {
  // Chemin vers le template
  const templatePath = path.join(process.cwd(), "public", "documents", "template-devis.docx");

  // Lire le template
  const templateBuffer = await fs.readFile(templatePath);

  // Ouvrir le ZIP
  const zip = await JSZip.loadAsync(templateBuffer);

  // Lire le document.xml
  const documentXmlFile = zip.file("word/document.xml");
  if (!documentXmlFile) {
    throw new Error("document.xml not found in template");
  }

  let documentXml = await documentXmlFile.async("string");

  // === REMPLACEMENTS DES PLACEHOLDERS ===

  // Numéro de devis
  documentXml = replacePlaceholder(documentXml, "DEV-2025-001", data.quoteNumber);

  // Date
  documentXml = replacePlaceholder(documentXml, "__/__/____", data.date);

  // Infos client
  documentXml = replacePlaceholder(documentXml, "[Nom du client]", data.clientName || "");
  documentXml = replacePlaceholder(documentXml, "[Adresse]", ""); // Pas d'adresse dans le formulaire
  documentXml = replacePlaceholder(documentXml, "[Code postal, Ville]", data.clientCity || "");
  documentXml = replacePlaceholder(documentXml, "[Téléphone]", data.clientPhone || "");
  documentXml = replacePlaceholder(documentXml, "[Email]", data.clientEmail || "");

  // Objet du devis
  documentXml = replacePlaceholder(
    documentXml,
    "[Description détaillée du projet : travaux de rénovation, maçonnerie, plomberie, etc.]",
    data.projectDescription
  );

  // Remplacer le tableau des prestations
  documentXml = replacePrestationsTable(documentXml, data.lineItems);

  // Mettre à jour le document.xml dans le ZIP
  zip.file("word/document.xml", documentXml);

  // Générer le buffer final
  const outputBuffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });

  return outputBuffer;
}
