import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

interface ContactFormData {
  name: string;
  phone: string;
  message: string;
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

    const body: ContactFormData = await request.json();

    const { name, phone, message } = body;

    // Validation basique
    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis." },
        { status: 400 }
      );
    }

    // Email à l'artisan
    await resend.emails.send({
      from: "RA Bâtiment <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL || "ra.solution@myyahoo.com",
      subject: `Nouvelle demande de devis - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #d4af37 0%, #f4e4bc 50%, #d4af37 100%); padding: 20px; text-align: center;">
            <table align="center" style="margin-bottom: 15px;">
              <tr>
                <td style="background: #0a0a0a; padding: 12px 16px; border: 1px solid #d4af37;">
                  <span style="font-family: Georgia, serif; font-size: 24px; font-weight: bold; color: #d4af37; letter-spacing: 2px;">RA</span>
                </td>
                <td style="padding-left: 12px; text-align: left;">
                  <div style="font-family: Georgia, serif; font-size: 18px; font-weight: bold; color: #0a0a0a;">RA Bâtiment</div>
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
                <td style="padding: 10px 0; color: #666;"><strong>Téléphone :</strong></td>
                <td style="padding: 10px 0; color: #0a0a0a;">
                  <a href="tel:${phone}" style="color: #d4af37;">${phone}</a>
                </td>
              </tr>
            </table>

            <h2 style="color: #0a0a0a; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-top: 30px;">
              Description du projet
            </h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #d4af37;">
              <p style="color: #0a0a0a; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                ⚡ <strong>Rappel :</strong> Contacter le client sous 24h au ${phone}
              </p>
            </div>
          </div>

          <div style="background: #0a0a0a; padding: 20px; text-align: center;">
            <p style="color: #d4af37; margin: 0; font-size: 14px;">
              RA Bâtiment — Excellence & Prestige
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
