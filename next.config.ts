import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Other configuration options can go here
};

export default nextConfig;
