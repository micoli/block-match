import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import yaml from '@modyfi/vite-plugin-yaml';

export default defineConfig({
  base: '/block-match/',
  plugins: [react(), yaml()],
  test: {
    testTimeout: 60000,
  },
});
