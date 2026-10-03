import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT ?? "";
  let projectId = "";
  let keyOk = false;
  try {
    const parsed = JSON.parse(raw) as { project_id?: unknown };
    if (typeof parsed.project_id === "string") {
      projectId = parsed.project_id;
      keyOk = true;
    }
  } catch {}
  return NextResponse.json({
    hasFirebaseSA: raw.length > 0,
    saLength: raw.length,
    saProjectId: projectId,
    keyOk,
    hasRevalidateSecret: (process.env.REVALIDATE_SECRET ?? "").length > 0,
    hasImagekit: (process.env.IMAGEKIT_PRIVATE_KEY ?? "").length > 0,
    buildTime: process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
  });
}
