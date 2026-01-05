"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Plus } from "lucide-react";
import { PORTFOLIO_ITEMS } from "@/lib/constants";

export function PortfolioSection() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Masonry-style sizes for visual interest
  const getSizeClass = (index: number) => {
    const patterns = [
      "md:col-span-2 md:row-span-2", // Large
      "md:col-span-1 md:row-span-1", // Small
      "md:col-span-1 md:row-span-2", // Tall
      "md:col-span-1 md:row-span-1", // Small
      "md:col-span-2 md:row-span-1", // Wide
      "md:col-span-1 md:row-span-1", // Small
    ];
    return patterns[index % patterns.length];
  };

  return (
    <section
      ref={containerRef}
      id="portfolio"
      className="section-large bg-[var(--ra-bg-elevated)] relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--ra-orange)]/30 to-transparent" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-[var(--ra-bg-card)]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(var(--ra-text) 1px, transparent 1px), linear-gradient(90deg, var(--ra-text) 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <div className="container-wide relative">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[2px] bg-[var(--ra-orange)]" />
              <span className="label">Portfolio</span>
            </div>
            <h2 className="heading-1 text-[var(--ra-text)]">
              Nos <span className="text-gradient">réalisations</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-[var(--ra-text-subtle)] max-w-md">
              Chaque projet est unique. Découvrez nos réalisations et imaginez
              ce que nous pourrions accomplir ensemble.
            </p>
          </motion.div>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 auto-rows-[200px] md:auto-rows-[250px]">
          {PORTFOLIO_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`group relative cursor-pointer overflow-hidden ${getSizeClass(
                index
              )}`}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--ra-bg)] via-[var(--ra-bg)]/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Orange accent line */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-[var(--ra-orange)]"
                initial={{ width: 0 }}
                animate={{ width: hoveredId === item.id ? "100%" : "0%" }}
                transition={{ duration: 0.5 }}
              />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                {/* Category */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: hoveredId === item.id ? 1 : 0.6,
                    y: hoveredId === item.id ? 0 : 10,
                  }}
                  transition={{ duration: 0.3 }}
                  className="mb-2"
                >
                  <span className="text-[var(--ra-orange)] text-sm uppercase tracking-wider font-medium">
                    {item.category}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h3
                  className="font-[family-name:var(--font-bebas)] text-[var(--ra-text)] text-2xl md:text-3xl uppercase tracking-wide mb-2"
                  animate={{
                    y: hoveredId === item.id ? 0 : 10,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {item.title}
                </motion.h3>

                {/* Location */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === item.id ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-[var(--ra-text-subtle)] text-sm mb-4"
                >
                  {item.location}
                </motion.p>

                {/* CTA */}
                <motion.a
                  href="#contact"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: hoveredId === item.id ? 1 : 0,
                    x: hoveredId === item.id ? 0 : -10,
                  }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="inline-flex items-center gap-2 text-[var(--ra-orange)] text-sm uppercase tracking-wider"
                >
                  <span>Projet similaire</span>
                  <ArrowUpRight className="w-4 h-4" />
                </motion.a>
              </div>

              {/* Corner accent */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 border border-[var(--ra-orange)] flex items-center justify-center">
                  <Plus className="w-4 h-4 text-[var(--ra-orange)]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-4 text-[var(--ra-text)] hover:text-[var(--ra-orange)] transition-colors"
          >
            <span className="text-lg">Vous avez un projet similaire ?</span>
            <div className="w-12 h-12 border border-[var(--ra-border)] group-hover:border-[var(--ra-orange)] flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
