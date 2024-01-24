const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');

// Consolidate chunk files instead
config.optimization.splitChunks = {
  cacheGroups: {
    default: false,
  },
};

config.resolve.fallback = { ...config.resolve.fallback, "crypto": false }
// Move runtime into bundle instead of separate file
config.optimization.runtimeChunk = false;
config.optimization.minimize = false;

// JS
config.output.filename = '[name].js';
