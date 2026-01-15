import "./env.config"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: false,
  transpilePackages: ["@lobehub/icons"],
  experimental: {
    optimizePackageImports: ["lucide-react", "@icons-pack/react-simple-icons", "@lobehub/icons"],
  },
}

export default nextConfig
