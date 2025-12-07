import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@boundaryml/baml"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
};

export default nextConfig;
