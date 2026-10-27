import type { NextConfig } from "next";

// Static export: `npm run build` writes a plain HTML/CSS/JS site to ./out
// that can be hosted anywhere (S3 + CloudFront, Nginx, Netlify, etc.).
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
