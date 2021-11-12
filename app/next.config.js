const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' })

const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = withBundleAnalyzer({
    distDir: 'build',
    publicRuntimeConfig: {
      apiEndpoint: process.env.NEXT_PUBLIC_NP_API_ENDPOINT
    },
    webpack: (config) => {
      config.resolve.fallback = {
        fs: false,
        path: false,
      };

      // The `rhino3dm.wasm` file needs to land where the `rhino3dm.js` gets placed by webpack
      config.plugins.push(new CopyWebpackPlugin({
        patterns: [
          { from: "node_modules/rhino3dm/rhino3dm.wasm", to: "static/chunks/pages/rhino3dm.wasm" }
        ],
      }))

      return config;
    },
})