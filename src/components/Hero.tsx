"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_STYLE, BANNER_SLIDES, type BannerSlide } from "@/lib/hero";
import { useLang, type Lang } from "@/lib/lang";

const pick = (f: { bn: string; en: string }, lang: Lang) => (lang === "bn" ? f.bn : f.en);

const THEMES: Record<BannerSlide["theme"], { panel: string; pill: string; soft: string }> = {
  clay: { panel: "from-[#C2542C] via-[#A63F1D] to-[#7E2E14]", pill: "bg-white text-[#96351A]", soft: "text-[#F6D9C4]" },
  forest: { panel: "from-[#0A4A3F] via-[#07382F] to-[#04241E]", pill: "bg-white text-[#07382F]", soft: "text-[#BFD8D1]" },
  cocoa: { panel: "from-[#6B4423] via-[#4E2F16] to-[#33200E]", pill: "bg-white text-[#4E2F16]", soft: "text-[#E3CDA8]" },
};

// Slides admin API theke ase (props), na pele static fallback.
function BannerHero({ slides, boxed }: { slides: BannerSlide[]; boxed?: boolean }) {
  const { lang } = useLang();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const safeIdx = slides.length ? idx % slides.length : 0;

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = setInterval(() => setIdx((i) => (i + 1) % slides.length), 3500);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  const boxCls = boxed
    ? "group relative rounded-3xl overflow-hidden border border-line h-[300px]"
    : "group relative overflow-hidden border-y border-line h-[300px]";
  const box = (
      <div
          className={boxCls}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {slides.map((s, i) => {
            const th = THEMES[s.theme];
            if (s.layout === "image") {
              const inner = (
                <div className="absolute inset-0" style={{ background: s.bg || "#07382f" }}>
                  <Image src={s.img} alt={s.alt} fill className="object-contain" sizes="100vw" priority={i === 0} />
                </div>
              );
              return (
                <div key={s.id} className={`absolute inset-0 transition-opacity duration-500 ${i === safeIdx ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  {s.link ? (
                    <a
                      href={s.link}
                      aria-label={s.alt}
                      {...(s.link.startsWith("#") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                      className="absolute inset-0"
                    >
                      {inner}
                    </a>
                  ) : inner}
                </div>
              );
            }
            return (
              <div key={s.id} className={`absolute inset-0 transition-opacity duration-500 ${i === safeIdx ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${th.panel}`} />
                <span className="absolute -right-10 -top-16 text-[220px] leading-none text-white/10 select-none">✦</span>
                <div className="relative h-full grid grid-cols-[1.05fr_0.95fr] items-center gap-2.5 md:gap-4 pl-4 pr-2.5 md:px-12 max-w-[1180px] mx-auto w-full">
                  <div key={lang}>
                    <span className={`inline-block text-[11px] md:text-[15px] font-extrabold tracking-[1px] md:tracking-[2.4px] rounded-full bg-white/15 text-white px-3 py-1.5`}>
                      {pick(s.eyebrow, lang)}
                    </span>
                    <h2 className="font-serif text-white text-[20px] sm:text-[26px] md:text-[34px] leading-[1.1] mt-2">
                      {pick(s.title, lang)}
                    </h2>
                    <p className={`text-[13px] md:text-[17px] mt-1.5 max-w-[440px] ${th.soft}`}>{pick(s.sub, lang)}</p>
                    <a
                      href={s.link.startsWith("#") ? s.link : s.link}
                      {...(s.link.startsWith("#") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                      className={`inline-flex whitespace-nowrap items-center gap-2 rounded-[35px] px-4 md:px-5 py-2 md:py-2.5 text-[14px] md:text-[17px] font-extrabold mt-2.5 md:mt-3 ${th.pill}`}
                    >
                      {pick(s.cta, lang)} <ArrowRight size={15} />
                    </a>
                  </div>
                  <div className="relative h-full">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[92%] h-[72%] rounded-[24px] overflow-hidden border-2 border-white/40 shadow-[0_18px_50px_rgba(0,0,0,0.30)]">
                      <Image src={s.img} alt={s.alt} fill className="object-cover" sizes="40vw" priority={i === 0} />
                    </div>
                    <span className="absolute left-1 md:left-2 bottom-8 bg-forest text-white text-[10px] md:text-[14px] tracking-[0.5px] md:tracking-[1.4px] font-extrabold rounded-full px-2 md:px-3 py-1 md:py-1.5 border border-white/30 whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
                      {pick(s.badge, lang)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Side arrows. Visible on hover for desktop, always visible on touch. */}
          <button onClick={() => setIdx((idx - 1 + slides.length) % slides.length)} aria-label="Prev" className="absolute left-1.5 md:left-3 top-1/2 -translate-y-1/2 w-7 h-7 md:w-10 md:h-10 rounded-full bg-white/70 md:bg-white/90 text-forest grid place-items-center hover:bg-white transition-opacity md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100">
            <ChevronLeft size={15} />
          </button>
          <button onClick={() => setIdx((idx + 1) % slides.length)} aria-label="Next" className="absolute right-1.5 md:right-3 top-1/2 -translate-y-1/2 w-7 h-7 md:w-10 md:h-10 rounded-full bg-white/70 md:bg-white/90 text-forest grid place-items-center hover:bg-white transition-opacity md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100">
            <ChevronRight size={15} />
          </button>

          {/* dots like reference */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((s, i) => (
              <button key={s.id} onClick={() => setIdx(i)} aria-label={`Go to slide ${i + 1}`} className={`h-2 rounded-full transition-all ${i === safeIdx ? "w-7 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`} />
            ))}
          </div>
        </div>
  );

  if (boxed) {
    return (
      <section className="pt-6">
        <div className="max-w-[1180px] mx-auto px-5">{box}</div>
      </section>
    );
  }
  return <section>{box}</section>;
}

export default function Hero({ initial }: { initial?: { style: string; slides: BannerSlide[] } }) {
  const style = initial?.style ?? HERO_STYLE;
  const slides = initial?.slides?.length ? initial.slides : BANNER_SLIDES;
  return <BannerHero slides={slides} boxed={style === "boxed"} />;
}
