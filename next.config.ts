import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push("@libsql/client");
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/.well-known/openid-configuration",
        // destination: "https://jsonplaceholder.typicode.com/todos/1",
        destination:
          "https://betterauth-convex-nextjs.vercel.app/api/.well-known/openid-configuration",
      },
      {
        source: "/.well-known/jwks.json",

        destination:
          "https://betterauth-convex-nextjs.vercel.app/api/auth/jwks",
      },
    ];
  },
};

export default nextConfig;
