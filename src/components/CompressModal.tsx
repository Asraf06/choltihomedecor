"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/lang";

const MAX_DIM = 1600;
const MIN_Q = 0.4;
const MAX_Q = 0.95;
const REC_Q = 0.8;

function fmt(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CompressModal({
  file,
  maxBytes,
  onConfirm,
  onCancel,
}: {
  file: File;
  maxBytes: number;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}) {
  const { t } = useLang();
  const [quality, setQuality] = useState(REC_Q);
  const [preview, setPreview] = useState("");
  const [srcUrl, setSrcUrl] = useState("");
  const [outSize, setOutSize] = useState(0);
  const [blob, setBlob] = useState<Blob | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrcUrl(url);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      encode(REC_Q);
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const encode = (q: number) => {
    const img = imgRef.current;
    if (!img || !img.naturalWidth) return;
    const scale = Math.min(1, MAX_DIM / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const mime = file.type === "image/webp" ? "image/webp" : "image/jpeg";
    if (mime === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(img, 0, 0, w, h);
    canvas.toBlob(
      (b) => {
        if (!b) return;
        setBlob(b);
        setOutSize(b.size);
        setPreview((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(b);
        });
      },
      mime,
      q
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => encode(quality), 150);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quality]);

  const originalOk = file.size <= maxBytes;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4">
      <button aria-label="Close" onClick={onCancel} className="absolute inset-0 bg-black/55 cursor-default" />
      <div className="relative w-full max-w-lg bg-paper border border-line rounded-[20px] p-5 max-h-[92vh] overflow-y-auto">
        <b className="font-serif text-xl">{t.compressTitle} ({fmt(file.size)})</b>
        <p className="text-[15px] text-muted mt-1 mb-3">{t.compressSub}</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <small className="text-[13px] font-bold text-muted">ORIGINAL • {fmt(file.size)}</small>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {srcUrl ? <img src={srcUrl} alt="" className="mt-1 w-full h-40 rounded-xl object-cover bg-sand" /> : <span className="mt-1 block w-full h-40 rounded-xl bg-sand" />}
          </div>
          <div>
            <small className="text-[13px] font-bold text-muted">{t.useCompressed} • {outSize ? fmt(outSize) : "…"}</small>
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="mt-1 w-full h-40 rounded-xl object-cover bg-sand" />
            ) : (
              <span className="mt-1 block w-full h-40 rounded-xl bg-sand" />
            )}
          </div>
        </div>
        <label className="block text-base font-bold">
          {t.qualityLbl}: {Math.round(quality * 100)}%
          {quality === REC_Q && <span className="ml-2 text-[13px] bg-forest text-white rounded-full px-2 py-0.5">{t.recommendedLbl}</span>}
          <input
            type="range"
            min={MIN_Q}
            max={MAX_Q}
            step={0.05}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="mt-1.5 w-full"
          />
        </label>
        <div className="flex gap-2 mt-4">
          <button
            disabled={!blob}
            onClick={() => blob && onConfirm(blob)}
            className="flex-1 bg-clay text-white rounded-[35px] py-2.5 text-[16px] font-bold disabled:opacity-50"
          >
            {t.useCompressed} ({outSize ? fmt(outSize) : "…"})
          </button>
          {originalOk && (
            <button onClick={() => onConfirm(file)} className="border border-line rounded-[35px] px-5 py-2 text-[16px] font-bold">
              {t.useOriginal}
            </button>
          )}
        </div>
        <button onClick={onCancel} className="w-full text-center text-[15px] font-bold text-muted mt-2">✕</button>
      </div>
    </div>
  );
}
