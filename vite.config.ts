import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


// https://vitejs.dev/config/
export default defineConfig({
  base: './',   // 👈 rutas relativas en lugar de absolutas
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
