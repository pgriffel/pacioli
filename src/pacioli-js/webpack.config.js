const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: "development",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'pacioli-0.5.0.bundle.js',
    library: 'Pacioli'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [{ test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }],
  },
};