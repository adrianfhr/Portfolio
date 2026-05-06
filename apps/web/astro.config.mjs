import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';

export default defineConfig({
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [react()],
  server: {
    host: true,
    port: 3000,
  },
  output: 'server',
});
