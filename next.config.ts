import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,        // creates about/index.html so links work on any host
  images: { unoptimized: true }, // required: next/image optimization needs a server
};

export default nextConfig;