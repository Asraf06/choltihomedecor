import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const runtime = "nodejs";

const Body = z.object({ paths: z.array(z.string().max(200)).min(1).max(20) });

// Called by the admin panel after content changes so the shop updates immediately.
export async function POST(req: Request) {
  const secret = req.headers.get("x-revalidate-secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const body = Body.parse(await req.json());
  for (const p of body.paths) {
    if (p.startsWith("/")) revalidatePath(p);
  }
  return NextResponse.json({ ok: true });
}
