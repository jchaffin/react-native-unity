const { execSync } = require('child_process');
const { existsSync, mkdirSync, rmSync } = require('fs');
const { join } = require('path');

const buildDir = join(__dirname, '..', 'lib');

console.log('Building...');

// Clean build directory
if (existsSync(buildDir)) {
  rmSync(buildDir, { recursive: true, force: true });
}

// Create build directory
mkdirSync(buildDir, { recursive: true });

// Run TypeScript compiler
console.log('Compiling TypeScript to JavaScript...');

const { platform } = require('os');
const isWindows = platform() === 'win32';
const tscBin = isWindows ? 'tsc.cmd' : 'tsc';
const tscPath = join(__dirname, '..', 'node_modules', '.bin', tscBin);

if (!existsSync(tscPath)) {
  console.error('TypeScript compiler not found in node_modules/.bin');
  console.error('Please run: npm install');
  process.exit(1);
}

try {
  execSync(`"${tscPath}" -p tsconfig.build.json`, {
    stdio: 'inherit',
    cwd: join(__dirname, '..'),
  });
} catch (error) {
  console.error('TypeScript compilation failed:', error.message);
  process.exit(1);
}

console.log('Build complete!');
