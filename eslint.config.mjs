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
    files: ['apps/frontend/**/*.ts', 'apps/frontend/**/*.tsx'],
    rules: {
      'no-template-curly-in-string': ['off'],
      'react/no-clone-element': ['off'],
      'react-hooks-extra/no-direct-set-state-in-use-effect': ['off'],
      'react-refresh/only-export-components': ['off'],
    },
  },
  {
    files: ['apps/backend/**/*.ts', 'apps/backend/**/*.mjs', 'packages/**/*.js'],
    rules: {
      'ts/consistent-type-imports': ['off'],
    },
  },
)
