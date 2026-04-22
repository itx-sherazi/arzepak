import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/register", destination: "/dealer/register", permanent: false }];
  },
};

export default nextConfig;
