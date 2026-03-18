import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xatukhjpbbpolxaxngia.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/product_pictures/**',
      },
    ],
  },
};

export default nextConfig;
