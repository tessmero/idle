const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'www', 'index.html');
const timestamp = Date.now();

let indexContent = fs.readFileSync(indexPath, 'utf8');

// try to replace existing timestamp
indexContent = indexContent.replace(
  /(production\.min\.js\?v=)\d+/,
  `$1${timestamp}`
);

if (!indexContent.includes('production.min.js?v=')) {

  // no existing timestamp
  // add new timestamp
  indexContent = indexContent.replace(
    'production.min.js',
    `production.min.js?v=${timestamp}`
  );
}

fs.writeFileSync(indexPath, indexContent);

console.log(`Updated www/index.html with timestamp: ${timestamp}`);