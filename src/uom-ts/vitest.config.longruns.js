import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    watch: false,
    setupFiles: ["./vitest.setup.longruns.js"],
    testTimeout: 3_600_000, // 1 hour
    slowTestThreshold: 600_000, // 10 minutes
  },
});
