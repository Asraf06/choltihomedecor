import { NextResponse } from "next/server";
import ImageKit from "imagekit";
import { adminAuth } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const MAX_BYTES = 2 * 1024 * 1024;

function extFor(buf: Buffer): string | null {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return "webp";
  return null;
}

export async function POST(req: Request) {
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  let uid = "";
  try {
    uid = (await adminAuth().verifyIdToken(token)).uid;
  } catch {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof Blob)) return NextResponse.json({ error: "No file" }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > MAX_BYTES) return NextResponse.json({ error: "Max 2MB" }, { status: 400 });
  const ext = extFor(buf);
  if (!ext) return NextResponse.json({ error: "Only jpg, png or webp" }, { status: 400 });

  try {
    const up = await new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY ?? "",
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY ?? "",
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT ?? "",
    }).upload({
      file: buf,
      fileName: `profile-${Date.now()}.${ext}`,
      folder: `cholti/shop/avatars/${uid}`,
      useUniqueFileName: false,
    });
    return NextResponse.json({ url: up.url });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 502 });
  }
}
