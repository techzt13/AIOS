const os = require('os');
const path = require('path');

function getConfigDir() {
  return path.resolve(process.env.AIOS_CONFIG_DIR || path.join(os.homedir(), '.config', 'aios'));
}

module.exports = { getConfigDir };
