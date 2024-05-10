const fs = require('fs');

const foldersUnderSrc = fs
  .readdirSync('./src', { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

module.exports = {
  root: true,
  env: { browser: true, node: true, es2020: true },
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
  plugins: ['import'],
  parserOptions: {
    sourceType: 'module',
  },
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
    'react/prop-types': 'off',
    'react/self-closing-comp': 'error',
  },
  reportUnusedDisableDirectives: true,
  overrides: [
    {
      files: ['*.{ts,tsx}'],
      extends: ['plugin:@typescript-eslint/recommended'],
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/strict-boolean-expressions': [
          'error',
          { allowString: false, allowNumber: false, allowNullableObject: false },
        ],
      },
    },
  ],
  ignorePatterns: ['!.*', 'node_modules', '.next'],
  settings: { react: { version: 'detect' } },
};
