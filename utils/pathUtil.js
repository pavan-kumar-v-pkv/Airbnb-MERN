// core module
const path = require('path');

module.exports = path.dirname(require.main?.filename || process.argv[1] || __dirname);