import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/billing-system-reactjs/',  // ✅ Slash ke saath sahi format
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
