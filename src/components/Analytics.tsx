"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Logs a page view to /api/track. No personal data, skipped when Do Not Track is on.
export default function Analytics() {
  const path = usePathname();

  useEffect(() => {
    try {
      if (navigator.doNotTrack === "1") return;
      let sid = sessionStorage.getItem("cholti_sid");
      if (!sid) {
        sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
        sessionStorage.setItem("cholti_sid", sid);
      }
      const seen = JSON.parse(sessionStorage.getItem("cholti_seen") ?? "[]") as string[];
      if (seen.includes(path)) return;
      sessionStorage.setItem("cholti_seen", JSON.stringify([...seen.slice(-19), path]));
      const body = JSON.stringify({ path, sid });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      } else {
        fetch("/api/track", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true }).catch(() => {});
      }
    } catch {
      // tracking must never break the shop
    }
  }, [path]);

  return null;
}
