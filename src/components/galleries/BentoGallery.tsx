"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { HERO_GALLERY } from "@/lib/constants";

const bentoItems = [
  { src: HERO_GALLERY[0], span: "col-span-2 row-span-2", label: "Terrasse Travertin" },
  { src: HERO_GALLERY[1], span: "col-span-1 row-span-1", label: "Salle de Bain" },
  { src: HERO_GALLERY[2], span: "col-span-1 row-span-1", label: "Combles" },
  { src: HERO_GALLERY[3], span: "col-span-1 row-span-2", label: "Terrasse Bois" },
  { src: HERO_GALLERY[4], span: "col-span-2 row-span-1", label: "Escalier Design" },
];

export default function BentoGallery() {
  return (
    <section className="bento-gallery">
      <div className="bento-header">
        <span className="bento-label">Portfolio</span>
        <h2 className="bento-title">
          L&apos;Excellence en <span className="gold-text-gradient">Images</span>
        </h2>
      </div>

      <div className="bento-grid">
        {bentoItems.map((item, i) => (
          <motion.div
            key={i}
            className={`bento-item ${item.span}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <Image
              src={item.src}
              alt={item.label}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="bento-item-overlay">
              <span className="bento-item-label">{item.label}</span>
            </div>
            <div className="bento-item-shine" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
