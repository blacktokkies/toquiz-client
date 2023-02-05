module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
    browser: true,
    jest: true,
  },
  globals: {
    JSX: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'standard-with-typescript',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  ignorePatterns: [
    '.eslintrc.cjs',
    'public',
    'dist',
    '**/*.config.ts',
    '**/*.config.js',
  ],
  rules: {
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
