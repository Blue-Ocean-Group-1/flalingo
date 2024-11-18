import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import configAirbnb from 'eslint-config-airbnb';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import testingLibrary from 'eslint-plugin-testing-library';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...configAirbnb.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      semi: ['error', 'always'],
      'no-unused-vars': ['warn', { varsIgnorePattern: '^React$' }],
      'prettier/prettier': [
        'error',
        {
          indent: ['error', 2],
          singleQuote: true,
        },
      ],
    },
  },
  {
    files: [
      '**/__tests__/**/*.[jt]s?(x)',
      '**/?(*.)+(spec|test).[jt]s?(x)',
      '**/*.test.mjs',
      '**/*.test.cjs',
    ],
    ...testingLibrary.configs['flat/react'],
    ...testingLibrary.configs['flat/dom'],
    plugins: {
      'testing-library': testingLibrary,
    },
    languageOptions: {
      globals: {
        ...globals.jestDom,
        ...globals.testingLibrary,
      },
    },
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      ...testingLibrary.configs['flat/dom'].rules,
      semi: ['error', 'always'],
      'no-unused-vars': ['warn', { varsIgnorePattern: '^React$' }],
      'prettier/prettier': [
        'error',
        {
          indent: ['error', 2],
          singleQuote: true,
        },
      ],
    },
  },
];
