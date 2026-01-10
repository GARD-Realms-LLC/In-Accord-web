#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function removeLock(lockPath) {
  try {
    if (fs.existsSync(lockPath)) {
      fs.rmSync(lockPath, { force: true });
      console.log('Removed dev lock:', lockPath);
    } else {
      console.log('No dev lock found:', lockPath);
    }
  } catch (err) {
    console.error('Failed to remove dev lock:', err.message);
    process.exitCode = 1;
  }
}

const lockPath = path.join(__dirname, '..', '.next', 'dev', 'lock');
removeLock(lockPath);

console.log('\nTip: If the error persists, another dev server may still be running. Stop it and start fresh with:');
console.log('  npm run dev');
