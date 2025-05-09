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
    files: ['packages/frontend/**/*.ts', 'packages/frontend/**/*.tsx'],
    rules: {
      'no-template-curly-in-string': ['off'],
      'react/no-clone-element': ['off'],
      'react-hooks-extra/no-direct-set-state-in-use-effect': ['off'],
      'react-refresh/only-export-components': ['off'],
    },
  },
  {
    files: ['packages/backend/**/*.ts', 'packages/backend/**/*.mjs'],
    rules: {
      'perfectionist/sort-imports': ['off'],
      'ts/consistent-type-imports': ['off'],
    },
  },
)
