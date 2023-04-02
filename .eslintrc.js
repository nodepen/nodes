module.exports = {
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@next/next/recommended',
    'plugin:@typescript-eslint/recommended',
    "plugin:jsx-a11y/recommended",
    'prettier'
  ],
  ignorePatterns: [
    '*.js',
    '*.json',
    '*.spec.ts',
    'build',
    'dist',
    'node_modules'
  ],
  overrides: [
    {
      files: [
        "*.ts",
        "*.tsx"
      ],
      rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/explicit-module-boundary-types": [
          0
        ],
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            "argsIgnorePattern": "^_",
            "varsIgnorePattern": "^_",
            "caughtErrorsIgnorePattern": "^_"
          }
        ]
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      './tsconfig.eslint.json',
      './apps/nodepen-client/tsconfig.json',
      './packages/core/tsconfig.json',
      './packages/nodes/tsconfig.json'
    ]
  },
  plugins: [
    '@typescript-eslint'
  ],
  root: true
}