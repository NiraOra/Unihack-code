import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'api.dicebear.com'
    ],
  },
}

export default nextConfig;
