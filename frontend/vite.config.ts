import { defineConfig, loadEnv } from "vite";
import fs from "fs";
import react from "@vitejs/plugin-react-swc";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Auto-detect HTTPS for local development.
// Behavior:
// - VITE_DEV_HTTPS=true  => force HTTPS
// - VITE_DEV_HTTPS=false => force HTTP
// - unset                => HTTPS on when certs exist
const certPath = path.resolve(__dirname, '.cert/cert.pem');
const keyPath = path.resolve(__dirname, '.cert/key.pem');
const hasCerts = fs.existsSync(certPath) && fs.existsSync(keyPath);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  const httpsFlag = String(env.VITE_DEV_HTTPS || '').toLowerCase();
  const enableHttps = httpsFlag === 'true' || (httpsFlag !== 'false' && hasCerts);
  const httpsConfig = enableHttps
    ? (hasCerts
        ? {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath),
          }
        : {})
    : undefined;

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
          target: apiUrl,
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
