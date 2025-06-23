import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '192.168.100.38',
      '.ngrok-free.app' // 允許所有 ngrok 域名
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Spring Boot 後端位置
        changeOrigin: true,
      },
    },
  },
});
