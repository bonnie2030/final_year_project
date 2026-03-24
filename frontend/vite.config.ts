import { defineConfig } from "vite";
import fs from "fs";
import react from "@vitejs/plugin-react-swc";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Auto-detect HTTPS: use certs if they exist, enable HTTPS automatically
const certPath = path.resolve(__dirname, '.cert/cert.pem');
const keyPath = path.resolve(__dirname, '.cert/key.pem');
const hasCerts = fs.existsSync(certPath) && fs.existsSync(keyPath);

const httpsConfig = hasCerts
  ? {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    }
  : true;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Get API URL from env, default to localhost
  const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000';
  
  return {
    server: {
      host: "0.0.0.0",
      port: 8080,
      https: httpsConfig, // Automatically enabled if certs exist
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
        '/socket.io': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
        '/uploads': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [!hasCerts && basicSsl(), react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
