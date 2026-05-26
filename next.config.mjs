/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { remotePatterns: [] },
  experimental: { serverActions: { bodySizeLimit: "5mb" } },
};

export default nextConfig;
