import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No `output: "export"`: the contact forms send mail from API route handlers
  // (nodemailer), which need a running Node server — deploy with `next start`.
  trailingSlash: true,        // creates about/index.html so links work on any host
  images: { unoptimized: true }, // required: next/image optimization needs a server
};

export default nextConfig;