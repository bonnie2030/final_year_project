import { defineConfig, loadEnv } from "vite";
import fs from "fs";
import react from "@vitejs/plugin-react-swc";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";
import { componentTagger } from "lovable-tagger";

// HTTPS is opt-in for local development.
// Set VITE_DEV_HTTPS=true to use certificates in .cert/.
const certPath = path.resolve(__dirname, '.cert/cert.pem');
const keyPath = path.resolve(__dirname, '.cert/key.pem');
const hasCerts = fs.existsSync(certPath) && fs.existsSync(keyPath);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  const useHttps = env.VITE_DEV_HTTPS === 'true';
  const httpsConfig = useHttps && hasCerts
    ? {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      }
    : false;

  // Get API URL from env, default to localhost
  const apiUrl = env.VITE_API_URL || 'http://localhost:5000';
  
  return {
    server: {
      host: "0.0.0.0",
      port: 8080,
      https: httpsConfig,
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
