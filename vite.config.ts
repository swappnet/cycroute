import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import eslint from "vite-plugin-eslint";
import mkcert from 'vite-plugin-mkcert';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    svgr({
      exportAsDefault: false,
      svgrOptions: {
        svgoConfig: {
          prefixIds: false,
        },
      },
    }),
    react(),
    mkcert(),
  ],
  server: {
    host: true,
  },
});

svgr({
  exportAsDefault: true,
  svgrOptions: {
    icon: true,
  },
});
