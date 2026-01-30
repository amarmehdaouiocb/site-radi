"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
// Its Hover animated icons
import PhoneVolume from "@/components/ui/phone-volume";
import MailFilledIcon from "@/components/ui/mail-filled-icon";
import ArrowNarrowRightIcon from "@/components/ui/arrow-narrow-right-icon";
import ArrowNarrowUpIcon from "@/components/ui/arrow-narrow-up-icon";
import SparklesIcon from "@/components/ui/sparkles-icon";
import ShieldCheck from "@/components/ui/shield-check";
import ClockIcon from "@/components/ui/clock-icon";
import StarIcon from "@/components/ui/star-icon";
import DownChevron from "@/components/ui/down-chevron";
import MenuIcon from "@/components/ui/menu-icon";
import XIcon from "@/components/ui/x-icon";
import FileDescriptionIcon from "@/components/ui/file-description-icon";
import GlobeIcon from "@/components/ui/globe-icon";
import CurrencyEuroIcon from "@/components/ui/currency-euro-icon";
// Phosphor fallback for icons not in Its Hover
import { Ruler, Calendar } from "@phosphor-icons/react";
import { SITE_CONFIG, SERVICES, PORTFOLIO_ITEMS, TESTIMONIALS, HERO_GALLERY } from "@/lib/constants";
import { ThemeToggle } from "@/components/ThemeToggle";

// Alt tags descriptifs pour les images du marquee hero
const HERO_GALLERY_ALTS = [
  "Terrasse travertin réalisée par RA Bâtiment",
  "Salle de bain marbre luxe - rénovation complète",
  "Aménagement de combles avec velux",
  "Terrasse bois avec barbecue intégré",
  "Cuisine design moderne - aménagement sur mesure",
];
import { trackCtaClick, trackPhoneClick, trackPortfolioFilter } from "@/lib/analytics";
import TrustedBy from "@/components/TrustedBy";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import QuoteForm from "@/components/QuoteForm";
import "./gold.css";

// Helper function to format budget
const formatBudget = (min: number, max: number) => {
  const formatK = (n: number) => n >= 1000 ? `${Math.round(n / 1000)}k` : n.toString();
  return `${formatK(min)} - ${formatK(max)}€`;
};

// Get portfolio items with before/after images
const beforeAfterItems = PORTFOLIO_ITEMS.filter(item => item.beforeImage);

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  // UI state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portfolioFilter, setPortfolioFilter] = useState<string>("Tous");
  const [hideStickyCta, setHideStickyCta] = useState(false);
  const [showDesktopCta, setShowDesktopCta] = useState(false);

  // Handle scroll for sticky CTAs
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollingDown = currentScrollY > lastScrollY;
          const scrolledPastThreshold = currentScrollY > 300;

          // Hide mobile CTA when scrolling down and past threshold
          setHideStickyCta(scrollingDown && scrolledPastThreshold);

          // Show desktop CTA when scrolled past threshold
          setShowDesktopCta(scrolledPastThreshold);

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top on page load (prevent browser scroll restoration) unless there's a hash
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  // Get unique categories for filter
  const portfolioCategories = ["Tous", ...Array.from(new Set(PORTFOLIO_ITEMS.map(item => item.category)))];
  const filteredPortfolio = portfolioFilter === "Tous"
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter(item => item.category === portfolioFilter);

  return (
    <div className="gold-variant">
      {/* Header */}
      <header className="gold-header">
        <div className="gold-container">
          <a href="/" className="gold-logo">
            <Image
              src="/logos/ra-batiment/svg/noBgColor.svg"
              alt="RA Bâtiment"
              width={360}
              height={120}
              className="gold-logo-img"
            />
          </a>

          <nav className="gold-nav gold-nav-desktop">
            <a href="#realisations">Réalisations</a>
            <a href="#temoignages">Témoignages</a>
            <a href="#contact">Contact</a>
          </nav>

          <a
            href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
            className="gold-header-phone"
            onClick={() => trackPhoneClick("header")}
          >
            <PhoneVolume size={16} />
            <span>{SITE_CONFIG.phone}</span>
          </a>
          <ThemeToggle />
          <div className="gold-header-cta-group">
            <a
              href="#contact"
              className="gold-cta-button gold-cta-desktop"
              onClick={() => trackCtaClick("devis_gratuit", "header")}
            >
              <span>Devis Gratuit 24h</span>
              <ArrowNarrowRightIcon size={16} />
            </a>
            <span className="gold-header-badge">Réponse garantie</span>
          </div>

          {/* Mobile: theme toggle + menu toggle grouped */}
          <div className="gold-mobile-actions">
            <ThemeToggle />
            <button
              className="gold-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
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
              <a href="#realisations" onClick={() => setMobileMenuOpen(false)}>Réalisations</a>
              <a href="#temoignages" onClick={() => setMobileMenuOpen(false)}>Témoignages</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
              <div className="gold-mobile-nav-ctas">
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="gold-mobile-call">
                  <PhoneVolume size={20} />
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
            alt="Intérieur rénové de standing - RA Bâtiment artisan BTP"
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
            <StarIcon size={16} />
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
            Rénovation clé en main • Devis sous 24h • Garantie décennale
            <br />
            <span style={{ opacity: 0.8 }}>Artisan certifié en Île-de-France</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="gold-hero-ctas"
          >
            <a
              href="#contact"
              className="gold-btn-primary"
              onClick={() => trackCtaClick("demander_devis", "hero")}
            >
              <span>Demander un Devis</span>
              <ArrowNarrowRightIcon size={20} />
            </a>
            <a
              href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
              className="gold-btn-secondary"
              onClick={() => trackPhoneClick("hero")}
            >
              <PhoneVolume size={20} />
              <span>{SITE_CONFIG.phone}</span>
            </a>
          </motion.div>

          {/* Mobile Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="gold-hero-stats-mobile"
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="gold-hero-scroll"
          >
            <span>Découvrir</span>
            <DownChevron size={20} className="animate-bounce" />
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

        {/* Hero Marquee Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="hero-marquee"
        >
          <div className="hero-marquee-track">
            {[...HERO_GALLERY, ...HERO_GALLERY].map((src, i) => (
              <div key={i} className="hero-marquee-item">
                <Image
                  src={src}
                  alt={HERO_GALLERY_ALTS[i % HERO_GALLERY.length]}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 380px, 550px"
                />
                <div className="hero-marquee-item-overlay" />
              </div>
            ))}
          </div>
        </motion.div>

        </section>

      {/* Réalisations Section - Before/After + Portfolio */}
      <section id="realisations" className="gold-portfolio">
        <div className="gold-container">
          <div className="gold-section-header">
            <span className="gold-section-label">Portfolio</span>
            <h2 className="gold-section-title">
              Nos <span className="gold-text-gradient">Réalisations</span>
            </h2>
            <p className="gold-section-desc">
              Découvrez nos transformations et projets réalisés en Île-de-France
            </p>
          </div>

          {/* Before/After Showcase - Impact visuel en premier */}
          {beforeAfterItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="gold-testimonials-showcase"
              style={{ marginBottom: "4rem" }}
            >
              <div className="gold-showcase-header">
                <h3 className="gold-showcase-title">
                  La Preuve en <span className="gold-text-gradient">Images</span>
                </h3>
                <p className="gold-showcase-subtitle">
                  Glissez pour comparer avant/après
                </p>
              </div>
              <div className="gold-showcase-grid">
                {beforeAfterItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="gold-showcase-item"
                  >
                    <BeforeAfterSlider
                      beforeImage={item.beforeImage!}
                      afterImage={item.image}
                    />
                    <p className="gold-showcase-item-title">
                      <strong>{item.title}</strong> • {item.location}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Portfolio Grid */}
          <div className="gold-portfolio-filters">
            {portfolioCategories.map((category) => (
              <button
                key={category}
                className={`gold-portfolio-filter ${portfolioFilter === category ? "active" : ""}`}
                onClick={() => {
                  setPortfolioFilter(category);
                  trackPortfolioFilter(category);
                }}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="gold-portfolio-grid">
            {filteredPortfolio.map((item, index) => (
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
                  {item.surface && item.duration && (
                    <div className="gold-portfolio-data">
                      <span className="gold-portfolio-badge gold-portfolio-badge-surface">
                        <Ruler />
                        {item.surface} m²
                      </span>
                      <span className="gold-portfolio-badge gold-portfolio-badge-duration">
                        <Calendar />
                        {item.duration} sem.
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="gold-portfolio-cta">
            <a href="#contact" className="gold-btn-secondary">
              <span>Demander un devis pour votre projet</span>
              <ArrowNarrowRightIcon size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="gold-trust">
        <div className="gold-container">
          <div className="gold-trust-grid">
            <div className="gold-trust-item">
              <div className="gold-trust-icon">
                <ShieldCheck size={24} />
              </div>
              <div>
                <span className="gold-trust-label">Garantie Décennale</span>
                <span className="gold-trust-desc">Protection totale</span>
              </div>
            </div>
            <div className="gold-trust-item">
              <div className="gold-trust-icon">
                <ClockIcon size={24} />
              </div>
              <div>
                <span className="gold-trust-label">Devis Gratuit</span>
                <span className="gold-trust-desc">Sans engagement</span>
              </div>
            </div>
            <div className="gold-trust-item">
              <div className="gold-trust-icon">
                <StarIcon size={24} />
              </div>
              <div>
                <span className="gold-trust-label">Assurance RC Pro</span>
                <span className="gold-trust-desc">Couverture complète</span>
              </div>
            </div>
            <div className="gold-trust-item">
              <div className="gold-trust-icon">
                <SparklesIcon size={24} />
              </div>
              <div>
                <span className="gold-trust-label">Réponse 24h</span>
                <span className="gold-trust-desc">Réactivité garantie</span>
              </div>
            </div>
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

          <div className="gold-quote-icon">"</div>

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
                    <SparklesIcon key={i} size={16} />
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
                    <span className="gold-testimonial-project">{testimonial.project} • {testimonial.date}</span>
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
          {/* Header with contact info */}
          <div className="gold-contact-header">
            <div className="gold-section-header">
              <span className="gold-section-label">Demande de Devis</span>
              <h2 className="gold-section-title">
                Parlons de Votre <span className="gold-text-gradient">Projet</span>
              </h2>
              <p className="gold-contact-desc" style={{ maxWidth: "600px", margin: "0 auto" }}>
                Qualifiez votre besoin en quelques clics et recevez un devis personnalisé sous 24 heures.
              </p>
            </div>

            <div className="gold-contact-details-row">
              <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="gold-contact-item" onClick={() => trackPhoneClick("contact_section")}>
                <PhoneVolume size={20} />
                <span>{SITE_CONFIG.phone}</span>
              </a>
              <a href={`mailto:${SITE_CONFIG.email}`} className="gold-contact-item">
                <MailFilledIcon size={20} />
                <span>{SITE_CONFIG.email}</span>
              </a>
              <div className="gold-contact-item">
                <GlobeIcon size={20} />
                <span>{SITE_CONFIG.address}</span>
              </div>
            </div>
          </div>

          {/* Quote Form */}
          <QuoteForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="gold-footer">
        <div className="gold-container">
          <div className="gold-footer-content">
            <div className="gold-footer-brand">
              <div className="gold-logo">
                <Image
                  src="/logos/ra-batiment/svg/noBgColor.svg"
                  alt="RA Bâtiment"
                  width={120}
                  height={120}
                  className="gold-logo-img"
                />
              </div>
              <p>L&apos;excellence au service de vos projets.</p>
              <div className="gold-footer-socials">
                <a href={SITE_CONFIG.socials.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
                </a>
                <a href={SITE_CONFIG.socials.snapchat.url} target="_blank" rel="noopener noreferrer" aria-label="Snapchat">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.206 1c.645.008 3.16.088 4.654 2.276.893 1.307 1.072 3.267 1.02 4.468l-.002.065c.012.088.071.196.222.258.118.048.252.072.382.072.168 0 .338-.045.426-.082a.87.87 0 01.328-.066c.376 0 .748.236.748.577 0 .534-.924.862-1.336.99l-.068.022c-.205.065-.394.125-.445.202-.074.112-.01.312.037.45l.016.04c.516 1.266.994 1.868 1.688 2.13.248.094.44.14.596.178.296.074.492.122.492.39 0 .312-.39.504-.774.618-.13.038-.536.116-.572.124-. 258.054-.482.134-.668.306-.224.208-.292.51-.328.688l-.008.038c-.024.126-.044.234-.174.234a2.52 2.52 0 01-.358-.054 4.586 4.586 0 00-.96-.106c-.254 0-.482.026-.698.08-.408.1-.742.33-1.094.576-.626.434-1.334.926-2.676.956h-.076c-1.342-.03-2.05-.522-2.676-.956-.352-.246-.686-.476-1.094-.576a3.01 3.01 0 00-.698-.08c-.368 0-.702.06-.96.106a2.52 2.52 0 01-.358.054c-.13 0-.15-.108-.174-.234l-.008-.038c-.036-.178-.104-.48-.328-.688-.186-.172-.41-.252-.668-.306-.036-.008-.442-.086-.572-.124-.384-.114-.774-.306-.774-.618 0-.268.196-.316.492-.39.156-.038.348-.084.596-.178.694-.262 1.172-.864 1.688-2.13l.016-.04c.047-.138.111-.338.037-.45-.051-.077-.24-.137-.445-.202l-.068-.022c-.412-.128-1.336-.456-1.336-.99 0-.341.372-.577.748-.577a.87.87 0 01.328.066c.088.037.258.082.426.082.13 0 .264-.024.382-.072.151-.062.21-.17.222-.258l-.002-.065c-.052-1.201.127-3.161 1.02-4.468C9.04 1.088 11.554 1.008 12.2 1h.006z"/></svg>
                </a>
              </div>
            </div>
            <div className="gold-footer-links">
              <a href="#realisations">Réalisations</a>
              <a href="#temoignages">Témoignages</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div className="gold-footer-info">
            <span>{SITE_CONFIG.hours}</span>
            <span>•</span>
            <span>Zone : Île-de-France</span>
          </div>
          <div className="gold-footer-bottom">
            <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Tous droits réservés.</p>
            <div className="gold-footer-legal">
              <a href="/mentions-legales">Mentions légales</a>
              <span>•</span>
              <span>SIRET : {SITE_CONFIG.siret}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className={`gold-mobile-sticky-cta ${hideStickyCta ? "gold-sticky-hidden" : ""}`}>
        <a
          href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
          className="gold-sticky-call"
          onClick={() => trackPhoneClick("sticky_mobile")}
        >
          <PhoneVolume size={20} />
          <span>Appeler</span>
        </a>
        <a
          href="#contact"
          className="gold-sticky-quote"
          onClick={() => trackCtaClick("devis_gratuit", "sticky_mobile")}
        >
          <span>Devis gratuit</span>
          <ArrowNarrowRightIcon size={16} />
        </a>
      </div>

      {/* Desktop Sticky CTA - bottom right */}
      <div className={`gold-desktop-sticky ${showDesktopCta ? "" : "gold-sticky-hidden"}`}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="gold-back-to-top"
          aria-label="Retour en haut"
        >
          <ArrowNarrowUpIcon size={20} />
        </button>
        <a
          href="#contact"
          className="gold-sticky-cta-desktop"
          onClick={() => trackCtaClick("devis_gratuit", "sticky_desktop")}
        >
          <FileDescriptionIcon size={18} />
          <span>Devis Gratuit</span>
        </a>
      </div>
    </div>
  );
}
