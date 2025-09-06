import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      new URL("https://sqhgtcyhscqhamwquhhu.supabase.co/**"),
      new URL("https://example.com/**"),
    ],
  },
};

export default nextConfig;
