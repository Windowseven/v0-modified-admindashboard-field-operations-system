import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Next.js will now fail the build if there are type errors.
  },
  outputFileTracingRoot: __dirname,
  images: {
    unoptimized: true,
    qualities: [75, 90],
  },
}

export default nextConfig
