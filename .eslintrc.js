// eslint.config.js
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
    },
    rules: {
      // --- TypeScript ---
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-inferrable-types': 'warn',

      // --- Code Clarity ---
      'no-else-return': 'error',
      'no-useless-return': 'error',
      'no-unneeded-ternary': 'warn',
      'no-nested-ternary': 'warn',
      'no-magic-numbers': [
        'warn',
        { ignore: [0, 1, -1], ignoreArrayIndexes: true, enforceConst: true },
      ],

      // --- Import Hygiene ---
      'import/no-default-export': 'warn',
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-duplicates': 'error',

      // --- React Specific ---
      'react/jsx-boolean-value': ['warn', 'never'],
      'react/self-closing-comp': 'warn',
      'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
      'react/jsx-handler-names': [
        'warn',
        {
          eventHandlerPrefix: 'handle',
          eventHandlerPropPrefix: 'on',
        },
      ],

      // --- Naming & Readability ---
      camelcase: ['error', { properties: 'never' }],
      'id-length': ['warn', { min: 2 }],
      'func-style': ['warn', 'declaration', { allowArrowFunctions: true }],
      'consistent-return': 'error',
      'prefer-template': 'warn',
      'no-shadow': 'error',

      // --- Error Prevention ---
      eqeqeq: ['error', 'always'],
      'default-case': 'error',
      'no-implicit-coercion': 'warn',
      'no-param-reassign': 'warn',
      'no-return-await': 'error',

      'max-lines-per-function': ['warn', { max: 50 }],
      'max-params': ['warn', 4],
      complexity: ['warn', 10],
      'no-warning-comments': ['warn', { terms: ['fixme', 'todo'], location: 'anywhere' }],
    },
  },
  prettier,
);
