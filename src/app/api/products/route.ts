import { NextResponse } from "next/server";
import { getProducts } from "@/lib/catalog-db";
import { ttlCache } from "@/lib/ttl-cache";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim().toLowerCase() ?? "";
  const matches = await ttlCache("products-mini", 60_000, async () => {
    try {
      const all = await getProducts();
      return all.map((p) => ({ slug: p.slug, name: p.name, bn: p.bn, cat: p.cat, now: p.now, img: p.img }));
    } catch {
      return [];
    }
  });
  const hits = q
    ? matches.filter((p) => `${p.name} ${p.bn} ${p.cat}`.toLowerCase().includes(q)).slice(0, 8)
    : [];
  return NextResponse.json(
    { products: hits },
    { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60" } }
  );
}
