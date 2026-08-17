import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Static SPA build for S3 + CloudFront.
// base: './' makes asset URLs relative so the bundle works from any
// CloudFront path or S3 static-site endpoint without rewrites.
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: [
      {
        find: '@optum-serve/ds/globals.css',
        replacement: path.resolve(__dirname, 'packages/optum-serve-ds/src/tokens/globals.css'),
      },
      {
        find: '@optum-serve/ds',
        replacement: path.resolve(__dirname, 'packages/optum-serve-ds/src/index.ts'),
      },
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          streams: ['amazon-connect-streams'],
        },
      },
    },
  },
});
