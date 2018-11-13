'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API: '"http://localhost:5000"'
  // API: '"https://0e6546d2.ngrok.io"'
});
