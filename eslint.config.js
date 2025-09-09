// ESLint v9+ config migration from .eslintrc.json and .eslintignore
export default [
  {
    ignores: [
      'node_modules/',
      'build/',
      'dist/',
      '.next/',
      '.expo/',
      '.expo-shared/'
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
    },
    plugins: {
      react: require('eslint-plugin-react'),
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended'
    ],
  }
];
