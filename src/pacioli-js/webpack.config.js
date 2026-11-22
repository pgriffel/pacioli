const path = require("node:path");
const pkg = require("./package.json");

module.exports = (_env, argv) => {
  const mode = argv.mode ?? "production";

  return {
    mode,
    target: ["web", "es2020"],
    entry: "./src/index.ts",
    devtool: mode === "development" ? "source-map" : false,

    output: {
      path: path.resolve(__dirname, "dist/browser"),
      filename: `pacioli-${pkg.version}.bundle.js`,
      library: { name: "Pacioli", type: "umd" },
      globalObject: "globalThis",
    },

    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: "ts-loader",
        },
      ],
    },

    performance: {
      hints: "warning",
    },

    optimization: { minimize: mode === "production" }
  };
};