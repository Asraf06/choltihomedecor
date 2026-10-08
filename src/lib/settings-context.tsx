"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type SiteSettings = {
  wa_number: string;
  hotline: string;
  email: string;
  address_en: string;
  address_bn: string;
  zones: DeliveryZone[];
};

export type DeliveryZone = { id: string; name_en: string; name_bn: string; charge: number };

// Fallbacks match the seeded Firestore values, so the site works even if the API fails.
export const DEFAULT_ZONES: DeliveryZone[] = [
  { id: "inside-dhaka", name_en: "Inside Dhaka", name_bn: "ঢাকার ভিতরে", charge: 80 },
  { id: "outside-dhaka", name_en: "Outside Dhaka", name_bn: "ঢাকার বাইরে", charge: 130 },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  wa_number: "8801711387707",
  hotline: "01711-387707",
  email: "choltihomedecor@gmail.com",
  address_en:
    "Siraj Bhaban (4th Floor), Road-6, Section-7, Mirpur-11 Metro Station (Behind Sailor Outlet, beside Purobi Cinema Hall)",
  address_bn:
    "সিরাজ ভবন (৪র্থ তলা), রোড-৬, সেকশন-৭, মিরপুর-১১ মেট্রো স্টেশন (সেইলর আউটলেটের পেছনে, পুরবী সিনেমা হলের পাশে)",
  zones: DEFAULT_ZONES,
};

export const zoneLabel = (z: DeliveryZone, lang: "en" | "bn") =>
  `${lang === "bn" ? z.name_bn || z.name_en : z.name_en} (${z.charge}৳)`;

let cached: Promise<SiteSettings> | null = null;

const cleanZones = (v: unknown): DeliveryZone[] => {
  if (!Array.isArray(v)) return DEFAULT_ZONES;
  const rows = (v as unknown[])
    .map((z) => {
      const o = (z ?? {}) as Record<string, unknown>;
      return {
        id: String(o.id ?? ""),
        name_en: String(o.name_en ?? ""),
        name_bn: String(o.name_bn ?? ""),
        charge: Number(o.charge ?? NaN),
      };
    })
    .filter((z) => z.id && z.name_en && Number.isFinite(z.charge) && z.charge >= 0);
  return rows.length ? rows : DEFAULT_ZONES;
};

function load(): Promise<SiteSettings> {
  if (!cached) {
    cached = fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => ({ ...DEFAULT_SETTINGS, ...(d.settings ?? {}), zones: cleanZones(d.zones) }))
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
