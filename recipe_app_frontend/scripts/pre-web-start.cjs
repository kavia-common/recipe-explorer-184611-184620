'use strict';

/**
 * Ensure dependencies are installed before starting Expo web.
 * - If node_modules is missing, prefer npm ci if package-lock.json exists, else npm install.
 * - Use --prefer-offline and --silent to speed up in CI and avoid noise.
 * - Runs non-interactively and exits successfully even if already installed.
 */
(async function main() {
  try {
    const { existsSync } = await import('node:fs');
    const { spawnSync } = await import('node:child_process');
    const path = await import('node:path');

    const appDir = typeof __dirname !== 'undefined' ? path.resolve(__dirname, '..') : process.cwd();
    const nodeModules = path.join(appDir, 'node_modules');
    const hasNodeModules = existsSync(nodeModules);
    if (hasNodeModules) {
      console.log('[pre-web-start] node_modules present; skipping install.');
      return;
    }

    console.log('[pre-web-start] node_modules missing; installing dependencies...');
    const hasLock = existsSync(path.join(appDir, 'package-lock.json'));
    const cmd = 'npm';
    const args = hasLock
      ? ['ci', '--prefer-offline', '--no-audit', '--no-fund', '--silent']
      : ['install', '--prefer-offline', '--no-audit', '--no-fund', '--silent'];
    const result = spawnSync(cmd, args, {
      cwd: appDir,
      stdio: 'inherit',
      env: { ...process.env, CI: process.env.CI || 'true' },
    });

    if (result.error) {
      console.warn('[pre-web-start] install spawn error:', result.error);
    }
    if (typeof result.status === 'number' && result.status !== 0) {
      console.warn(`[pre-web-start] "${cmd} ${args.join(' ')}" exited with code ${result.status}`);
      // Do not hard fail; let expo attempt to start (healthcheck may still allow preview readiness)
    }

    // Soft-verify critical dependency presence to avoid common runtime failures.
    try {
      await import('@react-native-async-storage/async-storage');
      console.log('[pre-web-start] Verified @react-native-async-storage/async-storage presence.');
    } catch {
      console.warn('[pre-web-start] @react-native-async-storage/async-storage not found after install - attempting add...');
      // Try lightweight install if package.json declares it (should be present).
      const add = spawnSync(cmd, ['install', '@react-native-async-storage/async-storage@~2.1.0', '--no-audit', '--no-fund', '--silent'], {
        cwd: appDir,
        stdio: 'inherit',
        env: { ...process.env, CI: process.env.CI || 'true' },
      });
      if (typeof add.status === 'number' && add.status !== 0) {
        console.warn('[pre-web-start] async-storage install returned non-zero; continuing anyway.');
      }
    }
  } catch (err) {
    console.warn('[pre-web-start] failed:', err);
  }
})();
