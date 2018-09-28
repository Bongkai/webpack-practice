module.exports = {
  root: true,
  extends: 'standard',
  plugins: [
    'html'
  ],
  env: {
    browser: true
  },
  globals: {
    $: true
  },
  rules: {
    'semi': [0],
    'react/jsx-filename-extension': [0],
    'react/jsx-one-expression-per-line': [0],
    'arrow-spacing': [0],
    'keyword-spacing': [0],
    'import/extensions': [0],
    'padded-blocks': [0],
    'jsx-quotes': [0],
    'no-unused-expressions': [0],
    'react/destructuring-assignment': [0],
    'space-before-function-paren': [0],
    'no-unused-vars': [0]
  }
};