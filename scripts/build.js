const { execSync } = require('child_process');
const { existsSync, mkdirSync } = require('fs');
const { join } = require('path');

const buildDir = join(__dirname, '..', 'lib');

console.log('Building...');

// Clean build directory
if (existsSync(buildDir)) {
  execSync(`rm -rf ${buildDir}`, { stdio: 'inherit' });
}

// Create build directory
mkdirSync(buildDir, { recursive: true });

// Run TypeScript compiler
console.log('Compiling TypeScript to JavaScript...');
const { platform } = require('os');
const tscBin = platform() === 'win32' ? 'tsc.cmd' : 'tsc';
const tscPath = join(__dirname, '..', 'node_modules', '.bin', tscBin);

// Check if TypeScript is installed locally, otherwise try to use it via yarn/npm
if (!existsSync(tscPath)) {
  console.error('TypeScript compiler not found in node_modules.');
  console.error('Please run: yarn install');
  process.exit(1);
}

try {
  execSync(`"${tscPath}" -p tsconfig.build.json`, {
    stdio: 'inherit',
    cwd: join(__dirname, '..'),
    env: { ...process.env },
  });
} catch (error) {
  console.error('TypeScript compilation failed:', error.message);
  process.exit(1);
}

console.log('Build complete!');
