"use client";

import { useEffect, useRef } from "react";

interface Partner {
  name: string;
  color: string;
  textColor?: string;
}

const partners: Partner[] = [
  { name: "Point.P", color: "#e30613", textColor: "#fff" },
  { name: "Cedeo", color: "#004a99", textColor: "#fff" },
  { name: "BigMat", color: "#003880", textColor: "#fff" },
  { name: "Leroy Merlin", color: "#78be20", textColor: "#fff" },
  { name: "Saint-Gobain", color: "#00539b", textColor: "#fff" },
  { name: "Würth", color: "#cc0000", textColor: "#fff" },
  { name: "Rexel", color: "#e6007e", textColor: "#fff" },
  { name: "Prolians", color: "#ed1c24", textColor: "#fff" },
];

function PartnerLogo({ partner }: { partner: Partner }) {
  return (
    <div className="partner-logo-item">
      <div
        className="partner-logo-badge"
        style={{
          background: `linear-gradient(135deg, ${partner.color} 0%, ${partner.color}dd 100%)`,
          boxShadow: `0 4px 20px ${partner.color}40`
        }}
      >
        <span
          className="partner-brand-name"
          style={{ color: partner.textColor || '#fff' }}
        >
          {partner.name}
        </span>
      </div>
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
          <span className="accent-text">Nos fournisseurs partenaires</span>
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
          animation: marquee 35s linear infinite;
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
          gap: 2.5rem;
          padding: 1.5rem 1.25rem;
        }

        /* Partner Logo */
        .partner-logo-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .partner-logo-item:hover {
          transform: translateY(-4px) scale(1.02);
        }

        .partner-logo-badge {
          padding: 0.875rem 1.75rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.3s ease;
          min-width: 140px;
        }

        .partner-logo-item:hover .partner-logo-badge {
          transform: translateY(-2px);
        }

        .partner-brand-name {
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          white-space: nowrap;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
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
            gap: 1.5rem;
          }

          .partner-logo-badge {
            padding: 0.625rem 1.25rem;
            min-width: 110px;
          }

          .partner-brand-name {
            font-size: 0.75rem;
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
