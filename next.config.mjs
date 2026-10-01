/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 420, 640, 768, 1024, 1280, 1600],
    imageSizes: [40, 80, 160, 264, 320, 480],
    qualities: [75, 85],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};
export default nextConfig;
