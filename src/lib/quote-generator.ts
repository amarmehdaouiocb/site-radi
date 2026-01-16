/**
 * Générateur de devis Word pour RA Bâtiment
 * Utilise la librairie docx pour créer des documents .docx
 */

import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
  BorderStyle,
  WidthType,
  VerticalAlign,
  TableLayoutType,
  convertInchesToTwip,
  PageOrientation,
} from "docx";
import { SITE_CONFIG, SERVICES, ROOM_OPTIONS } from "./constants";

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

  // Ajouter des lignes vides supplémentaires pour compléter manuellement
  while (items.length < 8) {
    items.push({ description: "" });
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
// STYLES CONSTANTS
// ============================================================================

const COLORS = {
  gold: "D4AF37",
  goldDark: "B8972E",
  black: "1A1A1A",
  gray: "666666",
  lightGray: "E0E0E0",
  white: "FFFFFF",
};

const FONT = {
  title: "Cambria",
  body: "Calibri",
};

// ============================================================================
// DOCUMENT BUILDING FUNCTIONS
// ============================================================================

function buildHeader(quoteNumber: string, date: string): Paragraph[] {
  return [
    // Nom de l'entreprise
    new Paragraph({
      children: [
        new TextRun({
          text: SITE_CONFIG.name,
          bold: true,
          size: 36,
          font: FONT.title,
          color: COLORS.black,
        }),
      ],
      spacing: { after: 100 },
    }),
    // Tagline
    new Paragraph({
      children: [
        new TextRun({
          text: "Excellence & Prestige",
          italics: true,
          size: 20,
          font: FONT.body,
          color: COLORS.gold,
        }),
      ],
      spacing: { after: 200 },
    }),
    // Coordonnées
    new Paragraph({
      children: [
        new TextRun({
          text: `${SITE_CONFIG.address} | Tél : ${SITE_CONFIG.phone}`,
          size: 18,
          font: FONT.body,
          color: COLORS.gray,
        }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Email : ${SITE_CONFIG.email} | SIRET : ${SITE_CONFIG.siret}`,
          size: 18,
          font: FONT.body,
          color: COLORS.gray,
        }),
      ],
      spacing: { after: 400 },
    }),
    // Titre DEVIS
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: "DEVIS",
          bold: true,
          size: 48,
          font: FONT.title,
          color: COLORS.gold,
        }),
      ],
      spacing: { after: 100 },
    }),
    // Numéro et date
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: `N° ${quoteNumber}`,
          bold: true,
          size: 20,
          font: FONT.body,
          color: COLORS.black,
        }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: `Date : ${date}`,
          size: 20,
          font: FONT.body,
          color: COLORS.gray,
        }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: "Validité : 30 jours",
          size: 20,
          font: FONT.body,
          color: COLORS.gray,
        }),
      ],
      spacing: { after: 400 },
    }),
  ];
}

function buildClientSection(data: QuoteDocumentData): (Paragraph | Table)[] {
  const borderStyle = {
    style: BorderStyle.SINGLE,
    size: 1,
    color: COLORS.lightGray,
  };

  const clientTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [
      // Header row
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { fill: COLORS.gold },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "ÉMETTEUR",
                    bold: true,
                    size: 18,
                    font: FONT.body,
                    color: COLORS.white,
                  }),
                ],
                spacing: { before: 100, after: 100 },
              }),
            ],
            borders: {
              top: borderStyle,
              bottom: borderStyle,
              left: borderStyle,
              right: borderStyle,
            },
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { fill: COLORS.gold },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "CLIENT",
                    bold: true,
                    size: 18,
                    font: FONT.body,
                    color: COLORS.white,
                  }),
                ],
                spacing: { before: 100, after: 100 },
              }),
            ],
            borders: {
              top: borderStyle,
              bottom: borderStyle,
              left: borderStyle,
              right: borderStyle,
            },
          }),
        ],
      }),
      // Content row
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: SITE_CONFIG.name,
                    bold: true,
                    size: 20,
                    font: FONT.body,
                  }),
                ],
                spacing: { before: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: SITE_CONFIG.address,
                    size: 18,
                    font: FONT.body,
                    color: COLORS.gray,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Tél : ${SITE_CONFIG.phone}`,
                    size: 18,
                    font: FONT.body,
                    color: COLORS.gray,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `SIRET : ${SITE_CONFIG.siret}`,
                    size: 18,
                    font: FONT.body,
                    color: COLORS.gray,
                  }),
                ],
                spacing: { after: 100 },
              }),
            ],
            borders: {
              top: borderStyle,
              bottom: borderStyle,
              left: borderStyle,
              right: borderStyle,
            },
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: data.clientName || "[Nom du client]",
                    bold: true,
                    size: 20,
                    font: FONT.body,
                  }),
                ],
                spacing: { before: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: data.clientCity || "[Ville]",
                    size: 18,
                    font: FONT.body,
                    color: data.clientCity ? COLORS.black : COLORS.gray,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: data.clientPhone
                      ? `Tél : ${data.clientPhone}`
                      : "[Téléphone]",
                    size: 18,
                    font: FONT.body,
                    color: data.clientPhone ? COLORS.black : COLORS.gray,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: data.clientEmail
                      ? `Email : ${data.clientEmail}`
                      : "[Email]",
                    size: 18,
                    font: FONT.body,
                    color: data.clientEmail ? COLORS.black : COLORS.gray,
                  }),
                ],
                spacing: { after: 100 },
              }),
            ],
            borders: {
              top: borderStyle,
              bottom: borderStyle,
              left: borderStyle,
              right: borderStyle,
            },
          }),
        ],
      }),
    ],
  });

  return [
    clientTable,
    new Paragraph({ spacing: { after: 300 } }),
  ];
}

function buildObjectSection(projectDescription: string): Paragraph[] {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: "OBJET DU DEVIS",
          bold: true,
          size: 22,
          font: FONT.title,
          color: COLORS.goldDark,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: projectDescription,
          size: 20,
          font: FONT.body,
        }),
      ],
      spacing: { after: 300 },
    }),
  ];
}

function buildItemsTable(lineItems: Array<{ description: string }>): Table {
  const borderStyle = {
    style: BorderStyle.SINGLE,
    size: 1,
    color: COLORS.lightGray,
  };

  const headerRow = new TableRow({
    children: [
      new TableCell({
        width: { size: 40, type: WidthType.PERCENTAGE },
        shading: { fill: COLORS.gold },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Description",
                bold: true,
                size: 18,
                font: FONT.body,
                color: COLORS.white,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 80 },
          }),
        ],
        borders: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
      }),
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: { fill: COLORS.gold },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Qté",
                bold: true,
                size: 18,
                font: FONT.body,
                color: COLORS.white,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 80 },
          }),
        ],
        borders: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
      }),
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: { fill: COLORS.gold },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Unité",
                bold: true,
                size: 18,
                font: FONT.body,
                color: COLORS.white,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 80 },
          }),
        ],
        borders: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
      }),
      new TableCell({
        width: { size: 15, type: WidthType.PERCENTAGE },
        shading: { fill: COLORS.gold },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "P.U. HT",
                bold: true,
                size: 18,
                font: FONT.body,
                color: COLORS.white,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 80 },
          }),
        ],
        borders: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
      }),
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: { fill: COLORS.gold },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "TVA",
                bold: true,
                size: 18,
                font: FONT.body,
                color: COLORS.white,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 80 },
          }),
        ],
        borders: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
      }),
      new TableCell({
        width: { size: 15, type: WidthType.PERCENTAGE },
        shading: { fill: COLORS.gold },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Total HT",
                bold: true,
                size: 18,
                font: FONT.body,
                color: COLORS.white,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 80 },
          }),
        ],
        borders: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
      }),
    ],
  });

  const dataRows = lineItems.map(
    (item, index) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            shading: { fill: index % 2 === 0 ? COLORS.white : "FAFAFA" },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: item.description || "",
                    size: 18,
                    font: FONT.body,
                    color: item.description ? COLORS.black : COLORS.gray,
                  }),
                ],
                spacing: { before: 60, after: 60 },
              }),
            ],
            borders: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
          }),
          new TableCell({
            width: { size: 10, type: WidthType.PERCENTAGE },
            shading: { fill: index % 2 === 0 ? COLORS.white : "FAFAFA" },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "", size: 18, font: FONT.body })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 60, after: 60 },
              }),
            ],
            borders: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
          }),
          new TableCell({
            width: { size: 10, type: WidthType.PERCENTAGE },
            shading: { fill: index % 2 === 0 ? COLORS.white : "FAFAFA" },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "", size: 18, font: FONT.body })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 60, after: 60 },
              }),
            ],
            borders: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            shading: { fill: index % 2 === 0 ? COLORS.white : "FAFAFA" },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "", size: 18, font: FONT.body })],
                alignment: AlignmentType.RIGHT,
                spacing: { before: 60, after: 60 },
              }),
            ],
            borders: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
          }),
          new TableCell({
            width: { size: 10, type: WidthType.PERCENTAGE },
            shading: { fill: index % 2 === 0 ? COLORS.white : "FAFAFA" },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "", size: 18, font: FONT.body })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 60, after: 60 },
              }),
            ],
            borders: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            shading: { fill: index % 2 === 0 ? COLORS.white : "FAFAFA" },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "", size: 18, font: FONT.body })],
                alignment: AlignmentType.RIGHT,
                spacing: { before: 60, after: 60 },
              }),
            ],
            borders: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
          }),
        ],
      })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [headerRow, ...dataRows],
  });
}

function buildTotalsSection(): Paragraph[] {
  return [
    new Paragraph({ spacing: { after: 200 } }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: "Total HT : _________________ €",
          size: 20,
          font: FONT.body,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: "TVA 10% (travaux) : _________________ €",
          size: 20,
          font: FONT.body,
          color: COLORS.gray,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: "TVA 20% (fournitures) : _________________ €",
          size: 20,
          font: FONT.body,
          color: COLORS.gray,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: "TOTAL TTC : _________________ €",
          bold: true,
          size: 24,
          font: FONT.title,
          color: COLORS.goldDark,
        }),
      ],
      spacing: { after: 400 },
    }),
  ];
}

function buildConditions(): Paragraph[] {
  const conditions = [
    "Validité du devis : 30 jours à compter de la date d'émission",
    "Acompte à la commande : 30% du montant TTC",
    "Solde à la réception des travaux",
    "Délai d'exécution : à définir selon planning",
    "TVA applicable : 10% sur les travaux de rénovation (logement > 2 ans), 20% sur les fournitures",
    "Garantie décennale incluse pour les travaux de gros œuvre",
  ];

  return [
    new Paragraph({
      children: [
        new TextRun({
          text: "CONDITIONS",
          bold: true,
          size: 22,
          font: FONT.title,
          color: COLORS.goldDark,
        }),
      ],
      spacing: { after: 100 },
    }),
    ...conditions.map(
      (condition) =>
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${condition}`,
              size: 18,
              font: FONT.body,
              color: COLORS.gray,
            }),
          ],
          spacing: { after: 50 },
        })
    ),
    new Paragraph({ spacing: { after: 300 } }),
  ];
}

function buildSignatures(): Paragraph[] {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: "SIGNATURES",
          bold: true,
          size: 22,
          font: FONT.title,
          color: COLORS.goldDark,
        }),
      ],
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `${SITE_CONFIG.name}                                                                          Bon pour accord - Client`,
          size: 18,
          font: FONT.body,
          bold: true,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Signature et cachet                                                                    Date et signature précédée de la mention",
          size: 16,
          font: FONT.body,
          color: COLORS.gray,
          italics: true,
        }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "                                                                                                      \"Bon pour accord\"",
          size: 16,
          font: FONT.body,
          color: COLORS.gray,
          italics: true,
        }),
      ],
      spacing: { after: 400 },
    }),
  ];
}

function buildFooter(): Paragraph[] {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `${SITE_CONFIG.name} — SIRET : ${SITE_CONFIG.siret}`,
          size: 16,
          font: FONT.body,
          color: COLORS.gray,
        }),
      ],
      spacing: { before: 200 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `${SITE_CONFIG.address} — Tél : ${SITE_CONFIG.phone} — Email : ${SITE_CONFIG.email}`,
          size: 16,
          font: FONT.body,
          color: COLORS.gray,
        }),
      ],
    }),
  ];
}

// ============================================================================
// MAIN GENERATOR FUNCTION
// ============================================================================

export async function generateQuoteDocument(
  data: QuoteDocumentData
): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.6),
              bottom: convertInchesToTwip(0.6),
              left: convertInchesToTwip(0.6),
              right: convertInchesToTwip(0.6),
            },
          },
        },
        children: [
          ...buildHeader(data.quoteNumber, data.date),
          ...buildClientSection(data),
          ...buildObjectSection(data.projectDescription),
          buildItemsTable(data.lineItems),
          ...buildTotalsSection(),
          ...buildConditions(),
          ...buildSignatures(),
          ...buildFooter(),
        ],
      },
    ],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}
