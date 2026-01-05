"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Award,
  Sparkles,
} from "lucide-react";
import { SITE_CONFIG, SERVICES, PORTFOLIO_ITEMS, TESTIMONIALS } from "@/lib/constants";
import "./glass.css";

export default function GlassVariant() {
  return (
    <div className="glass-variant">
      {/* Header */}
      <header className="gl-header">
        <div className="gl-header-inner">
          <a href="/v4" className="gl-logo">
            <div className="gl-logo-icon">RA</div>
            <span className="gl-logo-text">Solution</span>
          </a>

          <nav className="gl-nav">
            <a href="#services">Services</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#avis">Avis</a>
            <a href="#contact">Contact</a>
          </nav>

          <a href="#contact" className="gl-header-cta">
            <span>Devis Gratuit</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gl-hero">
        <div className="gl-container">
          <div className="gl-hero-grid">
            <div className="gl-hero-content">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="gl-hero-badge"
              >
                <Sparkles className="w-4 h-4" />
                <span>Artisan certifié depuis 15 ans</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="gl-hero-title"
              >
                Rénovation
                <br />
                <span className="gl-text-gradient">d&apos;Excellence</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="gl-hero-desc"
              >
                Transformez vos espaces avec un savoir-faire artisanal.
                Rénovation intérieure, maçonnerie, plomberie et électricité
                en Île-de-France.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="gl-hero-ctas"
              >
                <a href="#contact" className="gl-btn-primary">
                  <span>Demander un Devis</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="gl-btn-secondary">
                  <Phone className="w-4 h-4" />
                  <span>{SITE_CONFIG.phone}</span>
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="gl-hero-visual"
            >
              <div className="gl-hero-image-wrapper">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                  alt="Rénovation intérieure"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="gl-hero-float-card"
              >
                <div className="gl-float-stat">
                  <span className="gl-float-value">15+</span>
                  <span className="gl-float-label">Années</span>
                </div>
                <div className="gl-float-stat">
                  <span className="gl-float-value">500+</span>
                  <span className="gl-float-label">Projets</span>
                </div>
                <div className="gl-float-stat">
                  <span className="gl-float-value">100%</span>
                  <span className="gl-float-label">Satisfaits</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="gl-features">
        <div className="gl-container">
          <div className="gl-features-grid">
            {[
              { icon: Shield, title: "Garantie Décennale", desc: "Protection totale" },
              { icon: Clock, title: "Devis en 24h", desc: "Réponse rapide" },
              { icon: Award, title: "Certifié RGE", desc: "Qualité reconnue" },
              { icon: Sparkles, title: "Finitions Soignées", desc: "Détails parfaits" },
            ].map((feature) => (
              <div key={feature.title} className="gl-feature">
                <div className="gl-feature-icon">
                  <feature.icon className="w-5 h-5" />
                </div>
                <div className="gl-feature-text">
                  <span className="gl-feature-title">{feature.title}</span>
                  <span className="gl-feature-desc">{feature.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="gl-services">
        <div className="gl-container">
          <div className="gl-section-header">
            <span className="gl-section-label">Nos Expertises</span>
            <h2 className="gl-section-title">
              Services <span className="gl-text-gradient">Premium</span>
            </h2>
            <p className="gl-section-desc">
              Un accompagnement complet pour tous vos projets de rénovation
            </p>
          </div>

          <div className="gl-services-grid">
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="gl-service-card"
              >
                <div className="gl-service-icon">{String(index + 1).padStart(2, "0")}</div>
                <h3 className="gl-service-title">{service.title}</h3>
                <p className="gl-service-desc">{service.description}</p>
                <a href="#contact" className="gl-service-link">
                  En savoir plus <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="gl-portfolio">
        <div className="gl-container">
          <div className="gl-section-header">
            <span className="gl-section-label">Portfolio</span>
            <h2 className="gl-section-title">
              Nos <span className="gl-text-gradient">Réalisations</span>
            </h2>
          </div>

          <div className="gl-portfolio-grid">
            {PORTFOLIO_ITEMS.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="gl-portfolio-item"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="gl-portfolio-overlay">
                  <span className="gl-portfolio-category">{item.category}</span>
                  <h3 className="gl-portfolio-title">{item.title}</h3>
                  <span className="gl-portfolio-location">{item.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="avis" className="gl-testimonials">
        <div className="gl-container">
          <div className="gl-section-header">
            <span className="gl-section-label">Témoignages</span>
            <h2 className="gl-section-title">
              Avis <span className="gl-text-gradient">Clients</span>
            </h2>
          </div>

          <div className="gl-testimonials-grid">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="gl-testimonial-card"
              >
                <div className="gl-testimonial-rating">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4" />
                  ))}
                </div>
                <p className="gl-testimonial-content">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="gl-testimonial-author">
                  <div className="gl-testimonial-avatar">
                    {testimonial.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <span className="gl-testimonial-name">{testimonial.author}</span>
                    <span className="gl-testimonial-project">{testimonial.project}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="gl-contact">
        <div className="gl-container">
          <div className="gl-contact-grid">
            <div className="gl-contact-info">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Parlons de votre{" "}
                <span className="gl-text-gradient">projet</span>
              </motion.h2>
              <p className="gl-contact-desc">
                Obtenez une consultation personnalisée et un devis détaillé
                sous 24 heures. Sans engagement.
              </p>

              <div className="gl-contact-details">
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="gl-contact-item">
                  <div className="gl-contact-item-icon">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span>{SITE_CONFIG.phone}</span>
                </a>
                <a href={`mailto:${SITE_CONFIG.email}`} className="gl-contact-item">
                  <div className="gl-contact-item-icon">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span>{SITE_CONFIG.email}</span>
                </a>
                <div className="gl-contact-item">
                  <div className="gl-contact-item-icon">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span>{SITE_CONFIG.address}</span>
                </div>
              </div>
            </div>

            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="gl-contact-form"
            >
              <div className="gl-form-row">
                <input type="text" placeholder="Votre nom" className="gl-input" />
                <input type="email" placeholder="Votre email" className="gl-input" />
              </div>
              <input type="tel" placeholder="Votre téléphone" className="gl-input" />
              <select className="gl-input">
                <option value="">Type de projet</option>
                <option value="renovation">Rénovation intérieure</option>
                <option value="maconnerie">Maçonnerie</option>
                <option value="plomberie">Plomberie</option>
                <option value="electricite">Électricité</option>
                <option value="autre">Autre</option>
              </select>
              <textarea placeholder="Décrivez votre projet..." rows={4} className="gl-input" />
              <button type="submit" className="gl-btn-primary gl-btn-full">
                <span>Envoyer ma demande</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="gl-footer">
        <div className="gl-container">
          <div className="gl-footer-content">
            <div className="gl-footer-brand">
              <div className="gl-footer-logo">
                <div className="gl-footer-logo-icon">RA</div>
                <span className="gl-footer-logo-text">Solution</span>
              </div>
              <p className="gl-footer-tagline">
                L&apos;excellence au service de vos projets de rénovation.
              </p>
            </div>
            <div className="gl-footer-links">
              <a href="#services">Services</a>
              <a href="#portfolio">Portfolio</a>
              <a href="#avis">Avis</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div className="gl-footer-bottom">
            <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Tous droits réservés.</p>
            <p>Artisan BTP — Île-de-France</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
