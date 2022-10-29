/** @type {import('next').NextConfig} */
// const withTM = require('next-transpile-modules')(['@nodepen/nodes', '@nodepen/core'], { resolveSymlinks: false })
const withImages = require('next-images')

const nextConfig = {
  distDir: 'build',
  reactStrictMode: false,
  experimental: {
    appDir: true,
  },
  images: {
    disableStaticImages: true,
  },
}

module.exports = withImages(nextConfig)

// module.exports = withImages(withTM(nextConfig))
