"use client";

import Image from "next/image";
import { HERO_GALLERY } from "@/lib/constants";

// Double the images for seamless loop
const images = [...HERO_GALLERY, ...HERO_GALLERY];

export default function MarqueeGallery() {
  return (
    <section className="marquee-gallery">
      <div className="marquee-header">
        <span className="marquee-label">Portfolio</span>
        <h2 className="marquee-title">
          Nos <span className="gold-text-gradient">Transformations</span>
        </h2>
      </div>

      <div className="marquee-container">
        <div className="marquee-track">
          {images.map((src, i) => (
            <div key={i} className="marquee-item">
              <Image
                src={src}
                alt={`Réalisation ${(i % HERO_GALLERY.length) + 1}`}
                fill
                className="object-cover"
                sizes="400px"
              />
              <div className="marquee-item-overlay" />
            </div>
          ))}
        </div>
      </div>

      {/* Second row - reverse direction */}
      <div className="marquee-container marquee-reverse">
        <div className="marquee-track">
          {images.map((src, i) => (
            <div key={i} className="marquee-item">
              <Image
                src={src}
                alt={`Réalisation ${(i % HERO_GALLERY.length) + 1}`}
                fill
                className="object-cover"
                sizes="400px"
              />
              <div className="marquee-item-overlay" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
