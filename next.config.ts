import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required by the deploy template's Dockerfile, which ships the
  // standalone build. Without this there is no .next/standalone to copy
  // and the image build fails.
  output: "standalone",
};

export default nextConfig;
