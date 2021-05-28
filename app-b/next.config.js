const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE })

module.exports = withBundleAnalyzer({
    future: {
        webpack5: true,
    },
    distDir: 'build',
})