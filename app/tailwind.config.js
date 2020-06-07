/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
module.exports = {
  purge: [
    './components/**/*.vue',
    './layouts/**/*.vue',
    './pages/**/*.vue',
  ],
  theme: {
    fontFamily: {
      display: [ 'Nova Mono', 'NovaMono', 'monospace'],
      sans: ['Inter', 'sans-serif']
    },
    extend: {
      spacing: {
        'hov-sm': '-2px',
        '76': '304px',
        '128': '512px'
      },
      colors: {
        dark: '#333333',
        light: '#FFFFFF',
        pale: '#eff2f2',
        green: '#98E2C6',
        darkgreen: '#093824'
      },
      width: {
        'vw': '100vw',
        'vh': '100vh'
      },
      height: {
        'vw': '100vh',
        'vh': '100vh'
      },
      boxShadow: {
        'osm': '0 2px 0 0 #333333',
        'omd': '0 4px 0 0 #333333'
      },
    }
  },
  variants: {
    cursor: ['responsive, hover']
  },
  plugins: []
}
