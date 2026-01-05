import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
}

const projectTypeLabels: Record<string, string> = {
  renovation: "Rénovation intérieure",
  maconnerie: "Maçonnerie",
  plomberie: "Plomberie",
  electricite: "Électricité",
  autre: "Autre",
};

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

    const body: ContactFormData = await request.json();

    const { name, email, phone, projectType, message } = body;

    // Validation basique
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis." },
        { status: 400 }
      );
    }

    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Adresse email invalide." },
        { status: 400 }
      );
    }

    const projectLabel = projectTypeLabels[projectType] || projectType || "Non spécifié";

    // Email à l'artisan
    await resend.emails.send({
      from: "RA Solution <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL || "ra.solution@myyahoo.com",
      replyTo: email,
      subject: `Nouvelle demande de devis - ${projectLabel}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #d4af37 0%, #f4e4bc 50%, #d4af37 100%); padding: 20px; text-align: center;">
            <table align="center" style="margin-bottom: 15px;">
              <tr>
                <td style="background: #0a0a0a; padding: 12px 16px; border: 1px solid #d4af37;">
                  <span style="font-family: Georgia, serif; font-size: 24px; font-weight: bold; color: #d4af37; letter-spacing: 2px;">RA</span>
                </td>
                <td style="padding-left: 12px; text-align: left;">
                  <div style="font-family: Georgia, serif; font-size: 18px; font-weight: bold; color: #0a0a0a;">RA Solution</div>
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
                <td style="padding: 10px 0; color: #0a0a0a;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666;"><strong>Email :</strong></td>
                <td style="padding: 10px 0; color: #0a0a0a;">
                  <a href="mailto:${email}" style="color: #d4af37;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666;"><strong>Téléphone :</strong></td>
                <td style="padding: 10px 0; color: #0a0a0a;">
                  <a href="tel:${phone}" style="color: #d4af37;">${phone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666;"><strong>Type de projet :</strong></td>
                <td style="padding: 10px 0; color: #0a0a0a;">${projectLabel}</td>
              </tr>
            </table>

            <h2 style="color: #0a0a0a; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-top: 30px;">
              Message
            </h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #d4af37;">
              <p style="color: #0a0a0a; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>

          <div style="background: #0a0a0a; padding: 20px; text-align: center;">
            <p style="color: #d4af37; margin: 0; font-size: 14px;">
              RA Solution — Excellence & Prestige
            </p>
          </div>
        </div>
      `,
    });

    // Email de confirmation au client
    await resend.emails.send({
      from: "RA Solution <onboarding@resend.dev>",
      to: email,
      subject: "Confirmation de votre demande - RA Solution",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #d4af37 0%, #f4e4bc 50%, #d4af37 100%); padding: 30px; text-align: center;">
            <table align="center" style="margin-bottom: 15px;">
              <tr>
                <td style="background: #0a0a0a; padding: 12px 16px; border: 1px solid #d4af37;">
                  <span style="font-family: Georgia, serif; font-size: 24px; font-weight: bold; color: #d4af37; letter-spacing: 2px;">RA</span>
                </td>
                <td style="padding-left: 12px; text-align: left;">
                  <div style="font-family: Georgia, serif; font-size: 18px; font-weight: bold; color: #0a0a0a;">RA Solution</div>
                  <div style="font-family: Georgia, serif; font-size: 11px; color: #333; letter-spacing: 1px;">Excellence & Prestige</div>
                </td>
              </tr>
            </table>
            <h1 style="color: #0a0a0a; margin: 0;">Merci pour votre demande</h1>
          </div>

          <div style="padding: 30px; background: #f9f9f9;">
            <p style="color: #0a0a0a; font-size: 16px; line-height: 1.6;">
              Bonjour <strong>${name}</strong>,
            </p>

            <p style="color: #0a0a0a; font-size: 16px; line-height: 1.6;">
              Nous avons bien reçu votre demande de devis pour un projet de <strong>${projectLabel.toLowerCase()}</strong>.
            </p>

            <p style="color: #0a0a0a; font-size: 16px; line-height: 1.6;">
              Notre équipe vous contactera dans les <strong>24 heures</strong> pour discuter de votre projet et vous fournir un devis personnalisé.
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4af37;">
              <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">
                <strong>Récapitulatif de votre demande :</strong>
              </p>
              <p style="color: #0a0a0a; margin: 0; font-size: 14px; white-space: pre-wrap;">${message}</p>
            </div>

            <p style="color: #0a0a0a; font-size: 16px; line-height: 1.6;">
              Pour toute question urgente, n'hésitez pas à nous appeler au <strong>06 23 30 44 45</strong>.
            </p>

            <p style="color: #0a0a0a; font-size: 16px; line-height: 1.6;">
              Cordialement,<br>
              <strong>L'équipe RA Solution</strong>
            </p>
          </div>

          <div style="background: #0a0a0a; padding: 20px; text-align: center;">
            <p style="color: #d4af37; margin: 0; font-size: 14px;">
              RA Solution — Excellence & Prestige
            </p>
            <p style="color: #888; margin: 10px 0 0 0; font-size: 12px;">
              5 rue de la Gaîté, 93000 Bobigny
            </p>
          </div>
        </div>
      `,
    });

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
