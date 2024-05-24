const fs = require('fs');

const foldersUnderSrc = fs
  .readdirSync('./src', { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

module.exports = {
  root: true,
  env: { node: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@tanstack/query/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:@next/next/recommended',
    'plugin:storybook/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['filenames', 'import'],
  rules: {
    eqeqeq: ['error', 'always', { null: 'never' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'sort-imports': ['error', { ignoreDeclarationSort: true, ignoreCase: true }],
    'filenames/match-regex': ['error', '^[0-9a-z-.]+$'],
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc' },
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        pathGroups: [{ pattern: `{${foldersUnderSrc.join(',')}}{,/**}`, group: 'internal' }],
        pathGroupsExcludedImportTypes: [],
      },
    ],
    'react/prop-types': 'off',
    'react/self-closing-comp': 'error',
  },
  overrides: [
    {
      files: ['*.{ts,tsx}'],
      extends: ['plugin:@typescript-eslint/recommended'],
      parserOptions: {
        project: 'tsconfig.json',
      },
      rules: {
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/strict-boolean-expressions': [
          'error',
          { allowString: false, allowNumber: false, allowNullableObject: false },
        ],
      },
    },
  ],
  settings: { react: { version: 'detect' } },
  reportUnusedDisableDirectives: true,
};
