import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Dev mode e Turbopack er HMR/eval lage, tai dev CSP relaxed.
// Production e strict CSP thakbe.
const csp = isDev
  ? [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:",
      "style-src 'self' 'unsafe-inline' https:",
      "font-src 'self' https: data:",
      "img-src 'self' https: data: blob:",
      "connect-src 'self' ws: wss: https:",
    ].join("; ")
  : [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://unpkg.com https://apis.google.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' https://images.unsplash.com data: blob:",
      "connect-src 'self' https://wa.me https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://www.googleapis.com",
      "frame-src 'self' https://accounts.google.com https://*.firebaseapp.com",
    ].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Pinggy tunnel + Cloud Shell preview theke dev server access er jonno.
  // Note: "*" sudhu single-level subdomain match kore, tai exact host o rakha hoise.
  allowedDevOrigins: [
    "3000-cs-100214279862-default.cs-asia-southeast1-yelo.cloudshell.dev",
    "awvzr-136-85-106-86.run.pinggy-free.link",
    "zqrfh-136-85-106-86.free.pinggy.net",
    "*.run.pinggy-free.link",
    "*.free.pinggy.net",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "localhost", port: "3001" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
