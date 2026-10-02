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

// Website display settings managed from the admin panel (contact info, font size, etc).
export async function GET() {
  const settings = await ttlCache("settings", 60_000, async () => {
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
  });
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
    },
    { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60" } }
  );
}
