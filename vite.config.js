import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/block-match/',
  plugins: [react()],
  test: {
    testTimeout: 60000,
  },
});
