import { defineConfig } from 'astro/config';
import path from 'path';
import react from "@astrojs/react";

export default defineConfig({
  // output: 'server',
  integrations: [react()],
  vite: {
    ssr: {
      external: ["svgo"],
    },
    resolve: {
      alias: {
        '@components': path.resolve('./src/components'),
        '@layouts': path.resolve('./src/layouts'),
        '@data': path.resolve('./src/data'),
        '@hooks': path.resolve('./src/hooks'),
        // '@styles': path.resolve('./public/styles'),
      },
      preserveSymlinks: true,
    },
  },
});