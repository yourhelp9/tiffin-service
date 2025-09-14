// next.config.js
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export', // static export ke liye
  images: {
    unoptimized: true, // 👈 next/image ko static banane ke liye
  },
  trailingSlash: true, // 👈 export me routing ke liye helpful

  
};

module.exports = nextConfig;
