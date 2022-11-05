module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
      'typescript'
  ],
  rules: {
    'eqeqeq': [
      'error',
      'always',
      {
        null: 'ignore'
      }
    ],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'no-multi-spaces': 'error',
    'space-in-parens': ['error', 'never'],
    'arrow-spacing': 'error',
    'typescript/class-name-casing': 'error'
  }
}