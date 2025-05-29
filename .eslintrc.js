module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prefer-const': 'off',
    // Add specific rules for files causing issues
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'react-hooks/exhaustive-deps': 'off'
  },
  // Ignore specific files or directories if needed
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'public/'
  ]
};
