const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/main.ts',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.cjs',
    library: { type: 'commonjs2' },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  devtool: false,
  optimization: {
    usedExports: false,
    minimize: false,
  },
  externals: {
    electron: 'commonjs2 electron',
  },
};
