import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { SERVICES, BUDGET_OPTIONS, TIMELINE_OPTIONS, ROOM_OPTIONS } from "@/lib/constants";

// New structured quote form data
interface QuoteFormData {
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
  rgpdAccepted: boolean;
}

// Legacy simple form data (backwards compatibility)
interface LegacyFormData {
  name: string;
  phone: string;
  message: string;
}

// Type guard to check if it's the new format
function isQuoteFormData(data: unknown): data is QuoteFormData {
  return (
    typeof data === "object" &&
    data !== null &&
    "services" in data &&
    Array.isArray((data as QuoteFormData).services)
  );
}

// Helper to get label from value
function getBudgetLabel(value: string): string {
  return BUDGET_OPTIONS.find((o) => o.value === value)?.label || value;
}

function getTimelineLabel(value: string): string {
  return TIMELINE_OPTIONS.find((o) => o.value === value)?.label || value;
}

function getServiceTitle(id: string): string {
  return SERVICES.find((s) => s.id === id)?.title || id;
}

function getRoomLabel(value: string): string {
  return ROOM_OPTIONS.find((r) => r.value === value)?.label || value;
}

// Generate HTML for the new structured email
function generateQuoteEmailHtml(data: QuoteFormData): string {
  const servicesHtml = data.services
    .map((serviceId) => {
      const serviceTitle = getServiceTitle(serviceId);
      const features = data.selectedFeatures[serviceId] || [];
      const rooms = data.selectedRooms?.[serviceId] || [];

      const roomsHtml = rooms.length > 0
        ? `<div style="margin: 5px 0 0 20px; color: #888; font-size: 13px;">
            <strong>Pieces :</strong> ${rooms.map(r => getRoomLabel(r)).join(", ")}
          </div>`
        : "";

      const featuresHtml =
        features.length > 0
          ? `<ul style="margin: 5px 0 0 20px; padding: 0; color: #666;">
              ${features.map((f) => `<li style="margin: 3px 0;">${f}</li>`).join("")}
            </ul>`
          : '<span style="color: #999; font-size: 13px; margin-left: 20px;">Demande générale</span>';

      return `
        <div style="margin-bottom: 15px;">
          <strong style="color: #d4af37;">&#x2713; ${serviceTitle}</strong>
          ${roomsHtml}
          ${featuresHtml}
        </div>
      `;
    })
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #d4af37 0%, #f4e4bc 50%, #d4af37 100%); padding: 20px; text-align: center;">
        <table align="center" style="margin-bottom: 15px;">
          <tr>
            <td style="vertical-align: middle;">
              <img src="https://ra-batiment.fr/logos/ra-batiment/png/232893795.png" alt="RA Batiment" width="70" height="70" style="display: block; border: 2px solid #d4af37;">
            </td>
            <td style="padding-left: 12px; text-align: left; vertical-align: middle;">
              <div style="font-family: Georgia, serif; font-size: 18px; font-weight: bold; color: #0a0a0a;">RA Batiment</div>
              <div style="font-family: Georgia, serif; font-size: 11px; color: #333; letter-spacing: 1px;">Excellence & Prestige</div>
            </td>
          </tr>
        </table>
        <h1 style="color: #0a0a0a; margin: 0; font-size: 22px;">Nouvelle Demande de Devis Qualifiee</h1>
      </div>

      <div style="padding: 30px; background: #f9f9f9;">
        <!-- Client Info -->
        <h2 style="color: #0a0a0a; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-top: 0;">
          Coordonnées du client
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
          <tr>
            <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Nom :</strong></td>
            <td style="padding: 8px 0; color: #0a0a0a;">${data.name}</td>
          </tr>
          ${data.phone ? `<tr>
            <td style="padding: 8px 0; color: #666;"><strong>Téléphone :</strong></td>
            <td style="padding: 8px 0;">
              <a href="tel:${data.phone}" style="color: #d4af37; font-weight: bold; font-size: 16px;">${data.phone}</a>
            </td>
          </tr>` : ""}
          ${data.email ? `<tr>
            <td style="padding: 8px 0; color: #666;"><strong>Email :</strong></td>
            <td style="padding: 8px 0;">
              <a href="mailto:${data.email}" style="color: #d4af37; font-weight: bold;">${data.email}</a>
            </td>
          </tr>` : ""}
        </table>

        <!-- Services -->
        <h2 style="color: #0a0a0a; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
          Services demandes (${data.services.length})
        </h2>
        <div style="background: white; padding: 20px; border-left: 4px solid #d4af37; margin-bottom: 25px;">
          ${servicesHtml}
        </div>

        <!-- Project Details -->
        ${(data.city || data.surface || data.budget || data.timeline) ? `
        <h2 style="color: #0a0a0a; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
          Détails du projet
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
          ${data.city ? `<tr>
            <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Ville :</strong></td>
            <td style="padding: 8px 0; color: #0a0a0a;">${data.city}</td>
          </tr>` : ""}
          ${data.surface ? `<tr>
            <td style="padding: 8px 0; color: #666;"><strong>Surface :</strong></td>
            <td style="padding: 8px 0; color: #0a0a0a;">${data.surface} m2</td>
          </tr>` : ""}
          ${data.budget ? `<tr>
            <td style="padding: 8px 0; color: #666;"><strong>Budget :</strong></td>
            <td style="padding: 8px 0; color: #0a0a0a; font-weight: bold;">${getBudgetLabel(data.budget)}</td>
          </tr>` : ""}
          ${data.timeline ? `<tr>
            <td style="padding: 8px 0; color: #666;"><strong>Délai :</strong></td>
            <td style="padding: 8px 0; color: #0a0a0a;">${getTimelineLabel(data.timeline)}</td>
          </tr>` : ""}
        </table>` : ""}

        ${
          data.message
            ? `
          <h2 style="color: #0a0a0a; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
            Message complementaire
          </h2>
          <div style="background: white; padding: 20px; border-left: 4px solid #d4af37; margin-bottom: 25px;">
            <p style="color: #0a0a0a; line-height: 1.6; margin: 0; white-space: pre-wrap;">${data.message}</p>
          </div>
        `
            : ""
        }

        <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            &#x26A1; <strong>Rappel :</strong> Contacter le client sous 24h ${data.phone ? `au <a href="tel:${data.phone}" style="color: #856404;">${data.phone}</a>` : ""}${data.phone && data.email ? " ou " : ""}${data.email ? `par email à <a href="mailto:${data.email}" style="color: #856404;">${data.email}</a>` : ""}
          </p>
        </div>
      </div>

      <div style="background: #0a0a0a; padding: 20px; text-align: center;">
        <p style="color: #d4af37; margin: 0; font-size: 14px;">
          RA Batiment - Excellence & Prestige
        </p>
      </div>
    </div>
  `;
}

// Generate HTML for legacy simple email
function generateLegacyEmailHtml(data: LegacyFormData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #d4af37 0%, #f4e4bc 50%, #d4af37 100%); padding: 20px; text-align: center;">
        <table align="center" style="margin-bottom: 15px;">
          <tr>
            <td style="vertical-align: middle;">
              <img src="https://ra-batiment.fr/logos/ra-batiment/png/232893795.png" alt="RA Batiment" width="70" height="70" style="display: block; border: 2px solid #d4af37;">
            </td>
            <td style="padding-left: 12px; text-align: left; vertical-align: middle;">
              <div style="font-family: Georgia, serif; font-size: 18px; font-weight: bold; color: #0a0a0a;">RA Batiment</div>
              <div style="font-family: Georgia, serif; font-size: 11px; color: #333; letter-spacing: 1px;">Excellence & Prestige</div>
            </td>
          </tr>
        </table>
        <h1 style="color: #0a0a0a; margin: 0;">Nouvelle Demande de Devis</h1>
      </div>

      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #0a0a0a; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
          Informations du client
        </h2>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #666; width: 140px;"><strong>Nom :</strong></td>
            <td style="padding: 10px 0; color: #0a0a0a;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #666;"><strong>Téléphone :</strong></td>
            <td style="padding: 10px 0; color: #0a0a0a;">
              <a href="tel:${data.phone}" style="color: #d4af37;">${data.phone}</a>
            </td>
          </tr>
        </table>

        <h2 style="color: #0a0a0a; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-top: 30px;">
          Description du projet
        </h2>
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #d4af37;">
          <p style="color: #0a0a0a; line-height: 1.6; margin: 0; white-space: pre-wrap;">${data.message}</p>
        </div>

        <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            &#x26A1; <strong>Rappel :</strong> Contacter le client sous 24h au ${data.phone}
          </p>
        </div>
      </div>

      <div style="background: #0a0a0a; padding: 20px; text-align: center;">
        <p style="color: #d4af37; margin: 0; font-size: 14px;">
          RA Batiment - Excellence & Prestige
        </p>
      </div>
    </div>
  `;
}

// Generate HTML for client confirmation email
function generateConfirmationEmailHtml(data: QuoteFormData): string {
  const servicesList = data.services
    .map((serviceId) => getServiceTitle(serviceId))
    .join(", ");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #d4af37 0%, #f4e4bc 50%, #d4af37 100%); padding: 30px; text-align: center;">
        <table align="center" style="margin-bottom: 15px;">
          <tr>
            <td style="vertical-align: middle;">
              <img src="https://ra-batiment.fr/logos/ra-batiment/png/232893795.png" alt="RA Batiment" width="70" height="70" style="display: block; border: 2px solid #d4af37;">
            </td>
            <td style="padding-left: 12px; text-align: left; vertical-align: middle;">
              <div style="font-family: Georgia, serif; font-size: 18px; font-weight: bold; color: #0a0a0a;">RA Bâtiment</div>
              <div style="font-family: Georgia, serif; font-size: 11px; color: #333; letter-spacing: 1px;">Excellence & Prestige</div>
            </td>
          </tr>
        </table>
        <h1 style="color: #0a0a0a; margin: 0; font-size: 24px;">Merci pour votre demande !</h1>
      </div>

      <div style="padding: 30px; background: #f9f9f9;">
        <p style="color: #0a0a0a; font-size: 16px; line-height: 1.6;">
          Bonjour <strong>${data.name}</strong>,
        </p>

        <p style="color: #0a0a0a; font-size: 16px; line-height: 1.6;">
          Nous avons bien reçu votre demande de devis et nous vous en remercions.
        </p>

        <div style="background: white; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0;">
          <h3 style="color: #0a0a0a; margin: 0 0 10px 0; font-size: 16px;">Récapitulatif de votre demande :</h3>
          <p style="color: #666; margin: 0;">
            <strong>Services demandés :</strong> ${servicesList}
          </p>
          ${data.city ? `<p style="color: #666; margin: 5px 0 0 0;"><strong>Ville :</strong> ${data.city}</p>` : ""}
          ${data.surface ? `<p style="color: #666; margin: 5px 0 0 0;"><strong>Surface :</strong> ${data.surface} m²</p>` : ""}
          ${data.budget ? `<p style="color: #666; margin: 5px 0 0 0;"><strong>Budget :</strong> ${getBudgetLabel(data.budget)}</p>` : ""}
          ${data.timeline ? `<p style="color: #666; margin: 5px 0 0 0;"><strong>Délai souhaité :</strong> ${getTimelineLabel(data.timeline)}</p>` : ""}
        </div>

        <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #2e7d32; margin: 0; font-size: 15px;">
            <strong>&#x2713; Prochaine étape :</strong><br>
            Notre équipe vous recontactera sous <strong>24 heures</strong> pour discuter de votre projet et vous proposer un devis personnalisé.
          </p>
        </div>

        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          En attendant, n'hésitez pas à nous contacter directement :<br>
          <strong>Téléphone :</strong> <a href="tel:0749894696" style="color: #d4af37;">07 49 89 46 96</a><br>
          <strong>Email :</strong> <a href="mailto:contact@ra-batiment.fr" style="color: #d4af37;">contact@ra-batiment.fr</a>
        </p>
      </div>

      <div style="background: #0a0a0a; padding: 20px; text-align: center;">
        <p style="color: #d4af37; margin: 0 0 10px 0; font-size: 14px;">
          RA Bâtiment - Excellence & Prestige
        </p>
        <p style="color: #888; margin: 0; font-size: 12px;">
          5 rue de la Gaîté, 93000 Bobigny | Lun - Sam: 8h - 19h
        </p>
      </div>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  try {
    // Initialize Resend client at runtime (not build time)
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Configuration email manquante. Veuillez contacter l'administrateur." },
        { status: 500 }
      );
    }
    const resend = new Resend(process.env.RESEND_API_KEY);

    const body = await request.json();

    let emailHtml: string;
    let clientName: string;

    if (isQuoteFormData(body)) {
      // New structured form
      const { services, name, phone, email } = body;

      // Validation
      if (!services || services.length === 0) {
        return NextResponse.json(
          { error: "Veuillez sélectionner au moins un service." },
          { status: 400 }
        );
      }
      if (!name) {
        return NextResponse.json(
          { error: "Le nom est obligatoire." },
          { status: 400 }
        );
      }
      if (!phone && !email) {
        return NextResponse.json(
          { error: "Veuillez fournir un numéro de téléphone ou une adresse email." },
          { status: 400 }
        );
      }

      emailHtml = generateQuoteEmailHtml(body);
      clientName = name;

      // Send email to professional
      await resend.emails.send({
        from: "RA Bâtiment <noreply@ra-batiment.fr>",
        to: process.env.CONTACT_EMAIL || "contact@ra-batiment.fr",
        subject: `Nouvelle demande de devis - ${clientName}`,
        html: emailHtml,
      });

      // Send confirmation email to client (if email provided)
      if (email) {
        const confirmationHtml = generateConfirmationEmailHtml(body);
        await resend.emails.send({
          from: "RA Bâtiment <noreply@ra-batiment.fr>",
          to: email,
          subject: "Confirmation de votre demande de devis - RA Bâtiment",
          html: confirmationHtml,
        });
      }
    } else {
      // Legacy simple form (backwards compatibility)
      const { name, phone, message } = body as LegacyFormData;

      if (!name || !phone || !message) {
        return NextResponse.json(
          { error: "Tous les champs obligatoires doivent etre remplis." },
          { status: 400 }
        );
      }

      emailHtml = generateLegacyEmailHtml(body as LegacyFormData);
      clientName = name;

      // Send email to professional (legacy form has no client email)
      await resend.emails.send({
        from: "RA Bâtiment <noreply@ra-batiment.fr>",
        to: process.env.CONTACT_EMAIL || "contact@ra-batiment.fr",
        subject: `Nouvelle demande de devis - ${clientName}`,
        html: emailHtml,
      });
    }

    return NextResponse.json(
      { success: true, message: "Votre demande a été envoyée avec succès." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi du formulaire:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi de votre demande." },
      { status: 500 }
    );
  }
}
