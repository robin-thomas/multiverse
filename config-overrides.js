/* config-overrides.js */

const path = require('path');
const webpack = require('webpack');
const { removeModuleScopePlugin } = require('customize-cra');

module.exports = function override(config, env) {
  // do stuff with the webpack config...

  config.devtool = '';

  config.optimization.runtimeChunk = false;
  config.optimization.splitChunks = {
    cacheGroups: {
      styles: {
        name: 'styles',
        test: /\.css$/,
        chunks: 'all',
        enforce: true,
      },
    },
  };

  config.plugins.push(
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    })
  );

  removeModuleScopePlugin()(config);

  return config;
};
