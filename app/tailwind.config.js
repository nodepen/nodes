/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
module.exports = {
  purge: [
    './components/**/*.tsx',
    './layouts/**/*.tsx',
    './pages/**/*.tsx',
  ],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  theme: {
    fontFamily: {
      barlow: ['Barlow', 'sans-serif'],
      panel: ['Major Mono Display', 'monospace'],
      display: [ 'Nova Mono', 'NovaMono', 'monospace'],
      sans: ['Inter', 'sans-serif']
    },
    extend: {
      screens: {
        "xs": '400px'
      },
      boxShadow: {
        'osm': '0 2px 0 0 #333333',
        'omd': '0 3px 0 0 #333333',
        'ism': '0 -2px 0 0 #333333'
      },
      colors: {
        dark: '#333333',
        light: '#FFFFFF',
        pale: '#eff2f2',
        green: '#98E2C6',
        swampgreen: '#7BBFA5',
        darkgreen: '#093824'
      },
      height: {
        'vw': '100vh',
        'vh': '100vh'
      },
      minHeight: {
        '10': '2.5rem',
        '12': '3rem'
      },
      minWidth: {
        '8': '32px'
      },
      spacing: {
        'hov-sm': '-2px',
        '76': '304px',
        '128': '512px'
      },
      width: {
        'vw': '100vw',
        'vh': '100vh'
      },      
    }
  },
  variants: {
    cursor: ['responsive, hover']
  },
  plugins: []
}
