const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' })

module.exports = withBundleAnalyzer({
    distDir: 'build',
    publicRuntimeConfig: {
      apiEndpoint: process.env.NEXT_PUBLIC_NP_API_URL
    }
})