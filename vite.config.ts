import { defineConfig } from "vite";
import { compression } from "vite-plugin-compression2";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithms:["gzip", "br"]
    })
  ],
  define: { global: 'window',},
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html'
    },
    terserOptions:{
      compress: {
        drop_console: true,
      }
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@context': path.resolve(__dirname, './src/context'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@models': path.resolve(__dirname, './src/models'),
      "@utils": path.resolve(__dirname, "./src/utils/*"),
    },
  },
});
