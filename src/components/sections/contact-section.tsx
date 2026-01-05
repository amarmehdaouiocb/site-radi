"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  projectType: z.string().min(1, "Veuillez sélectionner un type de projet"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactSection() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form data:", data);
    setIsSubmitting(false);
    setIsSubmitted(true);
    reset();
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "Téléphone",
      value: SITE_CONFIG.phone,
      href: `tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: SITE_CONFIG.email,
      href: `mailto:${SITE_CONFIG.email}`,
    },
    {
      icon: MapPin,
      label: "Zone",
      value: SITE_CONFIG.address,
    },
    {
      icon: Clock,
      label: "Horaires",
      value: SITE_CONFIG.hours,
    },
  ];

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative min-h-screen bg-[var(--ra-bg)] overflow-hidden"
    >
      {/* Split Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 left-0 w-full lg:w-1/2 bg-[var(--ra-bg-elevated)]" />
        <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 bg-[var(--ra-bg)] hidden lg:block">
          {/* Geometric pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-[var(--ra-text)] rotate-45" />
            <div className="absolute bottom-1/4 right-1/3 w-32 h-32 border border-[var(--ra-text)] rotate-12" />
          </div>
          {/* Large text watermark */}
          <div className="absolute bottom-0 right-0 text-[15rem] font-[family-name:var(--font-bebas)] text-[var(--ra-bg-card)] leading-none select-none">
            CONTACT
          </div>
        </div>
      </div>

      <div className="container-wide relative py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[80vh]">
          {/* Left Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[2px] bg-[var(--ra-orange)]" />
              <span className="label">Contact</span>
            </div>

            <h2 className="heading-1 text-[var(--ra-text)] mb-6">
              Demandez votre{" "}
              <span className="text-gradient">devis gratuit</span>
            </h2>

            <p className="text-[var(--ra-text-subtle)] mb-12 max-w-md">
              Décrivez votre projet et recevez une estimation personnalisée sous
              24h. Sans engagement.
            </p>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-[var(--ra-border)] bg-[var(--ra-bg-elevated)] p-12 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 border border-[var(--ra-orange)] flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-[var(--ra-orange)]" />
                </div>
                <h3 className="font-[family-name:var(--font-bebas)] text-3xl text-[var(--ra-text)] uppercase tracking-wide mb-3">
                  Demande envoyée
                </h3>
                <p className="text-[var(--ra-text-subtle)] mb-8">
                  Nous vous recontacterons dans les 24 heures.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="inline-flex items-center gap-2 text-[var(--ra-orange)] uppercase tracking-wider text-sm hover:text-[var(--ra-orange-light)] transition-colors"
                >
                  <span>Envoyer une autre demande</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-[var(--ra-text-subtle)] uppercase tracking-wider mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      placeholder="Jean Dupont"
                      className={`w-full px-0 py-4 bg-transparent border-b ${
                        errors.name ? "border-[var(--ra-error)]" : "border-[var(--ra-border)]"
                      } text-[var(--ra-text)] placeholder-[var(--ra-text-faint)] focus:border-[var(--ra-orange)] focus:outline-none transition-colors`}
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-[var(--ra-error)] text-xs mt-2">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--ra-text-subtle)] uppercase tracking-wider mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      placeholder="jean@exemple.fr"
                      className={`w-full px-0 py-4 bg-transparent border-b ${
                        errors.email ? "border-[var(--ra-error)]" : "border-[var(--ra-border)]"
                      } text-[var(--ra-text)] placeholder-[var(--ra-text-faint)] focus:border-[var(--ra-orange)] focus:outline-none transition-colors`}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-[var(--ra-error)] text-xs mt-2">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-[var(--ra-text-subtle)] uppercase tracking-wider mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      placeholder="06 12 34 56 78"
                      className={`w-full px-0 py-4 bg-transparent border-b ${
                        errors.phone ? "border-[var(--ra-error)]" : "border-[var(--ra-border)]"
                      } text-[var(--ra-text)] placeholder-[var(--ra-text-faint)] focus:border-[var(--ra-orange)] focus:outline-none transition-colors`}
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-[var(--ra-error)] text-xs mt-2">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--ra-text-subtle)] uppercase tracking-wider mb-2">
                      Type de projet *
                    </label>
                    <select
                      className={`w-full px-0 py-4 bg-transparent border-b ${
                        errors.projectType
                          ? "border-[var(--ra-error)]"
                          : "border-[var(--ra-border)]"
                      } text-[var(--ra-text)] focus:border-[var(--ra-orange)] focus:outline-none transition-colors appearance-none cursor-pointer`}
                      {...register("projectType")}
                    >
                      <option value="" className="bg-[var(--ra-bg)]">
                        Sélectionnez...
                      </option>
                      <option value="renovation" className="bg-[var(--ra-bg)]">
                        Rénovation intérieure
                      </option>
                      <option value="maconnerie" className="bg-[var(--ra-bg)]">
                        Maçonnerie
                      </option>
                      <option value="plomberie" className="bg-[var(--ra-bg)]">
                        Plomberie
                      </option>
                      <option value="electricite" className="bg-[var(--ra-bg)]">
                        Électricité
                      </option>
                      <option value="peinture" className="bg-[var(--ra-bg)]">
                        Peinture
                      </option>
                      <option value="carrelage" className="bg-[var(--ra-bg)]">
                        Carrelage
                      </option>
                      <option value="autre" className="bg-[var(--ra-bg)]">
                        Autre
                      </option>
                    </select>
                    {errors.projectType && (
                      <p className="text-[var(--ra-error)] text-xs mt-2">
                        {errors.projectType.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[var(--ra-text-subtle)] uppercase tracking-wider mb-2">
                    Description du projet *
                  </label>
                  <textarea
                    placeholder="Décrivez votre projet, l'adresse du chantier, vos contraintes de délai..."
                    rows={4}
                    className={`w-full px-0 py-4 bg-transparent border-b ${
                      errors.message ? "border-[var(--ra-error)]" : "border-[var(--ra-border)]"
                    } text-[var(--ra-text)] placeholder-[var(--ra-text-faint)] focus:border-[var(--ra-orange)] focus:outline-none transition-colors resize-none`}
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-[var(--ra-error)] text-xs mt-2">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full sm:w-auto px-12 py-5 bg-[var(--ra-orange)] text-[var(--ra-bg)] font-semibold uppercase tracking-wider text-sm overflow-hidden transition-all hover:bg-[var(--ra-orange-light)] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Envoi en cours...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <Send className="w-5 h-5" />
                        Envoyer ma demande
                      </span>
                    )}
                  </button>
                </div>

                <p className="text-xs text-[var(--ra-text-faint)]">
                  En soumettant ce formulaire, vous acceptez d&apos;être
                  recontacté concernant votre projet.
                </p>
              </form>
            )}
          </motion.div>

          {/* Right Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:pl-12"
          >
            {/* Contact Info Cards */}
            <div className="space-y-6 mb-12">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="group"
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      className="flex items-center gap-6 p-6 border border-[var(--ra-border)] bg-[var(--ra-bg-elevated)]/50 hover:border-[var(--ra-orange)]/30 transition-colors"
                    >
                      <div className="w-14 h-14 border border-[var(--ra-border)] group-hover:border-[var(--ra-orange)] flex items-center justify-center transition-colors">
                        <item.icon className="w-6 h-6 text-[var(--ra-text-subtle)] group-hover:text-[var(--ra-orange)] transition-colors" />
                      </div>
                      <div>
                        <div className="text-xs text-[var(--ra-text-faint)] uppercase tracking-wider mb-1">
                          {item.label}
                        </div>
                        <div className="text-[var(--ra-text)] font-medium group-hover:text-[var(--ra-orange)] transition-colors">
                          {item.value}
                        </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 ml-auto text-[var(--ra-text-faint)] group-hover:text-[var(--ra-orange)] transition-colors" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-6 p-6 border border-[var(--ra-border)] bg-[var(--ra-bg-elevated)]/50">
                      <div className="w-14 h-14 border border-[var(--ra-border)] flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-[var(--ra-text-subtle)]" />
                      </div>
                      <div>
                        <div className="text-xs text-[var(--ra-text-faint)] uppercase tracking-wider mb-1">
                          {item.label}
                        </div>
                        <div className="text-[var(--ra-text)] font-medium">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="relative aspect-video border border-[var(--ra-border)] bg-[var(--ra-bg-elevated)] overflow-hidden"
            >
              {/* Map placeholder with pattern */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-[var(--ra-orange)] mx-auto mb-4" />
                  <p className="text-[var(--ra-text-subtle)] uppercase tracking-wider text-sm">
                    Intervention dans toute
                  </p>
                  <p className="text-[var(--ra-text)] font-[family-name:var(--font-bebas)] text-2xl uppercase">
                    l&apos;Île-de-France
                  </p>
                </div>
              </div>
              {/* Grid overlay */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `linear-gradient(var(--ra-text) 1px, transparent 1px), linear-gradient(90deg, var(--ra-text) 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
