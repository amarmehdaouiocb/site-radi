"use client";

import { useEffect, useRef } from "react";

interface Partner {
  name: string;
  initials: string;
}

const partners: Partner[] = [
  { name: "Bouygues Bâtiment", initials: "BB" },
  { name: "Vinci Construction", initials: "VC" },
  { name: "Eiffage Immobilier", initials: "EI" },
  { name: "Nexity Rénovation", initials: "NR" },
  { name: "Kaufman & Broad", initials: "KB" },
  { name: "Icade Promotion", initials: "IP" },
  { name: "Cogedim Services", initials: "CS" },
  { name: "Altarea Construction", initials: "AC" },
];

function PartnerLogo({ partner }: { partner: Partner }) {
  return (
    <div className="partner-logo-item">
      <div className="partner-logo-badge">
        <span className="partner-initials">{partner.initials}</span>
      </div>
      <span className="partner-name">{partner.name}</span>
    </div>
  );
}

export default function TrustedBy() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Clone items for seamless loop
    const scrollContent = scrollContainer.querySelector(".marquee-content");
    if (scrollContent) {
      const clone = scrollContent.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      scrollContainer.appendChild(clone);
    }
  }, []);

  return (
    <section className="trusted-by-section">
      <div className="trusted-by-container">
        {/* Header */}
        <div className="trusted-by-header">
          <div className="trusted-by-line" />
          <h2 className="trusted-by-title">
            <span className="trusted-by-subtitle">Ils nous font</span>
            <span className="trusted-by-main">Confiance</span>
          </h2>
          <div className="trusted-by-line" />
        </div>

        {/* Marquee */}
        <div className="marquee-wrapper">
          <div className="marquee-fade marquee-fade-left" />
          <div className="marquee-track" ref={scrollRef}>
            <div className="marquee-content">
              {partners.map((partner, index) => (
                <PartnerLogo key={`${partner.name}-${index}`} partner={partner} />
              ))}
            </div>
          </div>
          <div className="marquee-fade marquee-fade-right" />
        </div>

        {/* Bottom accent */}
        <div className="trusted-by-accent">
          <span className="accent-diamond">◆</span>
          <span className="accent-text">Partenaires de confiance depuis 2015</span>
          <span className="accent-diamond">◆</span>
        </div>
      </div>

      <style jsx>{`
        .trusted-by-section {
          background: linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%);
          padding: 5rem 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .trusted-by-section::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #d4af37 50%, transparent);
        }

        .trusted-by-section::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #d4af37 50%, transparent);
        }

        .trusted-by-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Header */
        .trusted-by-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 3.5rem;
        }

        .trusted-by-line {
          flex: 1;
          max-width: 200px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4));
        }

        .trusted-by-line:last-child {
          background: linear-gradient(90deg, rgba(212, 175, 55, 0.4), transparent);
        }

        .trusted-by-title {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .trusted-by-subtitle {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 0.875rem;
          font-weight: 400;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.7);
        }

        .trusted-by-main {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 2.5rem;
          font-weight: 600;
          color: #d4af37;
          letter-spacing: 0.1em;
        }

        /* Marquee */
        .marquee-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .marquee-fade {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 100px;
          z-index: 2;
          pointer-events: none;
        }

        .marquee-fade-left {
          left: 0;
          background: linear-gradient(90deg, #0a0a0a, transparent);
        }

        .marquee-fade-right {
          right: 0;
          background: linear-gradient(90deg, transparent, #0a0a0a);
        }

        .marquee-track {
          display: flex;
          width: fit-content;
          animation: marquee 40s linear infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-content {
          display: flex;
          gap: 4rem;
          padding: 1.5rem 2rem;
        }

        /* Partner Logo */
        .partner-logo-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          min-width: 140px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .partner-logo-item:hover {
          transform: translateY(-4px);
        }

        .partner-logo-badge {
          width: 72px;
          height: 72px;
          border: 1px solid rgba(212, 175, 55, 0.3);
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, transparent 50%, rgba(212, 175, 55, 0.04) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.3s ease;
        }

        .partner-logo-badge::before {
          content: "";
          position: absolute;
          inset: -1px;
          background: linear-gradient(135deg, #d4af37 0%, transparent 50%, #d4af37 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .partner-logo-item:hover .partner-logo-badge {
          border-color: #d4af37;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%);
        }

        .partner-initials {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #d4af37;
          letter-spacing: 0.05em;
        }

        .partner-name {
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 0.75rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          white-space: nowrap;
          transition: color 0.3s ease;
        }

        .partner-logo-item:hover .partner-name {
          color: rgba(212, 175, 55, 0.8);
        }

        /* Bottom Accent */
        .trusted-by-accent {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: 3rem;
        }

        .accent-diamond {
          color: #d4af37;
          font-size: 0.5rem;
          opacity: 0.6;
        }

        .accent-text {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 0.875rem;
          font-style: italic;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.1em;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .trusted-by-section {
            padding: 3rem 1rem;
          }

          .trusted-by-header {
            gap: 1rem;
          }

          .trusted-by-line {
            max-width: 60px;
          }

          .trusted-by-main {
            font-size: 1.75rem;
          }

          .trusted-by-subtitle {
            font-size: 0.75rem;
          }

          .marquee-content {
            gap: 2.5rem;
          }

          .partner-logo-item {
            min-width: 100px;
          }

          .partner-logo-badge {
            width: 56px;
            height: 56px;
          }

          .partner-initials {
            font-size: 1.125rem;
          }

          .partner-name {
            font-size: 0.625rem;
          }

          .marquee-fade {
            width: 50px;
          }

          .trusted-by-accent {
            margin-top: 2rem;
          }

          .accent-text {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </section>
  );
}
