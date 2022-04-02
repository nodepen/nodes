module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './features/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nodepen/nodes/dist/**/*.tsx',
  ],
  theme: {
    extend: {
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
