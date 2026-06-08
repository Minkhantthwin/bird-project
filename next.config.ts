import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Image Optimization ────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    // Add any external image domains here:
    // remotePatterns: [
    //   { protocol: 'https', hostname: 'cdn.example.com' },
    // ],
  },

  // ── Compiler Options ──────────────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // ── Experimental Features (Next.js 16) ────────────
  // Check node_modules/next/dist/docs/ for current API
};

export default nextConfig;
