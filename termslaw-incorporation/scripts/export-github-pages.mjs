#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { cp, mkdir, rm, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const repoRoot = resolve(projectRoot, '..');

const basePath = process.env.EXPORT_BASE_PATH ?? '/Attorney-Led-Incorporation-Intake/';
const target = process.env.EXPORT_DIR ?? join(repoRoot, 'Attorney-Led-Incorporation-Intake');

console.log(`→ Building incorp-ui with base "${basePath}"`);
execSync('pnpm --filter @termslaw/incorp-ui build', {
  cwd: projectRoot,
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_BASE_PATH: basePath
  }
});

const distDir = resolve(projectRoot, 'packages/incorp-ui/dist');
const targetDir = resolve(target);

await rm(targetDir, { recursive: true, force: true });
await mkdir(targetDir, { recursive: true });
await cp(distDir, targetDir, { recursive: true });

const indexPath = join(targetDir, 'index.html');
const notFoundPath = join(targetDir, '404.html');
await cp(indexPath, notFoundPath);

const embedDir = join(targetDir, 'embed');
await mkdir(embedDir, { recursive: true });
await cp(indexPath, join(embedDir, 'index.html'));

try {
  const stats = await stat(targetDir);
  console.log(`✓ Exported static intake to ${targetDir} (${stats.isDirectory() ? 'directory' : 'file'})`);
} catch (error) {
  console.error('Failed to verify export directory', error);
  process.exitCode = 1;
}

console.log('   • index.html + 404.html support direct links like /embed');
console.log('   • Update EXPORT_BASE_PATH when hosting under a different folder');
