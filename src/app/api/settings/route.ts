import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { ttlCache } from "@/lib/ttl-cache";

export const runtime = "nodejs";

const DEFAULTS: Record<string, string> = {
  wa_number: "8801711387707",
  hotline: "01711-387707",
  email: "choltihomedecor@gmail.com",
  address_en:
    "Siraj Bhaban (4th Floor), Road-6, Section-7, Mirpur-11 Metro Station (Behind Sailor Outlet, beside Purobi Cinema Hall)",
  address_bn:
    "সিরাজ ভবন (৪র্থ তলা), রোড-৬, সেকশন-৭, মিরপুর-১১ মেট্রো স্টেশন (সেইলর আউটলেটের পেছনে, পুরবী সিনেমা হলের পাশে)",
  font_scale: "100",
};

export type ZoneRow = { id: string; name_en: string; name_bn: string; charge: number };

const DEFAULT_ZONES: ZoneRow[] = [
  { id: "inside-dhaka", name_en: "Inside Dhaka", name_bn: "ঢাকার ভিতরে", charge: 80 },
  { id: "outside-dhaka", name_en: "Outside Dhaka", name_bn: "ঢাকার বাইরে", charge: 130 },
];

// Website display settings managed from the admin panel (contact info, font size, etc).
export async function GET() {
  const [settings, zones] = await Promise.all([
    ttlCache("settings", 60_000, async () => {
      const out = { ...DEFAULTS };
      try {
        const db = adminDb();
        await Promise.all(
          Object.keys(DEFAULTS).map(async (key) => {
            const snap = await db.doc(`settings/${key}`).get();
            const v = snap.data()?.value;
            if (typeof v === "string" && v) {
              if (key === "font_scale" && !["90", "100", "112", "125"].includes(v)) return;
              out[key] = v;
            }
          })
        );
      } catch {}
      return out;
    }),
    ttlCache("delivery-zones", 60_000, async (): Promise<ZoneRow[]> => {
      try {
        const snap = await adminDb().collection("delivery_zones").where("active", "==", 1).get();
        const rows = snap.docs
          .map((d) => {
            const v = d.data();
            return {
              id: d.id,
              name_en: String(v.name_en ?? ""),
              name_bn: String(v.name_bn ?? ""),
              charge: Number(v.charge ?? 0),
              order: Number(v.sort_order ?? 0),
            };
          })
          .filter((z) => z.name_en && Number.isFinite(z.charge) && z.charge >= 0)
          .sort((a, b) => a.order - b.order)
          .map(({ id, name_en, name_bn, charge }) => ({ id, name_en, name_bn, charge }));
        return rows.length ? rows : DEFAULT_ZONES;
      } catch {
        return DEFAULT_ZONES;
      }
    }),
  ]);
  return NextResponse.json(
    {
      settings: {
        wa_number: settings.wa_number,
        hotline: settings.hotline,
        email: settings.email,
        address_en: settings.address_en,
        address_bn: settings.address_bn,
      },
      font_scale: settings.font_scale,
      zones,
    },
    { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60" } }
  );
}
