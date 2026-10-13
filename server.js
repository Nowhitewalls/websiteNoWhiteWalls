// This cPanel/Apache install doesn't support PassengerEnvVar in .htaccess
// (Apache rejects it outright), so env vars are loaded directly from a
// .env file on disk instead of relying on Passenger/Apache to inject them.
const fs = require("fs");
const path = require("path");
try {
  const envPath = path.join(__dirname, ".env");
  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  }
} catch {
  // No .env file present (e.g. local dev with env already set) — fine.
}

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err && err.stack ? err.stack : err);
});
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err && err.stack ? err.stack : err);
});
process.on("exit", (code) => {
  console.error("PROCESS EXITING with code", code);
});

const { createServer } = require("http");
const next = require("next");

const port = process.env.PORT || 3000;
const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`No White Walls app ready on port ${port}`);
  });
});
