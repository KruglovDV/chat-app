module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'plugin:react/recommended'
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  rules: {
    'no-underscore-dangle': 0,
    'import/extensions': 'off'
  },
  globals: {
    'io': true
  }
};
