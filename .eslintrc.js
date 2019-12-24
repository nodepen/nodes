module.exports = {
    root: true,
    parserOptions: {
        parser: '@typescript-eslint/parser',
    },
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:vue/recommended'
    ],
  };