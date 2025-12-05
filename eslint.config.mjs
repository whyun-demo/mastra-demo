import globals from 'globals'
import tseslint from 'typescript-eslint'
import js from '@eslint/js'
import vitest from 'eslint-plugin-vitest';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
const customRules = {
  '@typescript-eslint/interface-name-prefix': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
  ],
  '@typescript-eslint/no-floating-promises': ['error'],
  '@typescript-eslint/explicit-member-accessibility': 'error',
  semi: ['error', 'never'],
  'no-console': 'error',
}
const tsConfig = {
  plugins: {
    vitest,
  },
  languageOptions: {
    globals: {
      ...globals.node,
      // ...globals.jest,
    },
    parserOptions: {
      parser: tseslint.parser,
      project: './tsconfig.json',
      // tsconfigRootDir: '.',
    },
  },
}
/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
  {
    files: ['**/*.ts'],
    languageOptions: { sourceType: 'module' },
    ...js.configs.recommended,
  },
  eslintPluginPrettierRecommended,
  {
    ignores: [
      '.mastra/',
      'config/',
      'dist/',
      'scripts/',
      'jest.config.js',
      'eslint.config.mjs',
      'node_modules/',
    ],
  },
  tsConfig,
  ...tseslint.configs.recommended,
  {
    ...tsConfig,
    files: ['**/*.ts'],
    rules: {
      ...customRules,
    },
  },
  {
    ...tsConfig,
    files: ['**/*.dto.ts'],
    rules: {
      ...customRules,
      '@typescript-eslint/explicit-member-accessibility': 'off',
    },
  },
]
