const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["./src/index.ts"],
    outfile: "dist/index.js",
    bundle: true,
    minify: true,
    treeShaking: true,
    platform: "node",
    format: "esm",
    target: "node20",
  })
  .catch(() => process.exit(1));
