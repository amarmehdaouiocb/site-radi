"use client";

import { motion } from "framer-motion";
import { useState, FormEvent } from "react";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Star,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { SITE_CONFIG, SERVICES, PORTFOLIO_ITEMS, TESTIMONIALS } from "@/lib/constants";
import "./editorial.css";

export default function EditorialVariant() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus("success");
        setFormMessage(data.message);
        setFormData({ name: "", email: "", phone: "", projectType: "", message: "" });
      } else {
        setFormStatus("error");
        setFormMessage(data.error || "Une erreur est survenue.");
      }
    } catch {
      setFormStatus("error");
      setFormMessage("Erreur de connexion. Veuillez réessayer.");
    }
  };

  return (
    <div className="editorial-variant">
      {/* Header */}
      <header className="ed-header">
        <div className="ed-header-inner">
          <a href="/v1" className="ed-logo">
            <span className="ed-logo-mark">RA</span>
            <span className="ed-logo-divider" />
            <span className="ed-logo-text">Solution</span>
          </a>

          <nav className="ed-nav">
            <a href="#services">Services</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#témoignages">Témoignages</a>
            <a href="#contact">Contact</a>
          </nav>

          <a href="#contact" className="ed-header-cta">
            <span>Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="ed-hero">
        <div className="ed-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="ed-hero-eyebrow"
          >
            <span className="ed-hero-issue">Édition 2025</span>
            <span className="ed-hero-date">Île-de-France</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="ed-hero-title"
          >
            L&apos;Art de la
            <br />
            <em>Rénovation</em>
            <br />
            d&apos;Exception
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="ed-hero-intro"
          >
            Depuis 15 ans, nous transformons vos espaces avec un savoir-faire
            artisanal et une vision contemporaine. Chaque projet est une
            histoire unique.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="ed-hero-ctas"
          >
            <a href="#contact" className="ed-btn-primary">
              <span>Demander un Devis</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#portfolio" className="ed-btn-secondary">
              <span>Voir le Portfolio</span>
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="ed-hero-image"
        >
          <Image
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"
            alt="Architecture intérieure"
            fill
            priority
            className="object-cover"
          />
          <div className="ed-hero-image-overlay" />
          <span className="ed-hero-caption">Architecture • Design • Artisanat</span>
        </motion.div>
      </section>

      {/* Marquee */}
      <div className="ed-marquee">
        <div className="ed-marquee-track">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="ed-marquee-item">
              <span className="ed-marquee-text">Garantie Décennale</span>
              <span className="ed-marquee-dot" />
              <span className="ed-marquee-text">Artisan Certifié</span>
              <span className="ed-marquee-dot" />
              <span className="ed-marquee-text">Devis sous 24h</span>
              <span className="ed-marquee-dot" />
              <span className="ed-marquee-text">+500 Réalisations</span>
              <span className="ed-marquee-dot" />
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="ed-services">
        <div className="ed-container">
          <div className="ed-section-header">
            <div className="ed-section-line" />
            <span className="ed-section-label">Nos Expertises</span>
            <div className="ed-section-line" />
          </div>

          <h2 className="ed-section-title">
            Des Services <em>d&apos;Excellence</em>
          </h2>
          <p className="ed-section-subtitle">
            Un accompagnement sur mesure, de la conception à la réalisation finale
          </p>

          <div className="ed-services-grid" style={{ marginTop: "4rem" }}>
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="ed-service-card"
              >
                <span className="ed-service-number">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="ed-service-title">{service.title}</h3>
                <p className="ed-service-desc">{service.description}</p>
                <a href="#contact" className="ed-service-link">
                  En savoir plus <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="ed-portfolio">
        <div className="ed-container">
          <div className="ed-section-header">
            <div className="ed-section-line" />
            <span className="ed-section-label">Portfolio</span>
            <div className="ed-section-line" />
          </div>

          <h2 className="ed-section-title" style={{ color: "white" }}>
            Nos <em>Réalisations</em>
          </h2>

          <div className="ed-portfolio-grid" style={{ marginTop: "4rem" }}>
            {PORTFOLIO_ITEMS.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="ed-portfolio-item"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="ed-portfolio-overlay">
                  <span className="ed-portfolio-category">{item.category}</span>
                  <h3 className="ed-portfolio-title">{item.title}</h3>
                  <span className="ed-portfolio-location">{item.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="témoignages" className="ed-testimonials">
        <div className="ed-container">
          <div className="ed-testimonials-wrapper">
            <div className="ed-testimonials-intro">
              <span className="ed-testimonials-quote">&ldquo;</span>
              <h2 className="ed-testimonials-title">
                Ce que nos <em>clients</em> disent
              </h2>
              <p className="ed-testimonials-desc">
                La satisfaction de nos clients est notre plus grande fierté.
                Découvrez leurs témoignages.
              </p>
            </div>

            <div className="ed-testimonials-list">
              {TESTIMONIALS.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="ed-testimonial-card"
                >
                  <p className="ed-testimonial-content">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="ed-testimonial-footer">
                    <div className="ed-testimonial-author">
                      <div className="ed-testimonial-avatar">
                        {testimonial.author.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <span className="ed-testimonial-name">{testimonial.author}</span>
                        <span className="ed-testimonial-project">{testimonial.project}</span>
                      </div>
                    </div>
                    <div className="ed-testimonial-rating">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="ed-contact">
        <div className="ed-container">
          <div className="ed-contact-grid">
            <div className="ed-contact-info">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Parlons de votre <em>projet</em>
              </motion.h2>
              <p className="ed-contact-desc">
                Chaque projet commence par une conversation. Contactez-nous
                pour une consultation personnalisée et un devis détaillé
                sous 24 heures.
              </p>

              <div className="ed-contact-details">
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="ed-contact-item">
                  <Phone />
                  <span>{SITE_CONFIG.phone}</span>
                </a>
                <a href={`mailto:${SITE_CONFIG.email}`} className="ed-contact-item">
                  <Mail />
                  <span>{SITE_CONFIG.email}</span>
                </a>
                <div className="ed-contact-item">
                  <MapPin />
                  <span>{SITE_CONFIG.address}</span>
                </div>
              </div>
            </div>

            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="ed-contact-form"
              onSubmit={handleSubmit}
            >
              <div className="ed-form-row">
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="ed-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Votre email"
                  className="ed-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <input
                type="tel"
                placeholder="Votre téléphone"
                className="ed-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <select
                className="ed-input"
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              >
                <option value="">Type de projet</option>
                <option value="renovation">Rénovation intérieure</option>
                <option value="maconnerie">Maçonnerie</option>
                <option value="plomberie">Plomberie</option>
                <option value="electricite">Électricité</option>
                <option value="autre">Autre</option>
              </select>
              <textarea
                placeholder="Décrivez votre projet..."
                rows={4}
                className="ed-input"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
              <button
                type="submit"
                className="ed-btn-primary ed-btn-full"
                disabled={formStatus === "loading"}
              >
                {formStatus === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : formStatus === "success" ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Envoyé !</span>
                  </>
                ) : (
                  <>
                    <span>Envoyer ma demande</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              {formMessage && (
                <p className={`ed-form-message ${formStatus === "error" ? "ed-form-error" : "ed-form-success"}`}>
                  {formMessage}
                </p>
              )}
            </motion.form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ed-footer">
        <div className="ed-container">
          <div className="ed-footer-content">
            <div className="ed-footer-brand">
              <span className="ed-footer-logo">RA</span>
              <p className="ed-footer-tagline">
                L&apos;excellence au service de vos projets de rénovation.
              </p>
            </div>
            <div className="ed-footer-links">
              <a href="#services">Services</a>
              <a href="#portfolio">Portfolio</a>
              <a href="#témoignages">Témoignages</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div className="ed-footer-bottom">
            <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Tous droits réservés.</p>
            <div className="ed-footer-legal">
              <a href="/mentions-legales">Mentions légales</a>
              <span>•</span>
              <span>Artisan BTP — Île-de-France</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
