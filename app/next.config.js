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
  async exportPathMap() {
    return {
      '/': { page: '/teaser' },
      '/teaser': { page: '/teaser' },
      '/alpha': { page: '/alpha' }
    }
  }
}