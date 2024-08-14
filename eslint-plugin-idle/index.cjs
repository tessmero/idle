/**
 * @file index.cjs eslint plugin definition
 *
 * imports all the .cjs files in the rules folder
 */
const fs = require('fs');
const path = require('path');

const rulesDir = path.join(__dirname, 'rules');

// eslint-disable-next-line no-sync
const ruleFiles = fs.readdirSync(rulesDir).filter((file) => file.endsWith('.cjs'));

const plugin = {
  rules: Object.fromEntries(
    ruleFiles.map((file) => [
      path.basename(file, '.cjs'), // rule name

      // eslint-disable-next-line global-require
      require(path.join(rulesDir, file)), // rule

    ]),
  ),
};

module.exports = plugin;
