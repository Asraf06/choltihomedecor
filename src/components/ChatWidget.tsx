"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Headset } from "lucide-react";
import { useSettings, waLink } from "@/lib/settings-context";
import { useLang, type Lang } from "@/lib/lang";

type Faq = { id: string; q_en: string; a_en: string; q_bn: string; a_bn: string };
type Msg = { from: "bot" | "user"; text: string; wa?: boolean };

const pickQ = (f: Faq, lang: Lang) => (lang === "bn" && f.q_bn ? f.q_bn : f.q_en);
const pickA = (f: Faq, lang: Lang) => (lang === "bn" && f.a_bn ? f.a_bn : f.a_en);

export default function ChatWidget() {
  const { t, lang } = useLang();
  const settings = useSettings();
  const wa = waLink(settings);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"auto" | "wa">("auto");
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [asked, setAsked] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [formErr, setFormErr] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load FAQs once the panel opens.
  useEffect(() => {
    if (!open || faqs.length) return;
    fetch("/api/faqs")
      .then((r) => r.json())
      .then((d) => Array.isArray(d.faqs) && setFaqs(d.faqs))
      .catch(() => {});
  }, [open, faqs.length]);

  // Greeting when the panel opens.
  useEffect(() => {
    if (open && !msgs.length) setMsgs([{ from: "bot", text: t.chatHi }]);
  }, [open, msgs.length, t.chatHi]);

  useEffect(() => {
    if (msgs.length <= 1) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, showForm, tab]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);

  const ask = (f: Faq) => {
    setMsgs((m) => [...m, { from: "user", text: pickQ(f, lang) }, { from: "bot", text: pickA(f, lang) }]);
    setAsked((a) => [...a, f.id]);
  };

  const sendRequest = () => {
    if (!name.trim() || !message.trim()) {
      setFormErr(lang === "bn" ? "নাম আর মেসেজ দুটোই লিখুন।" : "Please write your name and message.");
      return;
    }
    setFormErr(null);
    // Live support goes straight to WhatsApp with a prefilled message.
    const text = `Hello Cholti! I am ${name.trim()}. ${message.trim()}`;
    window.open(`${wa}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    setMsgs((m) => [...m, { from: "bot", text: `${t.liveOk} ${t.liveWait}` }]);
    setShowForm(false);
    setName("");
    setMessage("");
  };

  const remaining = faqs.filter((f) => !asked.includes(f.id));

  return (
    <>
      {open && (
        <div className="fixed right-4 bottom-[84px] z-[80] w-[min(380px,calc(100vw-32px))] h-[min(540px,calc(100dvh-120px))] bg-paper border border-line rounded-3xl shadow-[0_24px_70px_rgba(62,32,12,0.25)] flex flex-col overflow-hidden">
          <div className="bg-forest text-white px-4 py-3 flex items-center gap-2.5 shrink-0">
            <span className="w-9 h-9 rounded-full bg-gold text-forest grid place-items-center font-serif font-bold text-lg shrink-0">C</span>
            <span className="flex-1 min-w-0">
              <b className="block text-[16px] leading-tight">{t.chatTitle}</b>
              <small className="flex items-center gap-1 text-[15px] text-[#c8d7d2]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25d366]" />{t.chatOnline}
              </small>
            </span>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="w-8 h-8 rounded-full hover:bg-white/15 grid place-items-center">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 p-2 bg-sand border-b border-line shrink-0">
            <button onClick={() => setTab("auto")} className={`rounded-xl py-2 text-[17px] font-extrabold ${tab === "auto" ? "bg-forest text-white" : "text-muted"}`}>
              {t.tabAuto}
            </button>
            <button onClick={() => setTab("wa")} className={`rounded-xl py-2 text-[17px] font-extrabold ${tab === "wa" ? "bg-[#25d366] text-white" : "text-muted"}`}>
              {t.tabWa}
            </button>
          </div>

          {tab === "wa" ? (
            <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-center gap-3">
              <span className="w-14 h-14 rounded-full bg-[#25d366] text-white grid place-items-center">
                <MessageCircle size={26} />
              </span>
              <b className="text-[17px]">{t.waTitle}</b>
              <p className="text-[17px] text-muted">{t.waSub}</p>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25d366] text-white rounded-[35px] px-6 py-3 text-[17px] font-extrabold">
                <MessageCircle size={15} />{t.chatWaBtn}
              </a>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-2.5">
              {msgs.map((m, i) => (
                <div key={i} className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[17px] leading-snug ${m.from === "bot" ? "bg-sand self-start" : "bg-clay text-white self-end"}`}>
                  {m.text}
                  {m.wa && (
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 bg-[#25d366] text-white rounded-full px-4 py-2 text-[16px] font-extrabold">
                      <MessageCircle size={13} />{t.chatWaBtn}
                    </a>
                  )}
                </div>
              ))}
              {!!remaining.length && !showForm && (
                <div className="flex flex-col gap-1.5 mt-1">
                  {remaining.map((f) => (
                    <button key={f.id} onClick={() => ask(f)} className="text-left rounded-xl border border-gold/60 bg-gold-soft px-3 py-2 text-[16.5px] font-bold text-forest hover:border-gold">
                      {pickQ(f, lang)}
                    </button>
                  ))}
                </div>
              )}
              {!showForm ? (
                <button onClick={() => setShowForm(true)} className="mt-1 inline-flex items-center justify-center gap-2 rounded-[35px] border-2 border-forest text-forest py-2.5 text-[17px] font-extrabold">
                  <Headset size={15} />{t.liveBtn}
                </button>
              ) : (
                <div className="rounded-2xl border border-line bg-paper p-3 flex flex-col gap-2">
                  <b className="text-[17px]">{t.liveBtn}</b>
                  <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder={t.liveName} className="h-[40px] border border-line bg-sand rounded-xl px-3 text-lg outline-none" />
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} maxLength={500} placeholder={t.liveMsg} className="border border-line bg-sand rounded-xl p-2.5 text-lg outline-none" />
                  {formErr && <p className="text-[16px] font-bold text-clay">{formErr}</p>}
                  <span className="flex gap-2">
                    <button onClick={sendRequest} className="flex-1 inline-flex justify-center items-center gap-1.5 bg-[#25d366] text-white rounded-[35px] py-2.5 text-[17px] font-bold">
                      <Send size={14} />{t.liveSend}
                    </button>
                    <button onClick={() => { setShowForm(false); setFormErr(null); }} className="rounded-[35px] border border-line px-4 py-2.5 text-[17px] font-bold">
                      <X size={14} />
                    </button>
                  </span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed right-[18px] bottom-[18px] w-[54px] h-[54px] rounded-full bg-forest text-gold grid place-items-center border-[3px] border-white shadow-[0_18px_50px_rgba(62,32,12,0.10)] z-[70] before:content-[''] before:absolute before:-inset-1.5 before:rounded-full before:border-2 before:border-forest before:animate-[tj-ripple_2s_infinite]"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  );
}
