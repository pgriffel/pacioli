const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["./src/index.ts"],
    outfile: "dist/pacioli-0.6.0.bundle.js",
    bundle: true,
    minify: false,
    treeShaking: false,
    platform: "browser",
    format: "iife",
    globalName: "Pacioli",
    keepNames: true,
    external: [
      "three/examples/jsm/renderers/CSS2DRenderer",
      "three/examples/jsm/helpers/VertexNormalsHelper",
      "three/examples/jsm/controls/OrbitControls",
    ],
  })
  .catch(() => process.exit(1));
