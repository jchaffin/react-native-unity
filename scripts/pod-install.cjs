const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'pod-install',
  factory() {
    return {
      hooks: {
        afterAllInstalled(project, options) {
          if (process.env.POD_INSTALL === '0') {
            return;
          }

          if (
            options &&
            (options.mode === 'update-lockfile' ||
              options.mode === 'skip-build')
          ) {
            return;
          }

          // Check if example/ios directory exists
          const iosDir = path.join(project.cwd, 'example', 'ios');
          if (!fs.existsSync(iosDir)) {
            console.warn('Warning: example/ios directory not found. Skipping pod-install.');
            return;
          }

          // Try to clean CocoaPods cache if it exists
          const homeDir = process.env.HOME || process.env.USERPROFILE;
          if (homeDir) {
            const podCacheDir = path.join(homeDir, 'Library', 'Caches', 'CocoaPods');
            if (fs.existsSync(podCacheDir)) {
              console.log('Cleaning CocoaPods cache...');
              try {
                // Clean the boost cache specifically
                const boostCache = path.join(podCacheDir, 'Pods', 'External', 'boost');
                if (fs.existsSync(boostCache)) {
                  child_process.execSync(`rm -rf "${boostCache}"`, { stdio: 'ignore' });
                }
              } catch (e) {
                // Ignore cache cleanup errors
              }
            }
          }

          const result = child_process.spawnSync(
            'yarn',
            ['pod-install', 'example/ios'],
            {
              cwd: project.cwd,
              env: process.env,
              stdio: 'inherit',
              encoding: 'utf-8',
              shell: true,
            }
          );

          if (result.status !== 0) {
            console.warn('\n⚠️  Warning: Failed to run pod-install.');
            console.warn('This is often due to CocoaPods cache issues. Try running:');
            console.warn('  cd example/ios && pod cache clean --all && pod install');
            console.warn('Or skip pod-install during yarn install by setting: POD_INSTALL=0');
            // Don't throw - allow installation to continue
            // throw new Error('Failed to run pod-install');
          }
        },
      },
    };
  },
};
