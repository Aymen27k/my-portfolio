import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Add this server object
    proxy: {
      // Add this proxy object
      "/todos": {
        // Proxy requests to /todos
        target: "http://localhost:3000", // Your backend server URL
        changeOrigin: true, // Important for CORS
        secure: false, // Only for development (HTTPS in production)
      },
      "/users": {
        // Proxy requests to /users
        target: "http://localhost:4000", // Your backend server URL
        changeOrigin: true, // Important for CORS
        secure: false, // Only for development (HTTPS in production)
      },
      // You can add more proxies here if needed
      "/other-api-endpoint": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
