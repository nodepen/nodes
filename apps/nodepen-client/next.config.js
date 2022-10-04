/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['@nodepen/nodes', '@nodepen/core', '@speckle/viewer'], { resolveSymlinks: false })

const nextConfig = {
  distDir: 'build',
  reactStrictMode: true,
}

module.exports = withTM(nextConfig)
