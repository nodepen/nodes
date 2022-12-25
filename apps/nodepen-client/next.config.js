/** @type {import('next').NextConfig} */
const withImages = require('next-images')

const nextConfig = {
  distDir: 'build',
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    disableStaticImages: true,
  }
}

module.exports = withImages(nextConfig)
