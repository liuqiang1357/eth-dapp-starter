const fs = require('fs');

const foldersUnderSrc = fs
  .readdirSync('./src', { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

module.exports = {
  root: true,
  extends: [
    'react-app',
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@tanstack/query/recommended',
  ],
  plugins: ['import'],
  rules: {
    eqeqeq: ['error', 'always', { null: 'never' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'sort-imports': ['error', { ignoreDeclarationSort: true, ignoreCase: true }],
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc' },
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        pathGroups: [{ pattern: `{${foldersUnderSrc.join(',')}}{,/**}`, group: 'internal' }],
        pathGroupsExcludedImportTypes: [],
      },
    ],
    'jsx-a11y/alt-text': 'off',
    'react/self-closing-comp': 'error',
  },
  overrides: [
    {
      files: ['*.{ts,tsx}'],
      extends: ['plugin:@typescript-eslint/recommended'],
      parserOptions: {
        project: './tsconfig.json',
      },
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': [
          'error',
          { allowArgumentsExplicitlyTypedAsAny: true },
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/strict-boolean-expressions': ['error'],
      },
    },
    {
      files: ['**/hooks/*.ts?(x)'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
};
