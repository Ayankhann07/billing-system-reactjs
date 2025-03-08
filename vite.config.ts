import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: 'billing-system-reactjs',  // Ye line add karo
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
