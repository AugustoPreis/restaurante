import js from '@eslint/js';
import react from 'eslint-plugin-react';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: [
      '**/*.{js,jsx}',
    ],
    plugins: {
      react,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-dupe-keys': 'warn',
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'arrow-spacing': 'warn',
      'react/jsx-max-props-per-line': 'warn',
      'react/jsx-no-duplicate-props': 'warn',
      'react/void-dom-elements-no-children': 'warn',
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'react/no-unknown-property': 'warn',
      'react/jsx-filename-extension': 'off',
      'react/jsx-uses-react': 'warn',
      'react/jsx-uses-vars': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];