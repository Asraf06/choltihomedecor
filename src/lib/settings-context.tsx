"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type SiteSettings = {
  wa_number: string;
  hotline: string;
  email: string;
  address_en: string;
  address_bn: string;
};

// Fallbacks match the seeded Firestore values, so the site works even if the API fails.
export const DEFAULT_SETTINGS: SiteSettings = {
  wa_number: "8801711387707",
  hotline: "01711-387707",
  email: "choltihomedecor@gmail.com",
  address_en:
    "Siraj Bhaban (4th Floor), Road-6, Section-7, Mirpur-11 Metro Station (Behind Sailor Outlet, beside Purobi Cinema Hall)",
  address_bn:
    "সিরাজ ভবন (৪র্থ তলা), রোড-৬, সেকশন-৭, মিরপুর-১১ মেট্রো স্টেশন (সেইলর আউটলেটের পেছনে, পুরবী সিনেমা হলের পাশে)",
};

let cached: Promise<SiteSettings> | null = null;

function load(): Promise<SiteSettings> {
  if (!cached) {
    cached = fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => ({ ...DEFAULT_SETTINGS, ...(d.settings ?? {}) }))
      .catch(() => DEFAULT_SETTINGS);
  }
  return cached;
}

export const waLink = (s: SiteSettings) => `https://wa.me/${s.wa_number}`;

export const telLink = (s: SiteSettings) => {
  const digits = s.hotline.replace(/\D/g, "");
  return `tel:+${digits.startsWith("880") ? digits : `88${digits}`}`;
};

const Ctx = createContext<SiteSettings>(DEFAULT_SETTINGS);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  useEffect(() => {
    load().then(setSettings);
  }, []);
  return <Ctx.Provider value={settings}>{children}</Ctx.Provider>;
}

export const useSettings = () => useContext(Ctx);
