module.exports = {
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