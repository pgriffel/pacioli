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
    external: [
      "three/examples/jsm/renderers/CSS2DRenderer",
      "three/examples/jsm/helpers/VertexNormalsHelper",
      "three/examples/jsm/controls/OrbitControls",
    ],
  })
  .catch(() => process.exit(1));
