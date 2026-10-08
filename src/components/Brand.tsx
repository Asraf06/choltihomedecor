"use client";
import Image from "next/image";
import type { BrandContent, AboutContent } from "@/lib/content-db";
import { useLang } from "@/lib/lang";

export function Brand({ initial }: { initial: BrandContent }) {
  const { lang } = useLang();
  const title = lang === "bn" ? initial.title_bn : initial.title_en;
  const text = lang === "bn" ? initial.text_bn : initial.text_en;
  const points = lang === "bn" ? initial.points_bn : initial.points_en;
  return (
    <section className="bg-cream py-10 md:py-[64px]">
      <div className="max-w-[1180px] mx-auto px-5 grid md:grid-cols-2 gap-6 md:gap-[42px] items-center">
        <div className="relative">
          <Image src={initial.img} alt={title} width={800} height={500} className="w-full h-[280px] md:h-[390px] object-cover rounded-3xl shadow-[0_18px_50px_rgba(62,32,12,0.10)] border border-white" loading="lazy" />
        </div>
        <div>
          <div className="eyebrow !text-[14px]">{lang === "bn" ? "আমাদের ব্র্যান্ড" : "Our Brand"}</div>
          <h2 className="font-serif text-[24px] md:text-[38px] mt-2">{title}</h2>
          <div className="gold-divider" />
          <div className="flex flex-col gap-2.5 mt-1">
            {text.split(/\n+/).map((para, i) => (
              <p key={i} className="text-[17px] leading-relaxed">{para}</p>
            ))}
          </div>
          {!!points.length && (
            <div className="flex gap-2 flex-wrap my-3.5">{points.map((p) => <span key={p} className="bg-paper border border-line rounded-full px-3 py-1.5 text-[15px] text-muted">{p}</span>)}</div>
          )}
        </div>
      </div>
    </section>
  );
}

export function AboutText({ initial }: { initial: AboutContent }) {
  const { lang } = useLang();
  const title = lang === "bn" ? initial.title_bn : initial.title_en;
  const body = lang === "bn" ? initial.body_bn : initial.body_en;
  return (
    <section className="bg-cream py-10 md:py-[64px]">
      <div className="max-w-[800px] mx-auto px-5">
        <div className="eyebrow !text-[14px] text-center">{lang === "bn" ? "আমাদের সম্পর্কে" : "About Us"}</div>
        <h1 className="font-serif text-[26px] md:text-[40px] mt-2 text-center">{title}</h1>
        <div className="gold-divider center" />
        <div className="flex flex-col gap-3 mt-2">
          {body.split(/\n+/).map((para, i) => (
            <p key={i} className="text-[18px] leading-relaxed">{para}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
