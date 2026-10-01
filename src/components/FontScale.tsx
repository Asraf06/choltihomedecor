"use client";

import { useEffect } from "react";

// Applies the admin-controlled font scale to the whole site.
// Runs client-side so pages stay statically prerendered.
export default function FontScale() {
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        const v = Number(d.font_scale ?? 100);
        if (v >= 80 && v <= 130 && v !== 100) {
          document.body.style.zoom = String(v / 100);
        }
      })
      .catch(() => {});
  }, []);
  return null;
}
