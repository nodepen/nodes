/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['@nodepen/nodes', '@nodepen/core'], { resolveSymlinks: false })
const withImages = require('next-images')

const nextConfig = {
  distDir: 'build',
  reactStrictMode: true,
  images: {
    disableStaticImages: true,
  },
}

module.exports = withImages(withTM(nextConfig))
