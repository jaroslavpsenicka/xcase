const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/xhypo-overview/runtime.js',
    './dist/xhypo-overview/polyfills.js',
    './dist/xhypo-overview/scripts.js',
    './dist/xhypo-overview/main.js'
  ];

  await fs.ensureDir('elements');
  await concat(files, 'elements/xhypo-overview.js');
  await fs.copyFile('./dist/xhypo-overview/styles.css', 'elements/styles.css');
})();
