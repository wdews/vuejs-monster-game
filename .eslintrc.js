// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html',
    'promise'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    "consistent-return": 0,
    "comma-dangle": ["error", "never"],
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "camelcase": "error",
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-param-reassign': [ 2, { 'props': false } ],
    'func-names': 0,
    "space-before-function-paren": ["error", "always"],
    "guard-for-in": 0,
    "no-shadow": [
      "error",
      { "allow": ["state", "getters"] }
    ],
    'no-restricted-syntax': [
      'error',
      'LabeledStatement',
      'WithStatement',
    ]
  }
}
