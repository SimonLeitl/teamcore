import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    AUTH_PUBLIC_SUPABASE_URL: process.env.AUTH_PUBLIC_SUPABASE_URL,
    AUTH_PUBLIC_SUPABASE_ANON_KEY: process.env.AUTH_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export default nextConfig;
