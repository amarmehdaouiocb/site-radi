"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, FormEvent } from "react";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Award,
  ChevronDown,
  Loader2,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import { SITE_CONFIG, SERVICES, PORTFOLIO_ITEMS, TESTIMONIALS } from "@/lib/constants";
import TrustedBy from "@/components/TrustedBy";
import "./gold.css";

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="gold-variant">
      {/* Header */}
      <header className="gold-header">
        <div className="gold-container">
          <a href="/" className="gold-logo">
            <div className="gold-logo-icon">
              <span>RA</span>
            </div>
            <div className="gold-logo-text">
              <span className="gold-logo-name">{SITE_CONFIG.name}</span>
              <span className="gold-logo-tagline">Excellence & Prestige</span>
            </div>
          </a>

          <nav className="gold-nav gold-nav-desktop">
            <a href="#services">Services</a>
            <a href="#realisations">Réalisations</a>
            <a href="#temoignages">Témoignages</a>
            <a href="#contact">Contact</a>
          </nav>

          <a href="#contact" className="gold-cta-button gold-cta-desktop">
            <span>Consultation Privée</span>
            <Sparkles className="w-4 h-4" />
          </a>

          {/* Mobile menu toggle */}
          <button
            className="gold-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              className="gold-mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
              <a href="#realisations" onClick={() => setMobileMenuOpen(false)}>Réalisations</a>
              <a href="#temoignages" onClick={() => setMobileMenuOpen(false)}>Témoignages</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
              <div className="gold-mobile-nav-ctas">
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="gold-mobile-call">
                  <Phone className="w-5 h-5" />
                  <span>Appeler</span>
                </a>
                <a href="#contact" className="gold-mobile-quote" onClick={() => setMobileMenuOpen(false)}>
                  <span>Devis gratuit</span>
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="gold-hero">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="gold-hero-bg">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
            alt="Luxury interior"
            fill
            priority
            className="object-cover"
          />
          <div className="gold-hero-overlay" />
        </motion.div>

        <div className="gold-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="gold-hero-badge"
          >
            <Award className="w-4 h-4" />
            <span>Artisan d&apos;Excellence depuis 15 ans</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="gold-hero-title"
          >
            L&apos;Art de
            <br />
            <span className="gold-text-gradient">Bâtir le Prestige</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="gold-hero-description"
          >
            Des réalisations d&apos;exception pour une clientèle exigeante.
            <br />
            Rénovation haut de gamme en Île-de-France.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="gold-hero-ctas"
          >
            <a href="#contact" className="gold-btn-primary">
              <span>Demander un Devis</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="gold-btn-secondary">
              <Phone className="w-5 h-5" />
              <span>{SITE_CONFIG.phone}</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="gold-hero-scroll"
          >
            <span>Découvrir</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </motion.div>
        </div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="gold-hero-stats"
        >
          {[
            { value: "15+", label: "Années" },
            { value: "500+", label: "Projets" },
            { value: "100%", label: "Satisfaction" },
          ].map((stat) => (
            <div key={stat.label} className="gold-stat">
              <span className="gold-stat-value">{stat.value}</span>
              <span className="gold-stat-label">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Trust Badges */}
      <section className="gold-trust">
        <div className="gold-container">
          <div className="gold-trust-grid">
            {[
              { icon: Shield, label: "Garantie Décennale", desc: "Protection totale" },
              { icon: Clock, label: "Réponse 24h", desc: "Réactivité garantie" },
              { icon: Award, label: "Artisan Certifié", desc: "Qualité premium" },
              { icon: Sparkles, label: "Finitions Luxe", desc: "Détails soignés" },
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

      {/* Services Section */}
      <section id="services" className="gold-services">
        <div className="gold-container">
          <div className="gold-section-header">
            <span className="gold-section-label">Nos Expertises</span>
            <h2 className="gold-section-title">
              Des Services <span className="gold-text-gradient">d&apos;Exception</span>
            </h2>
            <p className="gold-section-desc">
              Chaque projet est traité avec le plus grand soin,
              alliant savoir-faire traditionnel et techniques modernes.
            </p>
          </div>

          <div className="gold-services-grid">
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="gold-service-card"
              >
                <div className="gold-service-image">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                  <div className="gold-service-overlay" />
                </div>
                <div className="gold-service-content">
                  <span className="gold-service-number">0{index + 1}</span>
                  <h3 className="gold-service-title">{service.title}</h3>
                  <p className="gold-service-desc">{service.description}</p>
                  <a href="#contact" className="gold-service-link">
                    En savoir plus <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="realisations" className="gold-portfolio">
        <div className="gold-container">
          <div className="gold-section-header">
            <span className="gold-section-label">Portfolio</span>
            <h2 className="gold-section-title">
              Nos <span className="gold-text-gradient">Réalisations</span>
            </h2>
          </div>

          <div className="gold-portfolio-grid">
            {PORTFOLIO_ITEMS.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`gold-portfolio-item ${index === 0 ? "gold-portfolio-featured" : ""}`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="gold-portfolio-overlay">
                  <span className="gold-portfolio-category">{item.category}</span>
                  <h3 className="gold-portfolio-title">{item.title}</h3>
                  <span className="gold-portfolio-location">{item.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="temoignages" className="gold-testimonials">
        <div className="gold-container">
          <div className="gold-section-header">
            <span className="gold-section-label">Témoignages</span>
            <h2 className="gold-section-title">
              La Parole à Nos <span className="gold-text-gradient">Clients</span>
            </h2>
          </div>

          <div className="gold-testimonials-grid">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="gold-testimonial-card"
              >
                <div className="gold-testimonial-stars">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Sparkles key={i} className="w-4 h-4" />
                  ))}
                </div>
                <blockquote className="gold-testimonial-quote">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>
                <div className="gold-testimonial-author">
                  <div className="gold-testimonial-avatar">
                    {testimonial.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <span className="gold-testimonial-name">{testimonial.author}</span>
                    <span className="gold-testimonial-project">{testimonial.project}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <TrustedBy />

      {/* Contact Section */}
      <section id="contact" className="gold-contact">
        <div className="gold-container">
          <div className="gold-contact-grid">
            <div className="gold-contact-info">
              <span className="gold-section-label">Contact</span>
              <h2 className="gold-section-title">
                Parlons de Votre <span className="gold-text-gradient">Projet</span>
              </h2>
              <p className="gold-contact-desc">
                Bénéficiez d&apos;une consultation personnalisée et d&apos;un devis
                détaillé sous 24 heures.
              </p>

              <div className="gold-contact-details">
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="gold-contact-item">
                  <Phone className="w-5 h-5" />
                  <span>{SITE_CONFIG.phone}</span>
                </a>
                <a href={`mailto:${SITE_CONFIG.email}`} className="gold-contact-item">
                  <Mail className="w-5 h-5" />
                  <span>{SITE_CONFIG.email}</span>
                </a>
                <div className="gold-contact-item">
                  <MapPin className="w-5 h-5" />
                  <span>{SITE_CONFIG.address}</span>
                </div>
              </div>
            </div>

            <form className="gold-contact-form" onSubmit={handleSubmit}>
              <div className="gold-form-row">
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="gold-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Votre email"
                  className="gold-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <input
                type="tel"
                placeholder="Votre téléphone"
                className="gold-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <select
                className="gold-input"
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
                className="gold-input"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
              <button
                type="submit"
                className="gold-btn-primary gold-btn-full"
                disabled={formStatus === "loading"}
              >
                {formStatus === "loading" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : formStatus === "success" ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Envoyé !</span>
                  </>
                ) : (
                  <>
                    <span>Envoyer ma demande</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              {formMessage && (
                <p className={`gold-form-message ${formStatus === "error" ? "gold-form-error" : "gold-form-success"}`}>
                  {formMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="gold-footer">
        <div className="gold-container">
          <div className="gold-footer-content">
            <div className="gold-footer-brand">
              <div className="gold-logo">
                <div className="gold-logo-icon">
                  <span>RA</span>
                </div>
                <span className="gold-logo-name">{SITE_CONFIG.name}</span>
              </div>
              <p>L&apos;excellence au service de vos projets.</p>
            </div>
            <div className="gold-footer-links">
              <a href="#services">Services</a>
              <a href="#realisations">Réalisations</a>
              <a href="#temoignages">Témoignages</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div className="gold-footer-bottom">
            <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Tous droits réservés.</p>
            <div className="gold-footer-legal">
              <a href="/mentions-legales">Mentions légales</a>
              <span>•</span>
              <span>Artisan BTP — Île-de-France</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="gold-mobile-sticky-cta">
        <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="gold-sticky-call">
          <Phone className="w-5 h-5" />
          <span>Appeler</span>
        </a>
        <a href="#contact" className="gold-sticky-quote">
          <span>Devis gratuit</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
