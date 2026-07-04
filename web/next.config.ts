import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vamora.vercel.app",
        pathname: "/res/**",
      },
    ],
  },
};

export default nextConfig;
