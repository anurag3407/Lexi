import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  webpack : (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },  

  /* config options here */
};


export default nextConfig;
