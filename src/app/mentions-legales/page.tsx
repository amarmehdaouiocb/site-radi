"use client";

// Its Hover animated icons
import ArrowNarrowLeftIcon from "@/components/ui/arrow-narrow-left-icon";
import PhoneVolume from "@/components/ui/phone-volume";
import MailFilledIcon from "@/components/ui/mail-filled-icon";
import GlobeIcon from "@/components/ui/globe-icon";
import FileDescriptionIcon from "@/components/ui/file-description-icon";
// Phosphor fallback
import { Buildings } from "@phosphor-icons/react";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";
import "../gold.css";

export default function MentionsLegales() {
  return (
    <div className="gold-variant">
      {/* Header */}
      <header className="gold-header">
        <div className="gold-container">
          <a href="/" className="gold-logo">
            <Image
              src="/logo.svg"
              alt={SITE_CONFIG.name}
              width={180}
              height={60}
              className="gold-logo-img"
              priority
            />
          </a>

          <a href="/" className="gold-cta-button">
            <ArrowNarrowLeftIcon size={16} />
            <span>Retour à l&apos;accueil</span>
          </a>
        </div>
      </header>

      {/* Content */}
      <main style={{ paddingTop: "120px", paddingBottom: "80px", minHeight: "100vh" }}>
        <div className="gold-container">
          <div className="gold-section-header" style={{ marginBottom: "3rem" }}>
            <span className="gold-section-label">Informations légales</span>
            <h1 className="gold-section-title">
              Mentions <span className="gold-text-gradient">Légales</span>
            </h1>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            maxWidth: "1000px"
          }}>
            {/* Identité */}
            <div style={{
              background: "var(--gold-bg-card)",
              border: "1px solid var(--gold-border)",
              padding: "2rem",
              borderRadius: "8px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  background: "var(--gold-gradient)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Buildings className="w-5 h-5" style={{ color: "var(--gold-bg)" }} />
                </div>
                <h2 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.25rem",
                  color: "var(--gold-text)"
                }}>
                  Identité de l&apos;entreprise
                </h2>
              </div>

              <dl style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <dt style={{ fontSize: "0.75rem", color: "var(--gold-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>
                    Dénomination sociale
                  </dt>
                  <dd style={{ color: "var(--gold-text)", fontWeight: "500" }}>
                    {SITE_CONFIG.legalName}
                  </dd>
                </div>
                <div>
                  <dt style={{ fontSize: "0.75rem", color: "var(--gold-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>
                    Forme juridique
                  </dt>
                  <dd style={{ color: "var(--gold-text)" }}>
                    {SITE_CONFIG.legalForm}
                  </dd>
                </div>
                <div>
                  <dt style={{ fontSize: "0.75rem", color: "var(--gold-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>
                    N° SIRET
                  </dt>
                  <dd style={{ color: "var(--gold-primary)", fontFamily: "monospace" }}>
                    {SITE_CONFIG.siret}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Contact */}
            <div style={{
              background: "var(--gold-bg-card)",
              border: "1px solid var(--gold-border)",
              padding: "2rem",
              borderRadius: "8px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  background: "var(--gold-gradient)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <FileDescriptionIcon size={20} color="var(--gold-bg)" />
                </div>
                <h2 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.25rem",
                  color: "var(--gold-text)"
                }}>
                  Coordonnées
                </h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <a
                  href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    color: "var(--gold-text)",
                    textDecoration: "none",
                    transition: "color 0.3s"
                  }}
                >
                  <PhoneVolume size={16} color="var(--gold-primary)" />
                  <span>{SITE_CONFIG.phone}</span>
                </a>

                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    color: "var(--gold-text)",
                    textDecoration: "none",
                    transition: "color 0.3s"
                  }}
                >
                  <MailFilledIcon size={16} color="var(--gold-primary)" />
                  <span>{SITE_CONFIG.email}</span>
                </a>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", color: "var(--gold-text)" }}>
                  <GlobeIcon size={16} color="var(--gold-primary)" className="mt-0.5" />
                  <span>{SITE_CONFIG.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional legal info */}
          <div style={{
            background: "var(--gold-bg-card)",
            border: "1px solid var(--gold-border)",
            padding: "2rem",
            borderRadius: "8px",
            marginTop: "2rem",
            maxWidth: "1000px"
          }}>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              color: "var(--gold-text)",
              marginBottom: "1.5rem"
            }}>
              Propriété intellectuelle
            </h2>
            <p style={{ color: "var(--gold-text-muted)", lineHeight: "1.8", marginBottom: "1rem" }}>
              L&apos;ensemble de ce site relève de la législation française et internationale sur le droit d&apos;auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
            <p style={{ color: "var(--gold-text-muted)", lineHeight: "1.8" }}>
              La reproduction de tout ou partie de ce site sur un support électronique quel qu&apos;il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
            </p>
          </div>

          <div style={{
            background: "var(--gold-bg-card)",
            border: "1px solid var(--gold-border)",
            padding: "2rem",
            borderRadius: "8px",
            marginTop: "2rem",
            maxWidth: "1000px"
          }}>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              color: "var(--gold-text)",
              marginBottom: "1.5rem"
            }}>
              Protection des données personnelles
            </h2>
            <p style={{ color: "var(--gold-text-muted)", lineHeight: "1.8", marginBottom: "1rem" }}>
              Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et d&apos;opposition aux données personnelles vous concernant.
            </p>
            <p style={{ color: "var(--gold-text-muted)", lineHeight: "1.8" }}>
              Pour exercer ces droits, vous pouvez nous contacter par email à l&apos;adresse : <a href={`mailto:${SITE_CONFIG.email}`} style={{ color: "var(--gold-primary)" }}>{SITE_CONFIG.email}</a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="gold-footer">
        <div className="gold-container">
          <div className="gold-footer-bottom">
            <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Tous droits réservés.</p>
            <p>Artisan BTP — Île-de-France</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
