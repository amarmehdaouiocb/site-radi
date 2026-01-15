"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { HERO_GALLERY } from "@/lib/constants";

const cards = [
  { src: HERO_GALLERY[0], title: "Terrasse Travertin", category: "Extérieur" },
  { src: HERO_GALLERY[1], title: "Salle de Bain", category: "Intérieur" },
  { src: HERO_GALLERY[2], title: "Combles", category: "Aménagement" },
  { src: HERO_GALLERY[3], title: "Terrasse Bois", category: "Extérieur" },
  { src: HERO_GALLERY[4], title: "Escalier", category: "Design" },
];

export default function Cards3DGallery() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="cards3d-gallery">
      <div className="cards3d-header">
        <span className="cards3d-label">Portfolio</span>
        <h2 className="cards3d-title">
          Découvrez nos <span className="gold-text-gradient">Réalisations</span>
        </h2>
      </div>

      <div className="cards3d-container">
        <div className="cards3d-stack">
          {cards.map((card, i) => {
            const isHovered = hoveredIndex === i;
            const offset = hoveredIndex !== null
              ? i < hoveredIndex ? -30 : i > hoveredIndex ? 30 : 0
              : 0;

            return (
              <motion.div
                key={i}
                className="cards3d-card"
                style={{
                  zIndex: isHovered ? 50 : cards.length - i,
                }}
                initial={false}
                animate={{
                  rotateY: isHovered ? 0 : -5 + i * 2,
                  rotateX: isHovered ? 0 : 5,
                  x: offset + (isHovered ? 0 : i * 60),
                  y: isHovered ? -20 : i * 10,
                  scale: isHovered ? 1.1 : 1 - i * 0.02,
                }}
                whileHover={{ scale: 1.15, y: -30 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onHoverStart={() => setHoveredIndex(i)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <Image
                  src={card.src}
                  alt={card.title}
                  fill
                  className="object-cover"
                  sizes="350px"
                />
                <div className="cards3d-card-overlay">
                  <span className="cards3d-card-category">{card.category}</span>
                  <h3 className="cards3d-card-title">{card.title}</h3>
                </div>
                <div className="cards3d-card-shine" />
                <div className="cards3d-card-border" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="cards3d-decoration">
        <div className="cards3d-glow" />
      </div>
    </section>
  );
}
