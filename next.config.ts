import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    // Cloudflare Workers has no built-in Next.js image optimizer. The only
    // next/image on the site is the 44px header logo, already a small WebP.
    unoptimized: true,
  },
};

export default nextConfig;

// Lets `next dev` use Cloudflare bindings locally. No effect on Vercel builds.
initOpenNextCloudflareForDev();
