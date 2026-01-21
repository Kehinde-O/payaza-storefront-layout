#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distDir = path.join(__dirname, '../dist');

// Start tsc in watch mode
const tsc = spawn('npx', ['tsc', '--watch', '--noEmitOnError', 'false'], {
  stdio: 'inherit',
  shell: true
});

// Watch dist directory for changes and run tsc-alias
let timeout;
const watcher = fs.watch(distDir, { recursive: true }, (eventType, filename) => {
  if (filename && (filename.endsWith('.js') || filename.endsWith('.d.ts'))) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      try {
        execSync('npx tsc-alias', { stdio: 'inherit' });
      } catch (error) {
        // Ignore errors, tsc-alias will run on next change
      }
    }, 500);
  }
});

tsc.on('close', (code) => {
  watcher.close();
  process.exit(code);
});

process.on('SIGINT', () => {
  watcher.close();
  tsc.kill();
  process.exit(0);
});
