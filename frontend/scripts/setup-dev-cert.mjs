import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, "..");
const certDir = path.resolve(frontendRoot, ".cert");
const certPath = path.resolve(certDir, "cert.pem");
const keyPath = path.resolve(certDir, "key.pem");
const wingetMkcertPath = process.env.LOCALAPPDATA
  ? path.resolve(process.env.LOCALAPPDATA, "Microsoft", "WinGet", "Links", "mkcert.exe")
  : "";

let mkcertCommand = "mkcert";

function canRun(command) {
  const probe = spawnSync(command, ["-help"], {
    cwd: frontendRoot,
    stdio: "ignore",
    shell: true,
  });

  return !probe.error && probe.status === 0;
}

function runMkcert(args) {
  const result = spawnSync(mkcertCommand, args, {
    cwd: frontendRoot,
    stdio: "inherit",
    shell: true,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`mkcert exited with code ${result.status}`);
  }
}

function ensureMkcertAvailable() {
  if (canRun("mkcert")) {
    mkcertCommand = "mkcert";
    return;
  }

  if (wingetMkcertPath && existsSync(wingetMkcertPath) && canRun(wingetMkcertPath)) {
    mkcertCommand = wingetMkcertPath;
    return;
  }

  if (wingetMkcertPath && existsSync(wingetMkcertPath)) {
    mkcertCommand = wingetMkcertPath;
    return;
  }

  if (!canRun(mkcertCommand)) {
    throw new Error(
      "mkcert is not installed or not on PATH. Install it first (for Windows: winget install FiloSottile.mkcert)."
    );
  }
}

try {
  ensureMkcertAvailable();

  if (!existsSync(certDir)) {
    mkdirSync(certDir, { recursive: true });
  }

  console.log("Installing local CA (if not already installed)...");
  runMkcert(["-install"]);

  console.log("Generating localhost certificate files...");
  runMkcert([
    "-key-file",
    keyPath,
    "-cert-file",
    certPath,
    "localhost",
    "127.0.0.1",
    "::1",
  ]);

  console.log("Done. Certificates generated in .cert/.");
  console.log("You can now run the app with HTTPS on https://localhost:8080.");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Certificate setup failed: ${message}`);
  process.exit(1);
}
