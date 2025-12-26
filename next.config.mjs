/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true, // Ye already sahi hai (React 19 feature)
  
  // 1. Heavy Libraries ko Optimize karein (Bundle size kam karega)
  experimental: {
    optimizePackageImports: [
      'react-icons', 
      'lucide-react', 
      'framer-motion', 
      'date-fns', // Agar use ho raha ho to
      '@vercel/analytics',
      '@vercel/speed-insights'
    ],
  },

  // 2. Images ko Modern Formats me serve karein
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // 3. Build ke dauran Type Checking aur Linting skip karein (Deploy fast hoga)
  // (Development me error dikhenge, but production build nahi rukega)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;