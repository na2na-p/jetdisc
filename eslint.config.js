import eslintJs from '@eslint/js';
import typescriptEslintParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import importRules from 'eslint-plugin-import';

const importCustomRules = {
  'import/no-duplicates': 'error',
  'import/order': [
    'error',
    {
      groups: ['builtin', 'external'],
      pathGroups: [
        {
          pattern: '@/**',
          group: 'external',
          position: 'after',
        },
      ],
      alphabetize: {
        order: 'asc',
      },
      'newlines-between': 'always',
    },
  ],
  'import/no-extraneous-dependencies': [
    'error',
    {
      devDependencies: ['**/*spec.[jt]s'],
      optionalDependencies: false,
      peerDependencies: false,
    },
  ],
};

const typescriptEslintCustomRules = {
  '@typescript-eslint/interface-name-prefix': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
    },
  ],
  '@typescript-eslint/consistent-type-imports': [
    'error',
    {
      prefer: 'type-imports',
    },
  ],
  '@typescript-eslint/naming-convention': [
    'error',
    {
      selector: 'typeAlias',
      format: ['PascalCase'],
    },
  ],
  'no-restricted-imports': 'off',
  '@typescript-eslint/no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: [
            './*/**/internal/**/*',
            '@/**/internal/**/*',
            '../**/internal/**/*',
            '@/features/**/internal/**/*',
          ],
          message: 'Do not import internal modules.',
        },
      ],
    },
  ],
};

/**
 * @type {import('eslint').Linter.FlatConfig[]}
 */
export default [
  {
    files: ['src/**/*.{js,ts,mjs,mts,cjs,cts,jsx,tsx}'],
    ignores: ['**/dist/**', 'eslint.config.js'],
    languageOptions: {
      parser: typescriptEslintParser,
    },
    plugins: { '@typescript-eslint': typescriptEslint, import: importRules },
    rules: {
      ...eslintJs.configs.recommended.rules,
      ...typescriptEslint.configs.recommended.rules,
      ...typescriptEslint.configs['eslint-recommended'].rules,
      ...importCustomRules,
      ...typescriptEslintCustomRules,
      'no-undef': 'off',
      'no-console': 'error',
      'object-shorthand': 'error',
      'no-case-declarations': 'off',
    },
    settings: {
      'import/internal-regex': '^~/',
      'import/resolver': {
        node: {
          extensions: ['.ts', '.tsx'],
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
];
