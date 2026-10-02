import { readFileSync, writeFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import yaml from '@modyfi/vite-plugin-yaml';

const BUILD_ID = Date.now().toString(36);

// Makes sw.js differ on every build so browsers detect the update and install it.
const stampServiceWorker = (): Plugin => ({
  name: 'stamp-service-worker',
  apply: 'build',
  writeBundle(options) {
    const file = `${options.dir ?? 'dist'}/sw.js`;
    writeFileSync(file, readFileSync(file, 'utf8').replace('__BUILD_ID__', BUILD_ID));
  },
});

export default defineConfig({
  base: '/block-match/',
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  plugins: [react(), yaml(), stampServiceWorker()],
  test: {
    testTimeout: 60000,
  },
});
