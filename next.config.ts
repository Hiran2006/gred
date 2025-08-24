import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images:{
    remotePatterns:[new URL("https://sqhgtcyhscqhamwquhhu.supabase.co/**")]
  }
};

export default nextConfig;
