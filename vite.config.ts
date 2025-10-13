import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { copyFileSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    https: false,
  },
  plugins: [
    react(),
    // Custom plugin to copy .htaccess (hidden files aren't copied by default)
    {
      name: 'copy-htaccess',
      closeBundle() {
        try {
          copyFileSync('public/.htaccess', 'dist/.htaccess');
          console.log('✓ .htaccess copied to dist/');
        } catch (err) {
          console.warn('⚠ .htaccess not found, skipping...');
        }
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
