import { defineConfig } from 'vite';

export default defineConfig({
  // This tells Vite to load assets from the /divers-quest/ path instead of the root /
  // which is required since GitHub Pages hosts your site at username.github.io/divers-quest/
  base: '/divers-quest/',
});
