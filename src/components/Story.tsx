"use client";
import Image from "next/image";
import { MessageCircle, Eye } from "lucide-react";
import { WA_LINK, REVIEWS } from "@/lib/data";
import { useLang } from "@/lib/lang";

function Split({ reverse, label, title, img, tags, alt, btn }: { reverse?: boolean; label: string; title: React.ReactNode; img: string; tags: string[]; alt: string; btn: string }) {
  return (
    <div className={`${reverse ? "bg-sand" : "bg-cream"} py-[64px]`}>
      <div className="max-w-[1180px] mx-auto px-5 grid md:grid-cols-2 gap-[42px] items-center">
        <div className={`${reverse ? "md:order-2" : ""} relative`}>
          <Image src={img} alt={alt} width={800} height={500} className="w-full h-[280px] md:h-[390px] object-cover rounded-3xl shadow-[0_18px_50px_rgba(62,32,12,0.10)] border border-white" loading="lazy" />
        </div>
        <div>
          <div className="eyebrow !text-[10px]">{label}</div>
          <h2 className="font-serif text-[28px] md:text-[38px] mt-2">{title}</h2>
          <div className="gold-divider" />
          <div className="flex gap-2 flex-wrap my-3.5">{tags.map((tg) => <span key={tg} className="bg-paper border border-line rounded-full px-3 py-1.5 text-[11px] text-muted">{tg}</span>)}</div>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-clay text-white rounded-[35px] px-[22px] py-3 text-[13px] font-bold"><MessageCircle size={15} />{btn}</a>
        </div>
      </div>
    </div>
  );
}

export function Story() {
  const { lang, t } = useLang();
  const sofaTitle = lang === "bn" ? <>Sofa Cover-এ <span className="italic-accent">নতুন লুক</span></> : <>New look in <span className="italic-accent">Sofa Cover</span></>;
  const bedTitle = lang === "bn" ? <>বেডশিটে আনুন <span className="italic-accent">নতুন রঙ</span></> : <>New colour in <span className="italic-accent">Bedsheet</span></>;
  const curTitle = lang === "bn" ? <>পর্দায় সাজান <span className="italic-accent">ঘরের সৌন্দর্য</span></> : <>Decorate home with <span className="italic-accent">Curtain</span></>;
  const cushTitle = lang === "bn" ? <>ছোট পরিবর্তনে <span className="italic-accent">বড় পার্থক্য</span></> : <>Small change, <span className="italic-accent">big difference</span></>;
  return (
    <section id="story" className="scroll-mt-[170px]">
      <Split label={lang === "bn" ? "সোফা কভার" : "Sofa Cover"} title={sofaTitle} img="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&q=80&auto=format&fit=crop" tags={["Premium Fabric", "Neat Finish", "Elegant Look"]} alt="Sofa cover" btn={t.waBtn} />
      <Split reverse label={lang === "bn" ? "বেডশিট" : "Bedsheet"} title={bedTitle} img="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1000&q=80&auto=format&fit=crop" tags={["Cotton Feel", "Color Guarantee", "King / Queen"]} alt="Bedsheet" btn={t.waBtn} />
      <Split label={lang === "bn" ? "পর্দা" : "Curtain"} title={curTitle} img="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&q=80&auto=format&fit=crop" tags={["Airy Weave", "Ready To Hang", "Premium Drape"]} alt="Curtain" btn={t.waBtn} />
      <div className="bg-cream pb-[64px]">
        <div className="max-w-[1180px] mx-auto px-5 grid md:grid-cols-[0.68fr_1.32fr] gap-7 items-center">
          <div><div className="eyebrow">{lang === "bn" ? "কুশন কভার" : "Cushion Cover"}</div><h2 className="font-serif text-[32px]">{cushTitle}</h2><div className="gold-divider" /><br /><a href="#products" className="inline-flex items-center gap-2 bg-clay text-white rounded-[35px] px-[22px] py-3 text-[13px] font-bold"><Eye size={15} />{t.storyCushionBtn}</a></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["photo-1616486338812-3dadae4b4ace", "Floral Touch"], ["photo-1567016432779-094069958ea5", "Modern Style"], ["photo-1586023492125-27b2c045efd7", "Fresh Colour"], ["photo-1493663284031-b7e3aefcae8e", "Elegant Finish"]].map(([id, label]) => (
              <div key={label} className="bg-paper border border-line rounded-[18px] overflow-hidden"><Image src={`https://images.unsplash.com/${id}?w=600&q=80&auto=format&fit=crop`} alt={label} width={400} height={300} className="h-[160px] w-full object-cover" loading="lazy" /><div className="p-2.5"><b className="text-xs block">{label}</b></div></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Reviews({ initial }: { initial?: { t: string; n: string; a: string }[] }) {
  const { t, lang } = useLang();
  const source = initial?.length ? initial : REVIEWS;
  if (!source.length) {
    return (
      <section className="bg-sand border-y border-line py-[64px]">
        <div className="max-w-[1180px] mx-auto px-5 text-center">
          <div className="eyebrow">{t.revEyebrow}</div>
          <h2 className="font-serif text-[32px]">{t.revTitleA} <span className="italic-accent">{t.revTitleB}</span></h2>
          <div className="gold-divider center" />
          <div className="inline-block bg-paper border border-dashed border-gold rounded-2xl px-8 py-6 text-sm text-muted">
            {lang === "bn" ? "কাস্টমার রিভিউ (TBD): আসল রিভিউ পেলে এখানে দেখানো হবে।" : "Customer reviews (TBD): real reviews will appear here once provided."}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="bg-sand border-y border-line py-[64px] overflow-hidden">
      <div className="text-center"><div className="eyebrow">{t.revEyebrow}</div><h2 className="font-serif text-[32px]">{t.revTitleA} <span className="italic-accent">{t.revTitleB}</span></h2><div className="gold-divider center" /></div>
      <div className="marquee overflow-hidden"><div className="marquee-track flex gap-4 w-max px-5">
        {[...source, ...source].map((r, i) => (
          <div key={i} className="bg-paper border border-line rounded-[20px] p-[18px] w-[300px] shrink-0 text-left">
            <div className="stars">★★★★★</div><p className="text-[13px] mt-1">{r.t}</p>
            <div className="flex items-center gap-2.5 mt-3"><span className="w-9 h-9 rounded-full bg-gold-soft grid place-items-center font-extrabold text-forest">{r.n[0]}</span><span><b className="text-[13px]">{r.n}</b><small className="block text-muted text-[11px]">{r.a}</small></span><span className="ml-auto bg-forest text-white text-[10px] rounded-full px-2 py-0.5 font-bold">Verified</span></div>
          </div>
        ))}
      </div></div>
    </section>
  );
}
