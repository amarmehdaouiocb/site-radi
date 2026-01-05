"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Phone } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";
import { SITE_CONFIG, IMAGES } from "@/lib/constants";

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--ra-bg)]"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <motion.div style={{ y }} className="absolute inset-0">
          {/* Hero Background Image */}
          <Image
            src={IMAGES.hero}
            alt={IMAGES.heroAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--ra-bg)]/70 via-[var(--ra-bg)]/50 to-[var(--ra-bg)] z-10" />
          {/* Grain texture */}
          <div
            className="absolute inset-0 z-20 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          {/* Geometric shapes */}
          <div className="absolute inset-0 z-5">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 border border-[var(--ra-orange)]/20 rotate-45" />
            <div className="absolute bottom-1/3 left-1/3 w-64 h-64 border border-[var(--ra-orange)]/10 rotate-12" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[var(--ra-border)] rounded-full"
            />
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-30 container-wide">
        <div className="max-w-6xl">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-12 h-[2px] bg-[var(--ra-orange)]" />
            <span className="label">Artisan BTP depuis 15 ans</span>
          </motion.div>

          {/* Main Headline - Massive Typography */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="display-large text-[var(--ra-text)]"
            >
              Construisons
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="display-large"
            >
              <span className="text-gradient">votre projet</span>
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-12">
            <motion.h1
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="display-large text-[var(--ra-text)]"
            >
              ensemble
            </motion.h1>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-xl text-[var(--ra-text-muted)] max-w-xl mb-12 leading-relaxed"
          >
            {SITE_CONFIG.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-wrap items-center gap-6"
          >
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[var(--ra-orange)] text-[var(--ra-bg)] font-semibold uppercase tracking-wider text-sm overflow-hidden transition-all hover:pr-12"
            >
              <span className="relative z-10">Devis gratuit</span>
              <ArrowDown className="w-4 h-4 rotate-[-90deg] absolute right-4 opacity-0 group-hover:opacity-100 transition-all" />
              <div className="absolute inset-0 bg-[var(--ra-orange-light)] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>

            <a
              href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
              className="group flex items-center gap-3 text-[var(--ra-text)] hover:text-[var(--ra-orange)] transition-colors"
            >
              <div className="w-12 h-12 rounded-full border border-[var(--ra-border)] flex items-center justify-center group-hover:border-[var(--ra-orange)] transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs text-[var(--ra-text-subtle)] uppercase tracking-wider">
                  Appelez-nous
                </span>
                <span className="font-semibold">{SITE_CONFIG.phone}</span>
              </div>
            </a>
          </motion.div>
        </div>

        {/* Stats - Bottom Right */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="absolute bottom-0 right-0 hidden lg:flex items-end gap-16"
        >
          {[
            { number: "15+", label: "Ans d'expérience" },
            { number: "500+", label: "Projets réalisés" },
            { number: "100%", label: "Clients satisfaits" },
          ].map((stat) => (
            <div key={stat.label} className="text-right">
              <div className="text-6xl font-bold text-[var(--ra-orange)] font-[family-name:var(--font-bebas)]">
                {stat.number}
              </div>
              <div className="text-xs text-[var(--ra-text-subtle)] uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-[var(--ra-text-subtle)] uppercase tracking-widest">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown className="w-4 h-4 text-[var(--ra-orange)]" />
        </motion.div>
      </motion.div>

      {/* Side Text */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:block">
        <div className="transform -rotate-90 origin-center whitespace-nowrap text-xs text-[var(--ra-text-faint)] uppercase tracking-[0.3em]">
          RA Solution — Île-de-France
        </div>
      </div>
    </section>
  );
}
