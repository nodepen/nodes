const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' })

const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = withBundleAnalyzer({
    distDir: 'build',
    publicRuntimeConfig: {
      apiEndpoint: process.env.NEXT_PUBLIC_NP_API_ENDPOINT
    },
    webpack: (config) => {
      config.resolve.fallback = {
        child_process: false,
        constants: false,
        crypto: false,
        "fast-crc32c": false,
        fs: false,
        http: false,
        https: false,
        net: false,
        os: false,
        path: false,
        querystring: false,
        request: false,
        stream: false,
        tls: false,
        worker_threads: false,
        zlib: false
      };

      // The `rhino3dm.wasm` file needs to land where the `rhino3dm.js` gets placed by webpack
      config.plugins.push(new CopyWebpackPlugin({
        patterns: [
          { from: "node_modules/rhino3dm/rhino3dm.wasm", to: "static/chunks/pages/rhino3dm.wasm" },
          { from: "node_modules/rhino3dm/rhino3dm.wasm", to: "static/chunks/pages/[user]/gh/rhino3dm.wasm" }

        ],
      }))

      return config;
    },
})