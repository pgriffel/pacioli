const path = require("path");

module.exports = (env) => {
  return {
    entry: "./src/index.ts",
    mode: env.mode ?? "production",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "pacioli-0.5.1.bundle.js",
      library: "Pacioli",
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    module: {
      rules: [{ test: /\.ts$/, use: "ts-loader", exclude: /node_modules/ }],
    },
    performance: {
      maxEntrypointSize: 1000000,
      maxAssetSize: 1000000,
    },
  };
};
