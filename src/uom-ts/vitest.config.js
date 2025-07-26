import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./vitest.setup.js"],
    slowTestThreshold: 10_000, // 10 seconds
  },
});
