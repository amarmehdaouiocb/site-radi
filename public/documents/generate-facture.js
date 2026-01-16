const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun, Header, Footer,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign } = require('docx');
const fs = require('fs');
const path = require('path');

// Colors
const GOLD_PRIMARY = "D4AF37";
const GOLD_DARK = "B8972E";
const TEXT_DARK = "1A1A1A";
const TEXT_MUTED = "666666";
const BORDER_COLOR = "E0E0E0";
const BG_LIGHT = "FAFAFA";

// Border style
const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

// Load logo
const logoPath = path.join(__dirname, '..', 'logos', 'ra-batiment', 'png', '232893795.png');
const logoBuffer = fs.readFileSync(logoPath);

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 20 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 48, bold: true, color: GOLD_PRIMARY, font: "Georgia" },
        paragraph: { spacing: { after: 120 }, alignment: AlignmentType.RIGHT } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal",
        run: { size: 20, bold: true, color: GOLD_DARK, font: "Georgia" },
        paragraph: { spacing: { before: 120, after: 80 } } },
      { id: "CompanyName", name: "Company Name", basedOn: "Normal",
        run: { size: 36, bold: true, color: TEXT_DARK, font: "Georgia" },
        paragraph: { spacing: { after: 60 } } }
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 567, right: 567, bottom: 850, left: 567 } }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            children: [new TextRun({ text: "", size: 2 })],
            border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: GOLD_PRIMARY } }
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 6, color: GOLD_PRIMARY } },
            spacing: { before: 120 },
            children: [
              new TextRun({ text: "RA Bâtiment — SIRET : 933 728 610 00017", size: 14, color: TEXT_MUTED })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "5 rue de la Gaîté, 93000 Bobigny — Tél : +33 6 89 12 46 21 — Email : contact@ra-batiment.fr", size: 14, color: TEXT_MUTED })
            ]
          })
        ]
      })
    },
    children: [
      // === HEADER ===
      new Table({
        columnWidths: [5500, 4500],
        rows: [
          new TableRow({
            children: [
              // Logo + Company Info
              new TableCell({
                borders: noBorders,
                width: { size: 5500, type: WidthType.DXA },
                children: [
                  new Table({
                    columnWidths: [1200, 4000],
                    rows: [
                      new TableRow({
                        children: [
                          new TableCell({
                            borders: noBorders,
                            width: { size: 1200, type: WidthType.DXA },
                            verticalAlign: VerticalAlign.CENTER,
                            children: [
                              new Paragraph({
                                children: [new ImageRun({
                                  type: "png",
                                  data: logoBuffer,
                                  transformation: { width: 60, height: 60 },
                                  altText: { title: "RA Bâtiment", description: "Logo", name: "Logo" }
                                })]
                              })
                            ]
                          }),
                          new TableCell({
                            borders: noBorders,
                            width: { size: 4000, type: WidthType.DXA },
                            verticalAlign: VerticalAlign.CENTER,
                            children: [
                              new Paragraph({ style: "CompanyName", children: [new TextRun("RA Bâtiment")] }),
                              new Paragraph({ children: [new TextRun({ text: "5 rue de la Gaîté, 93000 Bobigny", size: 16, color: TEXT_MUTED })] }),
                              new Paragraph({ children: [new TextRun({ text: "Tél : +33 6 89 12 46 21", size: 16, color: TEXT_MUTED })] }),
                              new Paragraph({ children: [new TextRun({ text: "Email : contact@ra-batiment.fr", size: 16, color: TEXT_MUTED })] }),
                              new Paragraph({ children: [new TextRun({ text: "SIRET : 933 728 610 00017", size: 16, color: TEXT_MUTED })] })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              // Document Title
              new TableCell({
                borders: noBorders,
                width: { size: 4500, type: WidthType.DXA },
                verticalAlign: VerticalAlign.TOP,
                children: [
                  new Paragraph({ style: "Title", children: [new TextRun("FACTURE")] }),
                  new Paragraph({ alignment: AlignmentType.RIGHT, children: [
                    new TextRun({ text: "N° ", size: 18, color: TEXT_MUTED }),
                    new TextRun({ text: "FA-2025-001", size: 18, color: TEXT_DARK, bold: true })
                  ]}),
                  new Paragraph({ alignment: AlignmentType.RIGHT, children: [
                    new TextRun({ text: "Date : ", size: 18, color: TEXT_MUTED }),
                    new TextRun({ text: "__/__/____", size: 18, color: TEXT_DARK })
                  ]}),
                  new Paragraph({ alignment: AlignmentType.RIGHT, children: [
                    new TextRun({ text: "Échéance : ", size: 18, color: TEXT_MUTED }),
                    new TextRun({ text: "__/__/____ (30 jours)", size: 18, color: TEXT_DARK })
                  ]}),
                  new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 60 }, children: [
                    new TextRun({ text: "Réf. Devis : DEV-2025-XXX", size: 16, color: TEXT_MUTED, shading: { fill: BG_LIGHT, type: ShadingType.CLEAR } })
                  ]})
                ]
              })
            ]
          })
        ]
      }),

      // Spacing
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      // === PARTIES ===
      new Table({
        columnWidths: [4800, 400, 4800],
        rows: [
          new TableRow({
            children: [
              // Émetteur
              new TableCell({
                borders: cellBorders,
                width: { size: 4800, type: WidthType.DXA },
                shading: { fill: BG_LIGHT, type: ShadingType.CLEAR },
                margins: { top: 100, bottom: 100, left: 150, right: 150 },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "ÉMETTEUR", size: 18, bold: true, color: GOLD_DARK })] }),
                  new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: "RA Bâtiment", size: 18, bold: true, color: TEXT_DARK })] }),
                  new Paragraph({ children: [new TextRun({ text: "5 rue de la Gaîté", size: 18, color: TEXT_DARK })] }),
                  new Paragraph({ children: [new TextRun({ text: "93000 Bobigny", size: 18, color: TEXT_DARK })] }),
                  new Paragraph({ children: [new TextRun({ text: "Tél : +33 6 89 12 46 21", size: 18, color: TEXT_DARK })] }),
                  new Paragraph({ children: [new TextRun({ text: "SIRET : 933 728 610 00017", size: 18, color: TEXT_DARK })] })
                ]
              }),
              // Spacing column
              new TableCell({ borders: noBorders, width: { size: 400, type: WidthType.DXA }, children: [new Paragraph({ children: [] })] }),
              // Facturer à
              new TableCell({
                borders: cellBorders,
                width: { size: 4800, type: WidthType.DXA },
                shading: { fill: BG_LIGHT, type: ShadingType.CLEAR },
                margins: { top: 100, bottom: 100, left: 150, right: 150 },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "FACTURER À", size: 18, bold: true, color: GOLD_DARK })] }),
                  new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: "[Nom du client]", size: 18, color: TEXT_MUTED, italics: true })] }),
                  new Paragraph({ children: [new TextRun({ text: "[Adresse]", size: 18, color: TEXT_MUTED, italics: true })] }),
                  new Paragraph({ children: [new TextRun({ text: "[Code postal, Ville]", size: 18, color: TEXT_MUTED, italics: true })] }),
                  new Paragraph({ children: [new TextRun({ text: "[Téléphone]", size: 18, color: TEXT_MUTED, italics: true })] }),
                  new Paragraph({ children: [new TextRun({ text: "[Email]", size: 18, color: TEXT_MUTED, italics: true })] })
                ]
              })
            ]
          })
        ]
      }),

      // Spacing
      new Paragraph({ spacing: { after: 200 }, children: [] }),

      // === OBJECT ===
      new Table({
        columnWidths: [10000],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: { ...noBorders, left: { style: BorderStyle.SINGLE, size: 18, color: GOLD_PRIMARY } },
                width: { size: 10000, type: WidthType.DXA },
                shading: { fill: "FDF8E8", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 150, right: 100 },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "OBJET", size: 18, bold: true, color: GOLD_DARK })] }),
                  new Paragraph({ spacing: { before: 60 }, children: [new TextRun({ text: "[Description des travaux réalisés]", size: 18, color: TEXT_MUTED, italics: true })] })
                ]
              })
            ]
          })
        ]
      }),

      // Spacing
      new Paragraph({ spacing: { after: 200 }, children: [] }),

      // === ITEMS TABLE ===
      new Table({
        columnWidths: [4000, 1000, 1000, 1500, 1000, 1500],
        rows: [
          // Header row
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({ borders: cellBorders, width: { size: 4000, type: WidthType.DXA }, shading: { fill: GOLD_PRIMARY, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: "DESCRIPTION", size: 16, bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 1000, type: WidthType.DXA }, shading: { fill: GOLD_PRIMARY, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "QTÉ", size: 16, bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 1000, type: WidthType.DXA }, shading: { fill: GOLD_PRIMARY, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "UNITÉ", size: 16, bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 1500, type: WidthType.DXA }, shading: { fill: GOLD_PRIMARY, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "P.U. HT", size: 16, bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 1000, type: WidthType.DXA }, shading: { fill: GOLD_PRIMARY, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "TVA", size: 16, bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 1500, type: WidthType.DXA }, shading: { fill: GOLD_PRIMARY, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "TOTAL HT", size: 16, bold: true, color: "FFFFFF" })] })] })
            ]
          }),
          // Data rows
          ...createItemRows([
            ["[Prestation 1 - ex: Démolition cloison]", "1", "forfait", "XXX,XX €", "10%", "XXX,XX €"],
            ["[Prestation 2 - ex: Pose carrelage]", "XX", "m²", "XX,XX €", "10%", "XXX,XX €"],
            ["[Fournitures - ex: Carrelage grès cérame]", "XX", "m²", "XX,XX €", "20%", "XXX,XX €"],
            ["[Prestation 3]", "-", "-", "-", "-", "-"]
          ])
        ]
      }),

      // Spacing
      new Paragraph({ spacing: { after: 200 }, children: [] }),

      // === TOTALS ===
      new Table({
        columnWidths: [6000, 4000],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders: noBorders, width: { size: 6000, type: WidthType.DXA }, children: [new Paragraph({ children: [] })] }),
            new TableCell({ borders: { ...noBorders, bottom: cellBorder }, width: { size: 4000, type: WidthType.DXA },
              children: [new Paragraph({ children: [
                new TextRun({ text: "Total HT", size: 18, color: TEXT_DARK }),
                new TextRun({ text: "\t\t\t\tX XXX,XX €", size: 18, bold: true, color: TEXT_DARK })
              ]})]
            })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: noBorders, width: { size: 6000, type: WidthType.DXA }, children: [new Paragraph({ children: [] })] }),
            new TableCell({ borders: { ...noBorders, bottom: cellBorder }, width: { size: 4000, type: WidthType.DXA },
              children: [new Paragraph({ children: [
                new TextRun({ text: "TVA 10% (travaux)", size: 18, color: TEXT_MUTED }),
                new TextRun({ text: "\t\t\tXXX,XX €", size: 18, color: TEXT_MUTED })
              ]})]
            })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: noBorders, width: { size: 6000, type: WidthType.DXA }, children: [new Paragraph({ children: [] })] }),
            new TableCell({ borders: { ...noBorders, bottom: cellBorder }, width: { size: 4000, type: WidthType.DXA },
              children: [new Paragraph({ children: [
                new TextRun({ text: "TVA 20% (fournitures)", size: 18, color: TEXT_MUTED }),
                new TextRun({ text: "\t\tXXX,XX €", size: 18, color: TEXT_MUTED })
              ]})]
            })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: noBorders, width: { size: 6000, type: WidthType.DXA }, children: [new Paragraph({ children: [] })] }),
            new TableCell({ borders: { ...noBorders, bottom: { style: BorderStyle.DOUBLE, size: 6, color: GOLD_PRIMARY } }, width: { size: 4000, type: WidthType.DXA },
              children: [new Paragraph({ spacing: { before: 60 }, children: [
                new TextRun({ text: "Total TTC", size: 24, bold: true, color: GOLD_DARK, font: "Georgia" }),
                new TextRun({ text: "\t\t\tX XXX,XX €", size: 24, bold: true, color: GOLD_DARK, font: "Georgia" })
              ]})]
            })
          ]})
        ]
      }),

      // Spacing
      new Paragraph({ spacing: { after: 200 }, children: [] }),

      // === PAYMENT INFO ===
      new Table({
        columnWidths: [4800, 400, 4800],
        rows: [
          new TableRow({
            children: [
              // Conditions de règlement
              new TableCell({
                borders: cellBorders,
                width: { size: 4800, type: WidthType.DXA },
                shading: { fill: BG_LIGHT, type: ShadingType.CLEAR },
                margins: { top: 100, bottom: 100, left: 150, right: 150 },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "CONDITIONS DE RÈGLEMENT", size: 16, bold: true, color: GOLD_DARK })] }),
                  new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: "Paiement à réception de facture", size: 16, color: TEXT_DARK })] }),
                  new Paragraph({ children: [new TextRun({ text: "Échéance : 30 jours", size: 16, color: TEXT_DARK })] }),
                  new Paragraph({ children: [new TextRun({ text: "Mode de paiement : Virement bancaire", size: 16, color: TEXT_DARK })] })
                ]
              }),
              // Spacing column
              new TableCell({ borders: noBorders, width: { size: 400, type: WidthType.DXA }, children: [new Paragraph({ children: [] })] }),
              // Coordonnées bancaires
              new TableCell({
                borders: cellBorders,
                width: { size: 4800, type: WidthType.DXA },
                shading: { fill: BG_LIGHT, type: ShadingType.CLEAR },
                margins: { top: 100, bottom: 100, left: 150, right: 150 },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "COORDONNÉES BANCAIRES", size: 16, bold: true, color: GOLD_DARK })] }),
                  new Paragraph({ spacing: { before: 80 }, children: [
                    new TextRun({ text: "Banque : ", size: 16, bold: true, color: TEXT_DARK }),
                    new TextRun({ text: "[Nom de la banque]", size: 16, color: TEXT_MUTED, italics: true })
                  ]}),
                  new Paragraph({ children: [
                    new TextRun({ text: "IBAN : ", size: 16, bold: true, color: TEXT_DARK }),
                    new TextRun({ text: "[FR76 XXXX XXXX XXXX XXXX XXXX XXX]", size: 16, color: TEXT_MUTED, italics: true })
                  ]}),
                  new Paragraph({ children: [
                    new TextRun({ text: "BIC : ", size: 16, bold: true, color: TEXT_DARK }),
                    new TextRun({ text: "[XXXXXXXX]", size: 16, color: TEXT_MUTED, italics: true })
                  ]})
                ]
              })
            ]
          })
        ]
      }),

      // Spacing
      new Paragraph({ spacing: { after: 150 }, children: [] }),

      // === LEGAL MENTIONS ===
      new Table({
        columnWidths: [10000],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 10000, type: WidthType.DXA },
                shading: { fill: "F8F8F8", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 150, right: 150 },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "MENTIONS LÉGALES", size: 14, bold: true, color: TEXT_MUTED })] }),
                  new Paragraph({ spacing: { before: 60 }, children: [new TextRun({ text: "En cas de retard de paiement, une indemnité forfaitaire de 40€ pour frais de recouvrement sera due (Art. L.441-6 et D.441-5 du Code de commerce).", size: 14, color: TEXT_MUTED })] }),
                  new Paragraph({ children: [new TextRun({ text: "Taux des pénalités de retard : 3 fois le taux d'intérêt légal en vigueur.", size: 14, color: TEXT_MUTED })] }),
                  new Paragraph({ children: [new TextRun({ text: "Pas d'escompte pour paiement anticipé.", size: 14, color: TEXT_MUTED })] })
                ]
              })
            ]
          })
        ]
      })
    ]
  }]
});

// Helper function to create item rows
function createItemRows(items) {
  return items.map((item, index) => {
    const bgColor = index % 2 === 1 ? BG_LIGHT : "FFFFFF";
    return new TableRow({
      children: [
        new TableCell({ borders: cellBorders, width: { size: 4000, type: WidthType.DXA }, shading: { fill: bgColor, type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: item[0], size: 18, color: TEXT_MUTED, italics: true })] })] }),
        new TableCell({ borders: cellBorders, width: { size: 1000, type: WidthType.DXA }, shading: { fill: bgColor, type: ShadingType.CLEAR },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item[1], size: 18, color: TEXT_DARK })] })] }),
        new TableCell({ borders: cellBorders, width: { size: 1000, type: WidthType.DXA }, shading: { fill: bgColor, type: ShadingType.CLEAR },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item[2], size: 18, color: TEXT_DARK })] })] }),
        new TableCell({ borders: cellBorders, width: { size: 1500, type: WidthType.DXA }, shading: { fill: bgColor, type: ShadingType.CLEAR },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item[3], size: 18, color: TEXT_DARK })] })] }),
        new TableCell({ borders: cellBorders, width: { size: 1000, type: WidthType.DXA }, shading: { fill: bgColor, type: ShadingType.CLEAR },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item[4], size: 18, color: TEXT_DARK })] })] }),
        new TableCell({ borders: cellBorders, width: { size: 1500, type: WidthType.DXA }, shading: { fill: bgColor, type: ShadingType.CLEAR },
          children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: item[5], size: 18, color: TEXT_DARK, bold: true })] })] })
      ]
    });
  });
}

// Generate and save
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(path.join(__dirname, 'template-facture.docx'), buffer);
  console.log('template-facture.docx created successfully!');
}).catch(err => {
  console.error('Error creating document:', err);
});
