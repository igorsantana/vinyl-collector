import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@cyberdeck/ui"],
  experimental: {
    externalDir: true,
  },
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  output: "standalone",
  images: {
    remotePatterns: [],
    unoptimized: false,
  },
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
