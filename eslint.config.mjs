import antfu from '@antfu/eslint-config'

export default antfu(
  {
    react: true,
    rules: {
      'no-console': ['off'],
      'no-alert': ['off'],
    },
  },
  {
    files: ['packages/**/*.ts', 'packages/**/*.mjs', 'packages/**/*.js'],
  },
  {
    files: [
      'apps/dashboard/**/*.ts',
      'apps/dashboard/**/*.tsx',
      'apps/frontend/**/*.ts',
      'apps/frontend/**/*.tsx',
      'packages/markdown/**/*.ts',
      'packages/markdown/**/*.tsx',
    ],
    rules: {
      'no-template-curly-in-string': ['off'],
      'react/no-clone-element': ['off'],
      'react-dom/no-dangerously-set-innerhtml': ['off'],
      'react-hooks-extra/no-direct-set-state-in-use-effect': ['off'],
      'react-refresh/only-export-components': ['off'],
    },
  },
  {
    files: ['apps/api-service/**/*.ts', 'apps/api-service/**/*.mjs', 'packages/**/*.js'],
    rules: {
      'ts/consistent-type-imports': ['off'],
    },
  },
)
