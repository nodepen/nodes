module.exports = {
  distDir: 'build',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/teaser',
        permanent: false,
      },
    ]
  },
}