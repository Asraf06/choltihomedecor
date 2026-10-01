import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

// Public FAQ list for the chat widget. Managed from the admin panel.
export async function GET() {
  try {
    const snap = await adminDb().collection("faqs").where("active", "==", 1).get();
    const faqs = snap.docs
      .map((d) => {
        const v = d.data();
        return {
          id: d.id,
          order: Number(v.sort_order ?? 0),
          q_en: String(v.q_en ?? ""),
          a_en: String(v.a_en ?? ""),
          q_bn: String(v.q_bn ?? ""),
          a_bn: String(v.a_bn ?? ""),
        };
      })
      .filter((f) => f.q_en || f.q_bn)
      .sort((a, b) => a.order - b.order)
      .map(({ id, q_en, a_en, q_bn, a_bn }) => ({ id, q_en, a_en, q_bn, a_bn }));
    return NextResponse.json(
      { faqs },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" } }
    );
  } catch {
    return NextResponse.json({ faqs: [] });
  }
}
