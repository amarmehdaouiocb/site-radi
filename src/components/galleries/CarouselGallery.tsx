"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { HERO_GALLERY } from "@/lib/constants";

const carouselItems = [
  { src: HERO_GALLERY[0], title: "Terrasse Travertin", desc: "Transformation complète d'un espace extérieur" },
  { src: HERO_GALLERY[1], title: "Salle de Bain Mosaïque", desc: "Rénovation haut de gamme avec finitions luxueuses" },
  { src: HERO_GALLERY[2], title: "Aménagement Combles", desc: "Création d'un nouvel espace de vie" },
  { src: HERO_GALLERY[3], title: "Terrasse Bois", desc: "Extension de l'espace de vie vers l'extérieur" },
  { src: HERO_GALLERY[4], title: "Escalier Design", desc: "Alliance du bois et du métal" },
];

export default function CarouselGallery() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % carouselItems.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section className="carousel-gallery">
      <div className="carousel-header">
        <span className="carousel-label">Portfolio</span>
        <h2 className="carousel-title">
          Nos <span className="gold-text-gradient">Chefs-d&apos;oeuvre</span>
        </h2>
      </div>

      <div className="carousel-container">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="carousel-slide"
          >
            <Image
              src={carouselItems[current].src}
              alt={carouselItems[current].title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="carousel-slide-overlay" />
            <div className="carousel-slide-content">
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {carouselItems[current].title}
              </motion.h3>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {carouselItems[current].desc}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <button className="carousel-nav carousel-prev" onClick={prev}>
          <CaretLeft className="w-8 h-8" />
        </button>
        <button className="carousel-nav carousel-next" onClick={next}>
          <CaretRight className="w-8 h-8" />
        </button>

        {/* Dots */}
        <div className="carousel-dots">
          {carouselItems.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === current ? "active" : ""}`}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="carousel-progress">
          <motion.div
            className="carousel-progress-bar"
            initial={{ width: 0 }}
            animate={{ width: `${((current + 1) / carouselItems.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </section>
  );
}
