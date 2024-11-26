import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "out",
  // Required for GitHub Pages deployment - turn off when deploying to domain
  basePath: process.env.NODE_ENV === "production" ? "/pwa" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
