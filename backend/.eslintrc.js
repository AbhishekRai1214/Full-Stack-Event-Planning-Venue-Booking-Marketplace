module.exports = {
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2022,
  },
  rules: {
    // Error prevention
    'no-console': 'warn', // Use logger instead
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'error',

    // Code quality
    'eqeqeq': ['error', 'always'],
    'no-throw-literal': 'error',
    'no-return-await': 'error',
    'require-await': 'error',

    // Style (Prettier handles formatting, ESLint handles logic)
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
  },
};

