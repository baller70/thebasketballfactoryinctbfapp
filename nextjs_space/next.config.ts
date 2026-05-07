import { spawnSync } from "node:child_process";
import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout?.trim() ??
  crypto.randomUUID();

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
});

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images-api.printify.com" },
      { protocol: "https", hostname: "images.printify.com" },
      { protocol: "https", hostname: "cdn.printify.com" },
    ],
  },
  // @serwist/next uses webpack InjectManifest plugin, so we need webpack for builds.
  // Adding an empty turbopack config satisfies Next.js 16's check while still
  // allowing the webpack plugin to operate during production builds.
  turbopack: {},
};

export default withSerwist(nextConfig);
