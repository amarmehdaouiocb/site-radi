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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>
                </a>
                <a href={SITE_CONFIG.socials.snapchat.url} target="_blank" rel="noopener noreferrer" aria-label="Snapchat">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.922-.214.04-.012.06-.012.08-.012.16 0 .36.075.42.207.088.18.064.36-.012.42-.18.12-.48.225-.767.337-.39.135-.873.315-1.22.62a2.74 2.74 0 00-.18.182l-.006.009c.06.135.18.404.33.675.63 1.17 1.434 1.875 2.092 2.168.36.15.552.225.552.405 0 .21-.24.353-.39.405-.42.135-1.02.255-1.32.33-.12.03-.18.12-.18.24 0 .01-.017.158-.017.27 0 .18-.135.39-.494.39-.18 0-.42-.044-.66-.104a5.22 5.22 0 00-1.123-.142c-.285 0-.57.03-.827.09-.467.12-.855.42-1.305.72-.57.39-1.2.87-2.295.93H12a.09.09 0 01-.013 0c-1.096-.06-1.725-.54-2.295-.93-.45-.3-.84-.6-1.305-.72a3.27 3.27 0 00-.825-.09c-.42 0-.81.06-1.125.142-.24.06-.48.104-.66.104-.36 0-.494-.21-.494-.39 0-.112-.017-.26-.017-.27 0-.12-.06-.21-.18-.24-.3-.075-.9-.195-1.32-.33-.15-.052-.39-.195-.39-.405 0-.18.192-.255.552-.405.66-.293 1.464-.998 2.092-2.168.15-.27.27-.54.33-.675l-.006-.009a2.716 2.716 0 00-.18-.18c-.347-.307-.83-.487-1.22-.622-.285-.112-.585-.225-.765-.337-.075-.06-.1-.24-.012-.42.06-.132.24-.207.42-.207.02 0 .04 0 .08.012.263.094.622.198.921.214.2 0 .327-.045.403-.091-.01-.165-.02-.33-.03-.51l-.003-.06c-.105-1.628-.23-3.654.3-4.847C5.848 1.069 9.204.793 10.193.793h2.013z"/></svg>
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
