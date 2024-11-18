import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  { ignores: ['node_modules', 'dist', 'coverage', 'src/seedData'] },
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      import: importPlugin,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc' },
        },
      ],
      'no-console': ['error', { allow: ['warn'] }],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'dotenv',
              message:
                "Please import { env } from '/src/config/env.js' instead of using dotenv directly.",
            },
          ],
          patterns: [
            {
              group: ['dotenv/*', 'dotenv/**'],
              message:
                "Please import { env } from '/src/config/env.js' instead of using dotenv directly.",
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.object.name='console']",
          message:
            "Using 'console' methods is not allowed. Please use the custom logger instead (import from 'src/config/logger.js').",
        },
      ],
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'all',
          tabWidth: 2,
          printWidth: 80,
          semi: true,
        },
      ],
    },
  },
  {
    files: ['**/__tests__/**/*.js', '**/*.test.js', '**/*.spec.js'],
    plugins: {},
    languageOptions: {
      globals: {},
    },
    rules: {},
  },
];
