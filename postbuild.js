const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'dist/styles.css');

if (!fs.existsSync(filePath)) {
  throw new Error(`Expected ${filePath} to exist after build.`);
}

const css = fs.readFileSync(filePath, 'utf8');
fs.writeFileSync(filePath, `@layer nodes {\n${css}\n}`);
