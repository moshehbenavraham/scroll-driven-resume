import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: "standalone",

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Image optimization configuration
  images: {
    // Remote patterns for asset loading via nginx proxy (primary) and MinIO direct (fallback)
    remotePatterns: [
      {
        // Primary: Nginx proxy with caching and CORS
        protocol: "http",
        hostname: "localhost",
        port: "8089",
        pathname: "/assets/**",
      },
      {
        // Legacy: MinIO with resume-assets prefix (if bucket created)
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/resume-assets/**",
      },
      {
        // Fallback: Direct MinIO bucket access (frames-desktop bucket)
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/frames-desktop/**",
      },
      {
        // Fallback: Direct MinIO bucket access (frames-mobile bucket)
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/frames-mobile/**",
      },
    ],
    // Supported image formats
    formats: ["image/avif", "image/webp"],
  },

  // Experimental features
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ["clsx", "tailwind-merge"],
  },

  // Disable powered by header for security
  poweredByHeader: false,
};

export default withBundleAnalyzer(nextConfig);
