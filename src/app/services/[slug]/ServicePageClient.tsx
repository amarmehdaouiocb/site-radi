"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Shield,
  Clock,
  Award,
  Home,
  Droplets,
  Zap,
  Paintbrush,
  Grid3X3,
} from "lucide-react";
import { SITE_CONFIG, SERVICES } from "@/lib/constants";
import "../../gold.css";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Brick: Shield, // Using Shield as fallback for Brick
  Droplets,
  Zap,
  Paintbrush,
  Grid3X3,
};

interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  image: string;
  features: string[];
  popular?: boolean;
}

interface ServicePageClientProps {
  service: Service;
}

export default function ServicePageClient({ service }: ServicePageClientProps) {
  // Get other services for recommendations
  const otherServices = SERVICES.filter((s) => s.id !== service.id).slice(0, 3);
  const IconComponent = iconMap[service.icon] || Home;

  return (
    <div className="gold-variant">
      {/* Header */}
      <header className="gold-header">
        <div className="gold-container">
          <Link href="/" className="gold-logo">
            <div className="gold-logo-icon">
              <span>RA</span>
            </div>
            <div className="gold-logo-text">
              <span className="gold-logo-name">{SITE_CONFIG.name}</span>
              <span className="gold-logo-tagline">Excellence & Prestige</span>
            </div>
          </Link>

          <nav className="gold-nav gold-nav-desktop">
            <Link href="/#services">Services</Link>
            <Link href="/#realisations">Réalisations</Link>
            <Link href="/#temoignages">Témoignages</Link>
            <Link href="/#contact">Contact</Link>
          </nav>

          <div className="gold-header-cta-group">
            <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="gold-header-phone">
              <Phone className="w-4 h-4" />
              <span>{SITE_CONFIG.phone}</span>
            </a>
            <Link href="/#contact" className="gold-cta-button gold-cta-small">
              Devis Gratuit 24h
            </Link>
          </div>
        </div>
      </header>

      {/* Service Hero */}
      <section className="gold-service-hero">
        <div className="gold-service-hero-bg">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover"
            priority
          />
          <div className="gold-service-hero-overlay" />
        </div>

        <div className="gold-container gold-service-hero-content">
          <Link href="/#services" className="gold-back-link">
            <ArrowLeft className="w-4 h-4" />
            Retour aux services
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="gold-service-hero-text"
          >
            <div className="gold-service-hero-icon">
              <IconComponent className="w-8 h-8" />
            </div>
            <h1 className="gold-service-hero-title">{service.title}</h1>
            <p className="gold-service-hero-desc">{service.longDescription}</p>
            <Link href="/#contact" className="gold-cta-button">
              Demander un Devis Gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="gold-service-features">
        <div className="gold-container">
          <div className="gold-section-header">
            <span className="gold-section-label">Ce que nous proposons</span>
            <h2 className="gold-section-title">
              Nos <span className="gold-text-gradient">Prestations</span>
            </h2>
          </div>

          <div className="gold-features-grid">
            {service.features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="gold-feature-card"
              >
                <CheckCircle className="w-6 h-6 gold-feature-icon" />
                <span className="gold-feature-text">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="gold-trust gold-trust-service">
        <div className="gold-container">
          <div className="gold-trust-grid">
            {[
              { icon: Shield, label: "Garantie Décennale", desc: "Protection totale" },
              { icon: Clock, label: "Devis sous 24h", desc: "Sans engagement" },
              { icon: Award, label: "Artisan Certifié", desc: "Qualité garantie" },
            ].map((item) => (
              <div key={item.label} className="gold-trust-item">
                <div className="gold-trust-icon">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="gold-trust-label">{item.label}</span>
                  <span className="gold-trust-desc">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gold-service-cta">
        <div className="gold-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="gold-service-cta-box"
          >
            <h2 className="gold-service-cta-title">
              Prêt à démarrer votre projet ?
            </h2>
            <p className="gold-service-cta-desc">
              Contactez-nous dès maintenant pour un devis gratuit et personnalisé.
              Notre équipe vous répond sous 24h.
            </p>
            <div className="gold-service-cta-buttons">
              <Link href="/#contact" className="gold-cta-button">
                Demander un Devis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                className="gold-cta-button gold-cta-outline"
              >
                <Phone className="w-5 h-5" />
                {SITE_CONFIG.phone}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Other Services */}
      <section className="gold-other-services">
        <div className="gold-container">
          <div className="gold-section-header">
            <span className="gold-section-label">Découvrez aussi</span>
            <h2 className="gold-section-title">
              Nos Autres <span className="gold-text-gradient">Services</span>
            </h2>
          </div>

          <div className="gold-services-grid gold-services-grid-small">
            {otherServices.map((otherService, index) => {
              const OtherIcon = iconMap[otherService.icon] || Home;
              return (
                <motion.div
                  key={otherService.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="gold-service-card"
                >
                  <div className="gold-service-image">
                    <Image
                      src={otherService.image}
                      alt={otherService.title}
                      fill
                      className="object-cover"
                    />
                    <div className="gold-service-overlay" />
                  </div>
                  <div className="gold-service-content">
                    <h3 className="gold-service-title">{otherService.title}</h3>
                    <p className="gold-service-desc">{otherService.description}</p>
                    <Link href={`/services/${otherService.slug}`} className="gold-service-link">
                      Découvrir <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="gold-footer">
        <div className="gold-container">
          <div className="gold-footer-grid">
            <div className="gold-footer-brand">
              <Link href="/" className="gold-logo">
                <div className="gold-logo-icon">
                  <span>RA</span>
                </div>
                <div className="gold-logo-text">
                  <span className="gold-logo-name">{SITE_CONFIG.name}</span>
                  <span className="gold-logo-tagline">Excellence & Prestige</span>
                </div>
              </Link>
              <p className="gold-footer-desc">{SITE_CONFIG.description}</p>
            </div>

            <div className="gold-footer-contact">
              <h4>Contact</h4>
              <div className="gold-footer-links">
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}>
                  <Phone className="w-4 h-4" />
                  {SITE_CONFIG.phone}
                </a>
                <a href={`mailto:${SITE_CONFIG.email}`}>
                  <Mail className="w-4 h-4" />
                  {SITE_CONFIG.email}
                </a>
                <span>
                  <MapPin className="w-4 h-4" />
                  {SITE_CONFIG.address}
                </span>
              </div>
            </div>

            <div className="gold-footer-hours">
              <h4>Horaires & Zone</h4>
              <p>{SITE_CONFIG.hours}</p>
              <p className="gold-footer-zone">Île-de-France</p>
            </div>
          </div>

          <div className="gold-footer-bottom">
            <p>© {new Date().getFullYear()} {SITE_CONFIG.legalName}. Tous droits réservés.</p>
            <p className="gold-footer-siret">SIRET : {SITE_CONFIG.siret}</p>
            <Link href="/mentions-legales" className="gold-footer-legal">
              Mentions légales
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
