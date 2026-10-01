import { NextResponse } from "next/server";
import { z } from "zod";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const Body = z.object({
  path: z.string().trim().max(200).refine((v) => v.startsWith("/"), "path only"),
  sid: z.string().trim().min(6).max(40).regex(/^[a-z0-9]+$/i),
});

// At most 120 hits per minute per IP. Shared IPs share the budget.
const hits = new Map<string, { n: number; reset: number }>();

function allowed(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.reset) {
    hits.set(ip, { n: 1, reset: now + 60_000 });
    return true;
  }
  rec.n += 1;
  return rec.n <= 120;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!allowed(ip)) return NextResponse.json({ error: "slow down" }, { status: 429 });
  const parsed = z.object({
    path: z.string().trim().max(200),
    sid: z.string().trim().max(40),
  }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad request" }, { status: 400 });
  const { path, sid } = parsed.data;
  if (!path.startsWith("/") || !/^[a-z0-9]+$/i.test(sid) || sid.length < 6) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  try {
    await adminDb().collection("page_views").add({ path, sid, ts: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: "store failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
