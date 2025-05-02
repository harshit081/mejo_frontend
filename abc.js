// explore-next-structure.js
const fs = require('fs');
const path = require('path');

function printDirectoryTree(dir, indent = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (
      entry.name === 'node_modules' ||
      entry.name === '.next' ||
      entry.name === '.git'
    ) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    console.log(indent + '|-- ' + entry.name);

    if (entry.isDirectory()) {
      printDirectoryTree(fullPath, indent + '   ');
    }
  }
}

// Start from current directory (assumed to be a Next.js project root)
const rootDir = process.cwd();
console.log(rootDir);
printDirectoryTree(rootDir);
