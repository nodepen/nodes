module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        vw: '100vh',
        vh: '100vh',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
