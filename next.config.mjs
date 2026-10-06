/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [new URL('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/**')],
  },
}

export default nextConfig
