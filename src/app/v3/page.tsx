"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Star,
  Zap,
} from "lucide-react";
import { SITE_CONFIG, SERVICES, PORTFOLIO_ITEMS, TESTIMONIALS } from "@/lib/constants";
import "./brutalist.css";

export default function BrutalistVariant() {
  return (
    <div className="brutalist-variant">
      {/* Header */}
      <header className="br-header">
        <div className="br-header-inner">
          <a href="/v3" className="br-logo">
            <div className="br-logo-box">RA</div>
            <span className="br-logo-text">Solution_</span>
          </a>

          <nav className="br-nav">
            <a href="#services">Services</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#avis">Avis</a>
            <a href="#contact">Contact</a>
          </nav>

          <a href="#contact" className="br-header-cta">
            <Zap className="w-4 h-4" />
            <span>Devis Express</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="br-hero">
        <div className="br-hero-content">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="br-hero-tag"
          >
            <Zap className="w-4 h-4" />
            <span>Artisan Certifié • 15 ans</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="br-hero-title"
          >
            BÂTIR
            <br />
            <span className="br-hero-title-accent">RÉNOVER</span>
            <br />
            TRANSFORMER
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="br-hero-desc"
          >
            // Rénovation intérieure, maçonnerie, plomberie, électricité.
            Tous corps de métiers en Île-de-France. Qualité sans compromis.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="br-hero-ctas"
          >
            <a href="#contact" className="br-btn-primary">
              <span>Demander un Devis</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="br-btn-secondary">
              <Phone className="w-4 h-4" />
              <span>{SITE_CONFIG.phone}</span>
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="br-hero-image"
        >
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80"
            alt="Construction"
            fill
            priority
            className="object-cover"
          />
          <div className="br-hero-image-overlay" />
          <div className="br-hero-stats">
            <div className="br-stat">
              <span className="br-stat-value">15+</span>
              <span className="br-stat-label">Années</span>
            </div>
            <div className="br-stat">
              <span className="br-stat-value">500+</span>
              <span className="br-stat-label">Projets</span>
            </div>
            <div className="br-stat">
              <span className="br-stat-value">100%</span>
              <span className="br-stat-label">Satisfaits</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Marquee */}
      <div className="br-marquee">
        <div className="br-marquee-track">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="br-marquee-item">
              <span>GARANTIE DÉCENNALE</span>
              <span className="br-marquee-dot" />
              <span>DEVIS GRATUIT 24H</span>
              <span className="br-marquee-dot" />
              <span>ARTISAN CERTIFIÉ</span>
              <span className="br-marquee-dot" />
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="br-services">
        <div className="br-container">
          <div className="br-section-header">
            <span className="br-section-number">01</span>
            <span className="br-section-label">Nos Services</span>
          </div>
          <h2 className="br-section-title">CE QU&apos;ON FAIT_</h2>

          <div className="br-services-grid" style={{ marginTop: "3rem" }}>
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="br-service-card"
              >
                <span className="br-service-number">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="br-service-title">{service.title.toUpperCase()}</h3>
                <p className="br-service-desc">{service.description}</p>
                <a href="#contact" className="br-service-link">
                  En savoir plus →
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="br-portfolio">
        <div className="br-container">
          <div className="br-section-header">
            <span className="br-section-number">02</span>
            <span className="br-section-label">Portfolio</span>
          </div>
          <h2 className="br-section-title">NOS RÉALISATIONS_</h2>

          <div className="br-portfolio-grid" style={{ marginTop: "3rem" }}>
            {PORTFOLIO_ITEMS.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="br-portfolio-item"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="br-portfolio-overlay">
                  <span className="br-portfolio-category">{item.category}</span>
                  <h3 className="br-portfolio-title">{item.title.toUpperCase()}</h3>
                  <span className="br-portfolio-location">{item.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="avis" className="br-testimonials">
        <div className="br-container">
          <div className="br-section-header">
            <span className="br-section-number">03</span>
            <span className="br-section-label">Témoignages</span>
          </div>
          <h2 className="br-section-title">ILS NOUS FONT CONFIANCE_</h2>

          <div className="br-testimonials-grid" style={{ marginTop: "3rem" }}>
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="br-testimonial-card"
              >
                <span className="br-testimonial-quote">&ldquo;</span>
                <p className="br-testimonial-content">{testimonial.content}</p>
                <div className="br-testimonial-author">
                  <div className="br-testimonial-avatar">
                    {testimonial.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="br-testimonial-info">
                    <span className="br-testimonial-name">{testimonial.author}</span>
                    <span className="br-testimonial-project">{testimonial.project}</span>
                    <div className="br-testimonial-rating">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="br-contact">
        <div className="br-container">
          <div className="br-contact-grid">
            <div className="br-contact-info">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                PARLONS DE
                <br />
                VOTRE <span>PROJET_</span>
              </motion.h2>
              <p className="br-contact-desc">
                // Consultation gratuite et devis détaillé sous 24h.
                Pas d&apos;engagement, pas de surprise.
              </p>

              <div className="br-contact-details">
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="br-contact-item">
                  <Phone />
                  <span>{SITE_CONFIG.phone}</span>
                </a>
                <a href={`mailto:${SITE_CONFIG.email}`} className="br-contact-item">
                  <Mail />
                  <span>{SITE_CONFIG.email}</span>
                </a>
                <div className="br-contact-item">
                  <MapPin />
                  <span>{SITE_CONFIG.address}</span>
                </div>
              </div>
            </div>

            <motion.form
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="br-contact-form"
            >
              <div className="br-form-row">
                <input type="text" placeholder="VOTRE NOM_" className="br-input" />
                <input type="email" placeholder="VOTRE EMAIL_" className="br-input" />
              </div>
              <input type="tel" placeholder="VOTRE TÉLÉPHONE_" className="br-input" />
              <select className="br-input">
                <option value="">TYPE DE PROJET_</option>
                <option value="renovation">RÉNOVATION INTÉRIEURE</option>
                <option value="maconnerie">MAÇONNERIE</option>
                <option value="plomberie">PLOMBERIE</option>
                <option value="electricite">ÉLECTRICITÉ</option>
                <option value="autre">AUTRE</option>
              </select>
              <textarea placeholder="DÉCRIVEZ VOTRE PROJET_" rows={4} className="br-input" />
              <button type="submit" className="br-btn-primary br-btn-full">
                <span>ENVOYER MA DEMANDE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="br-footer">
        <div className="br-container">
          <div className="br-footer-content">
            <div className="br-footer-brand">
              <div className="br-footer-logo">RA</div>
              <p className="br-footer-tagline">
                // L&apos;excellence au service de vos projets de rénovation.
              </p>
            </div>
            <div className="br-footer-links">
              <a href="#services">Services</a>
              <a href="#portfolio">Portfolio</a>
              <a href="#avis">Avis</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div className="br-footer-bottom">
            <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. TOUS DROITS RÉSERVÉS.</p>
            <p>ARTISAN BTP — ÎLE-DE-FRANCE</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
