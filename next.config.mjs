/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'commondatastorage.googleapis.com',
      '57a7974316b8f51b53c7a4f7e118861d.r2.cloudflarestorage.com'
    ]
  }
};

export default nextConfig;
