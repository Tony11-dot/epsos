import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root (multiple lockfiles exist in parent dirs).
  turbopack: { root: import.meta.dirname },
  images: {
    // Uploaded images are served either from /uploads (local dev) or from a
    // Vercel Blob store in production. Allow remote blob URLs when configured.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lenis"],
  },
};

export default nextConfig;
