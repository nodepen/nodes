/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  purge: ['./components/**/*.tsx', './layouts/**/*.tsx', './pages/**/*.tsx'],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  theme: {
    fontFamily: {
      panel: ['Overpass Mono', 'monospace'],
      display: ['Nova Mono', 'NovaMono', 'monospace'],
      sans: ['Barlow Semi Condensed', 'Inter', 'sans-serif'],
    },
    scale: {
      '1000': '10',
    },
    extend: {
      screens: {
        xs: '400px',
      },
      boxShadow: {
        osm: '0 2px 0 0 #333333',
        omd: '0 3px 0 0 #333333',
        ism: '0 -2px 0 0 #333333',
      },
      colors: {
        dark: '#333333',
        light: '#FFFFFF',
        pale: '#eff2f2',
        green: '#98E2C6',
        swampgreen: '#7BBFA5',
        darkgreen: '#093824',
        warn: '#FFBE71',
        error: 'FF7171'
      },
      height: {
        vw: '100vh',
        vh: '100vh',
      },
      minHeight: {
        '10': '2.5rem',
        '12': '3rem',
      },
      minWidth: {
        '8': '32px',
        '64': '16rem',
      },
      spacing: {
        'hov-sm': '-2px',
        '76': '304px',
        '128': '512px',
      },
      width: {
        vw: '100vw',
        vh: '100vh',
      },
      keyframes: {
        swell: {
          '0%, 100%': {
            transform: 'scale(0.85)',
            'transform-origin': 'center',
          },
          '50%': {
            transform: 'scale(1)',
            'transform-origin': 'center',
          },
        },
        swellbig: {
          '0%, 100%': {
            transform: 'scale(0.5)',
            'transform-origin': 'center',
          },
          '50%': {
            transform: 'scale(2)',
            'transform-origin': 'center',
          },
        },
        scroll: {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(-100%)',
          },
        },
      },
      animation: {
        swell: 'swell 3200ms ease-in-out infinite',
        scroll: 'scroll 3200ms linear infinite',
      },
      transitionProperty: {
        height: 'height',
        width: 'width',
        default: 'opacity, margin, padding, border-radius',
      },
    },
  },
  variants: {
    cursor: ['responsive, hover'],
  },
  plugins: [],
}
