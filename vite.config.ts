import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import eslint from "vite-plugin-eslint";
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    host: true,
  },
});

//, eslint()
