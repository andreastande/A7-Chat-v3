import type { NextConfig } from "next"
import "./env.config"

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: false,
  transpilePackages: ["@lobehub/icons"],
}

export default nextConfig
