"use client";

interface Partner {
  name: string;
  logo: string;
}

const partners: Partner[] = [
  { name: "Point.P", logo: "/logos/point-p.png" },
  { name: "Cedeo", logo: "/logos/cedeo.png" },
  { name: "BigMat", logo: "/logos/bigmat.svg" },
  { name: "Leroy Merlin", logo: "/logos/leroy-merlin.svg" },
  { name: "Saint-Gobain", logo: "/logos/saint-gobain.svg" },
  { name: "Wurth", logo: "/logos/wurth.svg" },
  { name: "Rexel", logo: "/logos/rexel.svg" },
  { name: "Prolians", logo: "/logos/prolians.svg" },
];

function PartnerLogo({ partner, index }: { partner: Partner; index: number }) {
  return (
    <div className="group flex-shrink-0 cursor-pointer transition-transform duration-300 hover:-translate-y-2">
      <div
        className="
          flex items-center justify-center
          w-[200px] h-[90px]
          bg-white rounded-2xl
          border-2 border-[#d4af37]/30
          shadow-[0_4px_20px_rgba(0,0,0,0.3)]
          transition-all duration-300
          group-hover:border-[#d4af37]
          group-hover:shadow-[0_0_0_2px_#d4af37,0_0_30px_rgba(212,175,55,0.5),0_8px_30px_rgba(0,0,0,0.4)]
        "
      >
        <img
          src={partner.logo}
          alt={`Logo ${partner.name}`}
          className="max-w-[160px] max-h-[60px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </div>
  );
}

export default function TrustedBy() {
  return (
    <section className="gold-trusted-by relative py-20 px-6 overflow-hidden">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-8 mb-14">
          <div className="flex-1 max-w-[200px] h-px bg-gradient-to-r from-transparent to-[#d4af37]/40" />
          <h2 className="text-center flex flex-col gap-1">
            <span className="font-cormorant text-sm font-normal tracking-[0.3em] uppercase text-[#d4af37]/70">
              Ils nous font
            </span>
            <span className="font-cormorant text-4xl font-semibold text-[#d4af37] tracking-wider">
              Confiance
            </span>
          </h2>
          <div className="flex-1 max-w-[200px] h-px bg-gradient-to-l from-transparent to-[#d4af37]/40" />
        </div>

        {/* Marquee */}
        <div className="relative w-full overflow-hidden">
          {/* Left fade */}
          <div className="gold-trusted-fade-left absolute top-0 bottom-0 left-0 w-[100px] z-10 pointer-events-none" />

          {/* Right fade */}
          <div className="gold-trusted-fade-right absolute top-0 bottom-0 right-0 w-[100px] z-10 pointer-events-none" />

          {/* Track - deux sets identiques pour boucle infinie */}
          <div className="flex w-fit animate-marquee hover:[animation-play-state:paused]">
            <div className="flex gap-8 py-6 px-5">
              {partners.map((partner, index) => (
                <PartnerLogo key={`set1-${partner.name}-${index}`} partner={partner} index={index} />
              ))}
            </div>
            <div className="flex gap-8 py-6 px-5" aria-hidden="true">
              {partners.map((partner, index) => (
                <PartnerLogo key={`set2-${partner.name}-${index}`} partner={partner} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <span className="text-[#d4af37] text-xs opacity-60">◆</span>
          <span className="gold-trusted-subtitle font-cormorant text-sm italic tracking-wider">
            Nos fournisseurs partenaires
          </span>
          <span className="text-[#d4af37] text-xs opacity-60">◆</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
