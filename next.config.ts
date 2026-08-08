import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required by the deploy template's Dockerfile, which ships the
  // standalone build. Without this there is no .next/standalone to copy
  // and the image build fails.
  output: "standalone",

  images: {
    // Product photography is served straight from the brands' own CDNs to the
    // phone, rather than through Next's optimizer.
    //
    // The optimizer would work: sharp is an optional dependency of next 16 and
    // its linuxmusl binaries are in the lockfile, so `npm ci` on alpine
    // installs it and the trace pulls it into .next/standalone, which the
    // Dockerfile copies whole. But it puts a per-image, request-time fetch out
    // of the container and onto a brand's CDN on the critical path of every
    // screen — a dependency that fails green at build and dark at runtime,
    // which is exactly how this app has broken twice before.
    //
    // Nothing much is lost by going direct: Shopify-shaped CDNs, which is what
    // the scrape criteria select for, resize on demand from ?width=. lib/images
    // asks them for the size each surface needs. Revisit if a brand that
    // doesn't resize gets added — that is the case this trade gives up.
    unoptimized: true,

    // Inert while unoptimized is true, and kept deliberately: turning the
    // optimizer on without these is an immediate 400 on every image.
    remotePatterns: [
      { protocol: "https", hostname: "uskees.com", pathname: "/cdn/shop/**" },
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
