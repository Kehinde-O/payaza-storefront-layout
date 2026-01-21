#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const jsonDir = path.join(__dirname, '../src/json');
const distJsonDir = path.join(__dirname, '../dist/json');

function copyJson() {
  try {
    execSync('npm run copy-json', { stdio: 'inherit' });
    console.log('[watch-json] JSON files copied');
  } catch (error) {
    console.error('[watch-json] Error copying JSON files:', error.message);
  }
}

// Initial copy
copyJson();

// Watch for changes
fs.watch(jsonDir, { recursive: true }, (eventType, filename) => {
  if (filename && filename.endsWith('.json')) {
    console.log(`[watch-json] ${eventType}: ${filename}`);
    copyJson();
  }
});

console.log('[watch-json] Watching JSON files...');
