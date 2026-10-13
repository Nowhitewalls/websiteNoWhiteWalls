/** @type {import('next').NextConfig} */
const nextConfig = {
  // Not using "standalone" output: Passenger/cPanel already manages
  // node_modules via the nodevenv symlink (populated by `npm install`),
  // so a self-contained standalone bundle would conflict with it. Plain
  // `next build` + a small custom server.js (below) fits this hosting
  // model better.
  // Shared hosting (CloudLinux LVE) caps threads well below what Next's
  // build-time worker pool wants to spawn, causing pthread_create EAGAIN.
  // Force a single build worker to stay under that cap.
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
};

module.exports = nextConfig;
