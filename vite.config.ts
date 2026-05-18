import { defineConfig } from "vitest/config";
import { compression } from "vite-plugin-compression2";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithms:['gzip', 'brotliCompress'],
      exclude: [/\.(br)$/, /\.(gz)$/, /\.(png|jpg|jpeg|webp|gif|svg)$/],
      threshold: 1024,
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  define: { global: 'window',},
  build: {
    outDir: 'dist',
    minify: 'terser',
        target: 'esnext',
    sourcemap: false,
    rollupOptions: {
      input: 'index.html'
    },
    terserOptions:{
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
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
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  server: {
    proxy:{
      "/api":{
        target: "http://mera-sandbox-alb-39209089.us-east-2.elb.amazonaws.com/",
        //target: "http://mera-production-alb-384434217.us-east-2.elb.amazonaws.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      }
    }
  }

});
