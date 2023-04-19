/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  images: { 
    domains: ['firebasestorage.googleapis.com'],
    unoptimized: false
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
}
const WithPWA = require('next-pwa');
WithPWA({
  pwa: {
		dest: "public",
		register: true,
        disable: process.env.NODE_ENV === 'development',
		skipWaiting: true,
	}
});
module.exports = WithPWA
module.exports = nextConfig