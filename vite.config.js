import { defineConfig } from 'vite';

export default defineConfig({
  root: './src', // Set the root directory to 'src'
  build: {
    outDir: '../dist', // Specify the output directory as 'dist' (relative to 'src')
    assetsDir: 'assets', // Folder where the static assets like images will be placed
    rollupOptions: {
      input: {
        main: './src/index.html', // Entry point for the build
      },
    },
  },
  server: {
    open: true, // Automatically open the app in the browser
    port: 5500, // Port number for local development server
  },
});
