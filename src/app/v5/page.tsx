"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Star,
} from "lucide-react";
import { SITE_CONFIG, SERVICES, PORTFOLIO_ITEMS, TESTIMONIALS } from "@/lib/constants";
import "./minimal.css";

export default function MinimalVariant() {
  return (
    <div className="minimal-variant">
      {/* Header */}
      <header className="mn-header">
        <div className="mn-header-inner">
          <a href="/v5" className="mn-logo">
            RA<span>.</span>Solution
          </a>

          <nav className="mn-nav">
            <a href="#services">Services</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#témoignages">Témoignages</a>
            <a href="#contact">Contact</a>
          </nav>

          <a href="#contact" className="mn-header-cta">
            Demander un devis
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mn-hero">
        <div className="mn-container">
          <div className="mn-hero-content">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mn-hero-label"
            >
              Artisan BTP · Île-de-France · Depuis 2009
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mn-hero-title"
            >
              L&apos;art de créer
              <br />
              des espaces <em>uniques</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mn-hero-desc"
            >
              Nous transformons vos intérieurs avec un savoir-faire artisanal,
              alliant tradition et modernité pour des réalisations d&apos;exception.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mn-hero-ctas"
            >
              <a href="#contact" className="mn-btn-primary">
                <span>Commencer un projet</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#portfolio" className="mn-btn-secondary">
                <span>Voir nos réalisations</span>
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mn-hero-image"
          >
            <Image
              src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80"
              alt="Intérieur minimaliste"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="mn-stats">
        <div className="mn-container">
          <div className="mn-stats-grid">
            {[
              { value: "15+", label: "Années d'expérience" },
              { value: "500+", label: "Projets réalisés" },
              { value: "100%", label: "Clients satisfaits" },
              { value: "24h", label: "Réponse garantie" },
            ].map((stat) => (
              <div key={stat.label}>
                <span className="mn-stat-value">{stat.value}</span>
                <span className="mn-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="mn-services">
        <div className="mn-container">
          <div className="mn-section-header">
            <span className="mn-section-label">Nos Services</span>
            <h2 className="mn-section-title">
              Ce que nous <em>faisons</em>
            </h2>
          </div>

          <div className="mn-services-grid">
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="mn-service-card"
              >
                <span className="mn-service-number">{index + 1}</span>
                <div className="mn-service-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a href="#contact" className="mn-service-link">
                    En savoir plus <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="mn-portfolio">
        <div className="mn-container">
          <div className="mn-section-header">
            <span className="mn-section-label">Portfolio</span>
            <h2 className="mn-section-title">
              Nos <em>réalisations</em>
            </h2>
          </div>

          <div className="mn-portfolio-grid">
            {PORTFOLIO_ITEMS.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="mn-portfolio-item"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="mn-portfolio-overlay">
                  <span className="mn-portfolio-category">{item.category}</span>
                  <h3 className="mn-portfolio-title">{item.title}</h3>
                  <span className="mn-portfolio-location">{item.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="mn-quote">
        <div className="mn-container-sm">
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mn-quote-content"
          >
            &ldquo;Chaque projet est une histoire unique que nous écrivons
            ensemble, avec passion et précision.&rdquo;
          </motion.blockquote>
          <span className="mn-quote-author">— L&apos;équipe RA Solution</span>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="témoignages" className="mn-testimonials">
        <div className="mn-container">
          <div className="mn-section-header">
            <span className="mn-section-label">Témoignages</span>
            <h2 className="mn-section-title">
              Ce qu&apos;ils <em>disent</em>
            </h2>
          </div>

          <div className="mn-testimonials-grid">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="mn-testimonial-card"
              >
                <p className="mn-testimonial-content">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="mn-testimonial-author">
                  <div className="mn-testimonial-avatar">
                    {testimonial.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="mn-testimonial-info">
                    <span className="mn-testimonial-name">{testimonial.author}</span>
                    <span className="mn-testimonial-project">{testimonial.project}</span>
                    <div className="mn-testimonial-rating">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} />
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
      <section id="contact" className="mn-contact">
        <div className="mn-container">
          <div className="mn-contact-grid">
            <div className="mn-contact-info">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Parlons de votre <em>projet</em>
              </motion.h2>
              <p className="mn-contact-desc">
                Prenons le temps d&apos;échanger sur vos envies et vos besoins.
                Nous vous accompagnons de la conception à la réalisation.
              </p>

              <div className="mn-contact-details">
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="mn-contact-item">
                  <Phone />
                  <span>{SITE_CONFIG.phone}</span>
                </a>
                <a href={`mailto:${SITE_CONFIG.email}`} className="mn-contact-item">
                  <Mail />
                  <span>{SITE_CONFIG.email}</span>
                </a>
                <div className="mn-contact-item">
                  <MapPin />
                  <span>{SITE_CONFIG.address}</span>
                </div>
              </div>
            </div>

            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mn-contact-form"
            >
              <div className="mn-form-row">
                <input type="text" placeholder="Votre nom" className="mn-input" />
                <input type="email" placeholder="Votre email" className="mn-input" />
              </div>
              <input type="tel" placeholder="Votre téléphone" className="mn-input" />
              <select className="mn-input">
                <option value="">Type de projet</option>
                <option value="renovation">Rénovation intérieure</option>
                <option value="maconnerie">Maçonnerie</option>
                <option value="plomberie">Plomberie</option>
                <option value="electricite">Électricité</option>
                <option value="autre">Autre</option>
              </select>
              <textarea placeholder="Décrivez votre projet..." rows={4} className="mn-input" />
              <button type="submit" className="mn-btn-primary mn-btn-full">
                <span>Envoyer ma demande</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mn-footer">
        <div className="mn-container">
          <div className="mn-footer-content">
            <div className="mn-footer-brand">
              <span className="mn-footer-logo">RA<span>.</span>Solution</span>
              <p className="mn-footer-tagline">
                L&apos;excellence au service de vos projets.
              </p>
            </div>
            <div className="mn-footer-links">
              <a href="#services">Services</a>
              <a href="#portfolio">Portfolio</a>
              <a href="#témoignages">Témoignages</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div className="mn-footer-bottom">
            <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Tous droits réservés.</p>
            <p>Artisan BTP — Île-de-France</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
