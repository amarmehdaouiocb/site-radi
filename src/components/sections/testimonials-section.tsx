"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";

export function TestimonialsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      id="testimonials"
      className="section-large bg-[var(--ra-bg)] relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large quote mark */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 text-[40rem] leading-none font-serif text-[var(--ra-bg-card)] select-none opacity-50">
          &ldquo;
        </div>
        {/* Diagonal line */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[var(--ra-border)] to-transparent transform rotate-12 translate-x-40" />
      </div>

      <div className="container-wide relative">
        {/* Section Header - Editorial Style */}
        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[2px] bg-[var(--ra-orange)]" />
              <span className="label">Témoignages</span>
            </div>
            <h2 className="heading-1 text-[var(--ra-text)]">
              Ils nous ont{" "}
              <span className="text-gradient">fait confiance</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 lg:col-start-8 flex items-end"
          >
            <div>
              <p className="text-[var(--ra-text-muted)] text-lg mb-6">
                La satisfaction de nos clients est notre meilleure carte de
                visite. Découvrez leurs retours d&apos;expérience.
              </p>
              {/* Stats */}
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-4xl font-[family-name:var(--font-bebas)] text-[var(--ra-orange)]">
                    98%
                  </div>
                  <div className="text-xs text-[var(--ra-text-subtle)] uppercase tracking-wider">
                    Satisfaction
                  </div>
                </div>
                <div className="w-px h-12 bg-[var(--ra-border)]" />
                <div>
                  <div className="text-4xl font-[family-name:var(--font-bebas)] text-[var(--ra-orange)]">
                    +150
                  </div>
                  <div className="text-xs text-[var(--ra-text-subtle)] uppercase tracking-wider">
                    Clients
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Testimonials - Magazine Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`group relative ${
                index === 0 ? "lg:col-span-2 lg:row-span-2" : ""
              }`}
            >
              <div
                className={`h-full border border-[var(--ra-border)] bg-[var(--ra-bg-elevated)] p-8 ${
                  index === 0 ? "lg:p-12" : ""
                } hover:border-[var(--ra-orange)]/30 transition-colors duration-500`}
              >
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote
                    className={`text-[var(--ra-orange)] ${
                      index === 0 ? "w-12 h-12" : "w-8 h-8"
                    }`}
                  />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[var(--ra-orange)] text-[var(--ra-orange)]"
                    />
                  ))}
                </div>

                {/* Content */}
                <blockquote
                  className={`text-[var(--ra-text-muted)] leading-relaxed mb-8 ${
                    index === 0 ? "text-xl lg:text-2xl" : "text-base"
                  }`}
                >
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className={`rounded-none bg-[var(--ra-bg-card)] border border-[var(--ra-border)] flex items-center justify-center text-[var(--ra-orange)] font-[family-name:var(--font-bebas)] ${
                      index === 0 ? "w-16 h-16 text-2xl" : "w-12 h-12 text-lg"
                    }`}
                  >
                    {testimonial.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div
                      className={`font-[family-name:var(--font-bebas)] text-[var(--ra-text)] uppercase tracking-wide ${
                        index === 0 ? "text-xl" : "text-base"
                      }`}
                    >
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-[var(--ra-text-subtle)]">
                      {testimonial.project} &bull; {testimonial.location}
                    </div>
                  </div>
                </div>

                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-[var(--ra-orange)]/0 group-hover:border-t-[var(--ra-orange)]/20 border-l-[40px] border-l-transparent transition-colors duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <div className="border-t border-b border-[var(--ra-border)] py-8">
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 text-[var(--ra-text-faint)]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[var(--ra-orange)]" />
                <span className="text-sm uppercase tracking-wider">
                  Garantie décennale
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[var(--ra-orange)]" />
                <span className="text-sm uppercase tracking-wider">
                  Assurance RC Pro
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[var(--ra-orange)]" />
                <span className="text-sm uppercase tracking-wider">
                  Devis gratuit 24h
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[var(--ra-orange)]" />
                <span className="text-sm uppercase tracking-wider">
                  Sans engagement
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
