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

      // config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm'
      // config.experiments = { asyncWebAssembly: true }

      config.plugins.push(new CopyWebpackPlugin({
        patterns: [
          { from: "node_modules/rhino3dm/rhino3dm.wasm", to: "static/chunks/pages/rhino3dm.wasm" }
        ],
      }))

      return config;
    },
})