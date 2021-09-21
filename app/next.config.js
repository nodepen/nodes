const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' })

module.exports = withBundleAnalyzer({
    distDir: 'build',
    publicRuntimeConfig: {
      apiEndpoint: 'https://api.nodepen.io/graphql'
    }
})