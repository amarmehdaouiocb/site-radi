"use client";

import Link from "next/link";
import ArrowNarrowLeftIcon from "@/components/ui/arrow-narrow-left-icon";
import MarqueeGallery from "@/components/galleries/MarqueeGallery";
import "../../../app/gold.css";
import "../../../app/galleries.css";

export default function MarqueeDemo() {
  return (
    <div className="gold-variant">
      {/* Navigation */}
      <nav className="demo-nav">
        <Link href="/" className="demo-back">
          <ArrowNarrowLeftIcon size={16} />
          Retour
        </Link>
        <div className="demo-nav-links">
          <Link href="/demo/marquee" className="active">Marquee</Link>
          <Link href="/demo/bento">Bento</Link>
          <Link href="/demo/carousel">Carousel</Link>
          <Link href="/demo/cards-3d">Cards 3D</Link>
        </div>
      </nav>

      {/* Hero placeholder */}
      <div className="demo-hero">
        <h1>Demo: Bandeau Défilant</h1>
        <p>Photos qui défilent en continu - style premium et hypnotique</p>
      </div>

      {/* Gallery */}
      <MarqueeGallery />

      {/* Styles */}
      <style jsx>{`
        .demo-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(10px);
          z-index: 100;
          border-bottom: 1px solid var(--gold-border);
        }
        .demo-back {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--gold-text);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s;
        }
        .demo-back:hover {
          color: var(--gold-primary);
        }
        .demo-nav-links {
          display: flex;
          gap: 1.5rem;
        }
        .demo-nav-links a {
          color: var(--gold-text-muted);
          text-decoration: none;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: all 0.3s;
        }
        .demo-nav-links a:hover {
          color: var(--gold-primary);
        }
        .demo-nav-links a.active {
          background: var(--gold-primary);
          color: var(--gold-bg);
        }
        .demo-hero {
          padding: 8rem 2rem 4rem;
          text-align: center;
          background: linear-gradient(to bottom, var(--gold-bg), var(--gold-bg-elevated));
        }
        .demo-hero h1 {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 3rem);
          color: var(--gold-text);
          margin-bottom: 1rem;
        }
        .demo-hero p {
          color: var(--gold-text-muted);
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
}
