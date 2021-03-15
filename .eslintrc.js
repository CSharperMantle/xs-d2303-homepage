module.exports = {
  env: {
    browser: true,
    es2021: true,
    jquery: true
  },
  extends: [
    'eslint-config-standard'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    'space-before-function-paren': 'off'
  },
  plugins: [
    'html',
    'node',
    'promise'
  ],
  globals: {
    gsap: 'readonly',
    CustomEase: 'readonly',
    CustomWiggle: 'readonly',
    AsyncScriptLoader: 'readonly',
    confetti: 'readonly',
    _: 'readonly',
    ChemDoodle: 'readonly'
  }
}
