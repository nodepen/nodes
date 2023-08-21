module.exports = {
  prefix: "np-",
  content: ["./src/**/*.tsx"],
  theme: {
    colors: {
      "dark": "#414141",
      "light": "#FFFFFF",
      "grey": "#E7E7E7",
      "grey-2": "#D8D8D8",
      "pale": "#EFF2F2",
      "green": "#98E2C6",
      "swampgreen": "#7BBFA5",
      "darkgreen": "#093824",
      "error": "#FF7171",
      "error-2": "#DD6363",
      "warn": "#FFBE71",
      "warn-2": "#E3AF71",
    },
    fontFamily: {
      'sans': ['Barlow', 'ui-sans-serif'],
      'mono': ['Overpass Mono', 'monospace'],
      'panel': ['Overpass']
    },
    extend: {
      animation: {
        'march': 'march 1000ms infinite ease-in-out',
        'march-rotate': 'march-rotate 1000ms infinite ease-in-out',
        'menu-appear': 'menu-appear 125ms ease-in forwards'
      },
      keyframes: {
        'march': {
          'to': { 'stroke-dashoffset': '0' }
        },
        'march-rotate': {
          'from': { 'transform': 'rotate(0)' },
          'to': { 'transform': 'rotate(90deg)' }
        },
        'menu-appear': {
          '0%': { 'max-height': '0px' },
          '100%': { 'max-height': 'var(--np-active-menu-height)' }
        }
      },
      boxShadow: {
        main: '-2px 2px 0 0 rgba(123, 191, 165, 0.3)',
        modal: '-4px 4px 0 0 rgba(65, 65, 65, 0.3)',
        input: 'inset -2px 2px 0px 0px rgba(123, 191, 165, 0.3)'
      },
      height: {
        vh: '100vh',
        vw: '100vw',
      },
      width: {
        vh: '100vh',
        vw: '100vw',
      },
    },
  },
  plugins: [],
}
