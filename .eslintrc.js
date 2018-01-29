module.exports = {
  extends: [
    'standard',
  ],

  parser: 'babel-eslint',

  plugins: [
    'standard',
    'promise',
    'class-property',
  ],

  rules: {
    'no-var': 2,
    'padded-blocks': 0,
    'max-len': ['error', 100],
    'comma-dangle': ['error', 'always-multiline'],
    'no-return-assign': 0,
    'no-unused-vars': ['error', {
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_',
      ignoreRestSiblings: true
    }],
    'no-duplicate-imports': 'error',
  },

  env: {
    jest: true,
  },

  globals: {
    __routes__: true,
  },
}
