"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-[var(--ra-bg)]/90 backdrop-blur-xl py-4 border-b border-[var(--ra-border)]"
          : "bg-transparent py-6"
      )}
    >
      <div className="container-wide flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 bg-[var(--ra-orange)] transition-transform duration-300 group-hover:rotate-45" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[var(--ra-bg)] font-bold text-xl font-[family-name:var(--font-bebas)] tracking-wider">
                RA
              </span>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="block text-[var(--ra-text)] font-semibold tracking-wide">
              {SITE_CONFIG.name}
            </span>
            <span className="block text-xs text-[var(--ra-text-subtle)] uppercase tracking-widest">
              Artisan BTP
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-12">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm text-[var(--ra-text-muted)] hover:text-[var(--ra-text)] uppercase tracking-wider transition-colors group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--ra-orange)] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* CTA & Theme Toggle */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />
          <a
            href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 text-[var(--ra-text-muted)] hover:text-[var(--ra-orange)] transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm">{SITE_CONFIG.phone}</span>
          </a>
          <a
            href="#contact"
            className="px-6 py-3 bg-[var(--ra-orange)] text-[var(--ra-bg)] text-sm font-semibold uppercase tracking-wider hover:bg-[var(--ra-orange-light)] transition-colors"
          >
            Devis gratuit
          </a>
        </div>

        {/* Mobile: Theme Toggle & Menu Button */}
        <div className="lg:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            className="p-2 text-[var(--ra-text)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[var(--ra-bg)] border-t border-[var(--ra-border)]"
          >
            <nav className="container-wide py-8 flex flex-col gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-2xl text-[var(--ra-text)] font-[family-name:var(--font-bebas)] uppercase tracking-wider hover:text-[var(--ra-orange)] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="pt-6 mt-6 border-t border-[var(--ra-border)]">
                <a
                  href="#contact"
                  className="block w-full py-4 bg-[var(--ra-orange)] text-[var(--ra-bg)] text-center font-semibold uppercase tracking-wider"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Demander un devis
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
