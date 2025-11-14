<<<<<<< HEAD
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
||||||| parent of dbe680c (fix: update build script to resolve TypeScript compiler correctly)
=======
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

try {
  // Resolve typescript package and use its binary directly
  let tscPath;
  try {
    // Try to resolve typescript package (works with node_modules and Yarn PnP)
    const typescriptPath = require.resolve('typescript/package.json', {
      paths: [join(__dirname, '..')],
    });
    const typescriptDir = join(typescriptPath, '..');
    tscPath = join(typescriptDir, 'bin', 'tsc');
  } catch (resolveError) {
    // Fallback: try node_modules/.bin
    const { platform } = require('os');
    const isWindows = platform() === 'win32';
    const tscBin = isWindows ? 'tsc.cmd' : 'tsc';
    tscPath = join(__dirname, '..', 'node_modules', '.bin', tscBin);

    if (!existsSync(tscPath)) {
      console.error('TypeScript compiler not found.');
      console.error('Please run: yarn install');
      process.exit(1);
    }
  }

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
>>>>>>> dbe680c (fix: update build script to resolve TypeScript compiler correctly)
