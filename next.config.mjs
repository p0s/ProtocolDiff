/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/README.md',
        destination: '/readme',
        permanent: false
      }
    ]
  }
}

export default nextConfig
