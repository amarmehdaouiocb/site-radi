"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS, SERVICES } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--ra-bg-elevated)] relative overflow-hidden">
      {/* Top Accent Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--ra-orange)] to-transparent" />

      {/* Main Footer */}
      <div className="container-wide py-20 relative">
        {/* Background Element */}
        <div className="absolute bottom-0 right-0 text-[20rem] font-[family-name:var(--font-bebas)] text-[var(--ra-bg-card)] leading-none select-none opacity-30 pointer-events-none">
          RA
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 relative">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4"
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 bg-[var(--ra-orange)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[var(--ra-bg)] font-bold text-xl font-[family-name:var(--font-bebas)] tracking-wider">
                    RA
                  </span>
                </div>
              </div>
              <div>
                <span className="block text-[var(--ra-text)] font-semibold tracking-wide text-lg">
                  {SITE_CONFIG.name}
                </span>
                <span className="block text-xs text-[var(--ra-text-faint)] uppercase tracking-widest">
                  Artisan BTP
                </span>
              </div>
            </div>

            <p className="text-[var(--ra-text-subtle)] mb-8 max-w-xs leading-relaxed">
              Votre artisan de confiance pour tous vos travaux de rénovation et
              construction en Île-de-France.
            </p>

            {/* Certifications */}
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 border border-[var(--ra-border)] text-xs font-medium text-[var(--ra-text-subtle)] uppercase tracking-wider">
                Garantie Décennale
              </div>
              <div className="px-4 py-2 border border-[var(--ra-border)] text-xs font-medium text-[var(--ra-text-subtle)] uppercase tracking-wider">
                Assuré
              </div>
            </div>
          </motion.div>

          {/* Services Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <h4 className="font-[family-name:var(--font-bebas)] text-[var(--ra-text)] text-xl uppercase tracking-wide mb-6">
              Nos Services
            </h4>
            <ul className="space-y-4">
              {SERVICES.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <a
                    href="#services"
                    className="group inline-flex items-center gap-2 text-[var(--ra-text-subtle)] hover:text-[var(--ra-orange)] transition-colors"
                  >
                    <div className="w-1 h-1 bg-[var(--ra-text-faint)] group-hover:bg-[var(--ra-orange)] transition-colors" />
                    <span className="text-sm">{service.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h4 className="font-[family-name:var(--font-bebas)] text-[var(--ra-text)] text-xl uppercase tracking-wide mb-6">
              Navigation
            </h4>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-[var(--ra-text-subtle)] hover:text-[var(--ra-orange)] transition-colors"
                  >
                    <div className="w-1 h-1 bg-[var(--ra-text-faint)] group-hover:bg-[var(--ra-orange)] transition-colors" />
                    <span className="text-sm">{link.label}</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#"
                  className="group inline-flex items-center gap-2 text-[var(--ra-text-subtle)] hover:text-[var(--ra-orange)] transition-colors"
                >
                  <div className="w-1 h-1 bg-[var(--ra-text-faint)] group-hover:bg-[var(--ra-orange)] transition-colors" />
                  <span className="text-sm">Mentions légales</span>
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <h4 className="font-[family-name:var(--font-bebas)] text-[var(--ra-text)] text-xl uppercase tracking-wide mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                  className="group flex items-center gap-3 text-[var(--ra-text-subtle)] hover:text-[var(--ra-orange)] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{SITE_CONFIG.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="group flex items-center gap-3 text-[var(--ra-text-subtle)] hover:text-[var(--ra-orange)] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{SITE_CONFIG.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-[var(--ra-text-subtle)]">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{SITE_CONFIG.address}</span>
              </li>
            </ul>

            {/* CTA */}
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 mt-8 px-6 py-3 bg-[var(--ra-orange)] text-[var(--ra-bg)] font-semibold uppercase tracking-wider text-xs hover:bg-[var(--ra-orange-light)] transition-colors"
            >
              <span>Devis gratuit</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--ra-border)]">
        <div className="container-wide py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[var(--ra-text-faint)] text-xs uppercase tracking-wider">
            &copy; {currentYear} {SITE_CONFIG.name}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[var(--ra-text-faint)] text-xs">
              Artisan Multi-Services BTP
            </span>
            <div className="w-1 h-1 bg-[var(--ra-orange)]" />
            <span className="text-[var(--ra-text-faint)] text-xs">Île-de-France</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
