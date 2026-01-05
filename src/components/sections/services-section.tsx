"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import {
  Home,
  Droplets,
  Zap,
  Paintbrush,
  Grid3X3,
  Blocks,
  ArrowUpRight,
} from "lucide-react";
import { SERVICES } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Brick: Blocks,
  Droplets,
  Zap,
  Paintbrush,
  Grid3X3,
};

export function ServicesSection() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      id="services"
      className="section-large bg-[var(--ra-bg)] relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[var(--ra-orange)]/5 to-transparent" />
        <div className="absolute bottom-0 left-0 text-[20rem] font-[family-name:var(--font-bebas)] text-[var(--ra-bg-card)] leading-none select-none">
          SERVICES
        </div>
      </div>

      <div className="container-wide relative">
        {/* Section Header */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[2px] bg-[var(--ra-orange)]" />
              <span className="label">Nos expertises</span>
            </div>
            <h2 className="heading-1 text-[var(--ra-text)]">
              Un seul interlocuteur pour{" "}
              <span className="text-gradient">tous vos travaux</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-end"
          >
            <p className="text-lg text-[var(--ra-text-muted)] max-w-md">
              De la conception à la réalisation, nous vous accompagnons sur
              chaque étape de votre projet avec le même niveau d&apos;exigence.
            </p>
          </motion.div>
        </div>

        {/* Services Grid - Asymmetric */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1">
          {SERVICES.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <motion.a
                key={service.id}
                href="#contact"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className={`group relative p-8 lg:p-10 border border-[var(--ra-border)] bg-[var(--ra-bg-elevated)] hover:bg-[var(--ra-bg-card)] transition-all duration-500 overflow-hidden ${
                  index === 0 ? "lg:col-span-2 lg:row-span-2" : ""
                }`}
              >
                {/* Background Image */}
                {service.image && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}

                {/* Number */}
                <div className="absolute top-6 right-6 text-6xl font-[family-name:var(--font-bebas)] text-[var(--ra-border)] group-hover:text-[var(--ra-orange)]/20 transition-colors">
                  0{index + 1}
                </div>

                {/* Content */}
                <div
                  className={`relative ${index === 0 ? "lg:max-w-md" : ""}`}
                >
                  {/* Icon */}
                  <div className="w-14 h-14 mb-6 flex items-center justify-center border border-[var(--ra-border)] group-hover:border-[var(--ra-orange)] group-hover:bg-[var(--ra-orange)]/10 transition-all duration-500">
                    {Icon && (
                      <Icon className="w-6 h-6 text-[var(--ra-text-subtle)] group-hover:text-[var(--ra-orange)] transition-colors" />
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    className={`font-[family-name:var(--font-bebas)] text-[var(--ra-text)] mb-3 uppercase tracking-wide ${
                      index === 0 ? "text-4xl lg:text-5xl" : "text-2xl"
                    }`}
                  >
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[var(--ra-text-subtle)] group-hover:text-[var(--ra-text-muted)] transition-colors mb-6">
                    {service.description}
                  </p>

                  {/* Link */}
                  <div className="flex items-center gap-2 text-sm text-[var(--ra-orange)] opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <span className="uppercase tracking-wider">
                      Demander un devis
                    </span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Hover Line */}
                <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-[var(--ra-orange)] group-hover:w-full transition-all duration-500" />
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
