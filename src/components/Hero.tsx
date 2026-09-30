"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, ArrowDown, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { WA_LINK } from "@/lib/data";
import { HERO_STYLE, BANNER_SLIDES, type BannerSlide } from "@/lib/hero";
import { useLang, type Lang } from "@/lib/lang";

const pick = (f: { bn: string; en: string }, lang: Lang) => (lang === "bn" ? f.bn : f.en);

const THEMES: Record<BannerSlide["theme"], { panel: string; pill: string; soft: string }> = {
  clay: { panel: "from-[#C2542C] via-[#A63F1D] to-[#7E2E14]", pill: "bg-white text-[#96351A]", soft: "text-[#F6D9C4]" },
  forest: { panel: "from-[#0A4A3F] via-[#07382F] to-[#04241E]", pill: "bg-white text-[#07382F]", soft: "text-[#BFD8D1]" },
  cocoa: { panel: "from-[#6B4423] via-[#4E2F16] to-[#33200E]", pill: "bg-white text-[#4E2F16]", soft: "text-[#E3CDA8]" },
};

// Slides admin API theke ase (props), na pele static fallback.
function BannerHero({ slides }: { slides: BannerSlide[] }) {
  const { lang } = useLang();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const safeIdx = slides.length ? idx % slides.length : 0;

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = setInterval(() => setIdx((i) => (i + 1) % slides.length), 3500);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  return (
    <section className="pt-6">
      <div className="max-w-[1180px] mx-auto px-5">
        <div
          className="group relative rounded-3xl overflow-hidden border border-line h-[440px] md:h-[420px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {slides.map((s, i) => {
            const th = THEMES[s.theme];
            return (
              <div key={s.id} className={`absolute inset-0 transition-opacity duration-500 ${i === safeIdx ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${th.panel}`} />
                <span className="absolute -right-10 -top-16 text-[220px] leading-none text-white/10 select-none">✦</span>
                <div className="relative h-full grid md:grid-cols-[1.05fr_0.95fr] items-center gap-4 px-6 md:px-12">
                  <div key={lang}>
                    <span className={`inline-block text-[10px] md:text-[11px] font-extrabold tracking-[2.4px] rounded-full bg-white/15 text-white px-3 py-1.5`}>
                      {pick(s.eyebrow, lang)}
                    </span>
                    <h2 className="font-serif text-white text-[30px] md:text-[44px] leading-[1.1] mt-3">
                      {pick(s.title, lang)}
                    </h2>
                    <p className={`text-[13px] md:text-sm mt-2 max-w-[440px] ${th.soft}`}>{pick(s.sub, lang)}</p>
                    <a
                      href={s.link.startsWith("#") ? s.link : s.link}
                      {...(s.link.startsWith("#") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                      className={`inline-flex items-center gap-2 rounded-[35px] px-6 py-3 text-[13px] font-extrabold mt-4 ${th.pill}`}
                    >
                      {pick(s.cta, lang)} <ArrowRight size={15} />
                    </a>
                  </div>
                  <div className="relative hidden sm:block h-full">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[86%] h-[78%] rounded-[24px] overflow-hidden border-2 border-white/40 shadow-[0_18px_50px_rgba(0,0,0,0.30)]">
                      <Image src={s.img} alt={s.alt} fill className="object-cover" sizes="(max-width: 768px) 0vw, 40vw" priority={i === 0} />
                    </div>
                    <span className="absolute left-2 bottom-8 bg-forest text-white text-[10px] tracking-[1.4px] font-extrabold rounded-full px-3 py-1.5 border border-white/30">
                      {pick(s.badge, lang)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* mobile image strip */}
          <div className="sm:hidden absolute bottom-12 left-6 right-6 h-[110px] rounded-2xl overflow-hidden border border-white/40">
            <Image src={slides[safeIdx].img} alt={slides[safeIdx].alt} fill className="object-cover" sizes="90vw" />
          </div>

          {/* Side arrows. Visible on hover for desktop, always visible on touch. */}
          <button onClick={() => setIdx((idx - 1 + slides.length) % slides.length)} aria-label="Prev" className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-forest grid place-items-center hover:bg-white transition-opacity md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => setIdx((idx + 1) % slides.length)} aria-label="Next" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-forest grid place-items-center hover:bg-white transition-opacity md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100">
            <ChevronRight size={18} />
          </button>

          {/* dots like reference */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((s, i) => (
              <button key={s.id} onClick={() => setIdx(i)} aria-label={`Go to slide ${i + 1}`} className={`h-2 rounded-full transition-all ${i === safeIdx ? "w-7 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const SLIDES = [
  { src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80&auto=format&fit=crop", alt: "premium sofa cover", badge: "SOFA • BED • CUSHION • CURTAIN" },
  { src: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&q=80&auto=format&fit=crop", alt: "bedsheet collection", badge: "BEDSHEET COLLECTION" },
  { src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80&auto=format&fit=crop", alt: "curtain collection", badge: "CURTAIN COLLECTION" },
];

// Previous editorial hero. Kept because the admin style switcher needs both variants.
function EditorialHero() {
  const { t } = useLang();
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="pt-6">
      <div className="max-w-[1180px] mx-auto px-5">
        <div className="rounded-3xl overflow-hidden border border-line grid md:grid-cols-[0.85fr_1.15fr] min-h-[480px] bg-gradient-to-r from-[#F5F0E6] from-[42%] to-cream to-[42%]">
          <div className="p-8 md:p-[60px]">
            <div className="text-gold text-lg">✦</div>
            <div className="eyebrow">{t.heroEyebrow}</div>
            <h1 className="font-serif text-[38px] md:text-[52px] leading-[1.05] mt-3">{t.heroTitle1}<br /><span className="italic-accent">{t.heroTitle2}</span></h1>
            <div className="gold-divider" />
            <p className="text-[14.5px] text-muted">{t.heroDesc}</p>
            <div className="flex gap-3 flex-wrap mt-5">
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-clay text-white rounded-[35px] px-[22px] py-3 text-[13px] font-bold hover:bg-clay-dark">{t.orderNow} <ArrowRight size={15} /></a>
              <a href="#products" className="inline-flex items-center gap-2 bg-white border border-line text-forest rounded-[35px] px-[22px] py-3 text-[13px] font-bold">{t.viewProducts} <ArrowDown size={15} /></a>
            </div>
            <div className="text-[11px] text-muted mt-3">Sofa Cover • Bedsheet • Cushion Cover • Curtain<br /><span className="stars">★★★★★</span> {t.happy}</div>
          </div>
          <div className="relative overflow-hidden min-h-[300px] md:min-h-[480px]">
            {SLIDES.map((s, i) => (
              <div key={s.alt} className={`absolute inset-0 transition-opacity duration-500 ${i === idx ? "opacity-100" : "opacity-0"}`}>
                <Image src={s.src} alt={s.alt} fill className="object-cover" priority={i === 0} sizes="(max-width: 768px) 100vw, 60vw" />
                <span className="absolute left-[18px] bottom-[18px] bg-forest text-white text-[9px] tracking-[1.6px] font-extrabold rounded-full px-3.5 py-2">{s.badge}</span>
              </div>
            ))}
            <div className="absolute right-[18px] bottom-4 flex gap-2">
              <button onClick={() => setIdx((idx - 1 + SLIDES.length) % SLIDES.length)} className="w-10 h-10 rounded-full bg-white border border-line grid place-items-center text-forest" aria-label="Prev"><ArrowLeft size={16} /></button>
              <button onClick={() => setIdx((idx + 1) % SLIDES.length)} className="w-10 h-10 rounded-full bg-white border border-line grid place-items-center text-forest" aria-label="Next"><ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Hero({ initial }: { initial?: { style: string; slides: BannerSlide[] } }) {
  const style = initial?.style ?? HERO_STYLE;
  const slides = initial?.slides?.length ? initial.slides : BANNER_SLIDES;
  if (style === "banner") return <BannerHero slides={slides} />;
  return <EditorialHero />;
}
