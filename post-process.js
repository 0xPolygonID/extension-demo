const fs = require('fs');
const pathUtils = require('path');

const bundlePath = pathUtils.join('build', 'main.js');
console.log('Bundle replace code', bundlePath);

let bundleString = fs.readFileSync(bundlePath, 'utf8');


// replace source for Worker
bundleString = bundleString.replaceAll(`new Worker$1(workerSource)`, 'new Worker$1("./threadman_thread.js")');

fs.writeFileSync(bundlePath, bundleString);
console.log('Bundle replaced code finish', bundlePath);
