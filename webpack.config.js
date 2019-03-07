const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = (env, argv) => ({
  entry: {
    'gaia-js-sdk-convey-std': './src/std.ts',
    'gaia-js-sdk-convey-all': './src/all.ts',
    'gaia-js-sdk-convey-cal': './src/cal.ts',
    'gaia-js-sdk-convey-map': './src/map.ts',
    'gaia-js-sdk-convey-vis': './src/vis.ts',
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: [
          argv.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: { minimize: true },
          },
          {
            loader: 'sass-loader',
          },
          'import-glob-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    library: '',
    libraryTarget: 'commonjs',
    filename: 'dist/[name].min.js',
    path: __dirname,
  },
  externals: ['google-maps', 'leaflet', 'node-ical'],
  plugins: [
    new StyleLintPlugin({
      files: ['src/**/*.scss'],
    }),
    new MiniCssExtractPlugin({
      filename: 'dist/[name].min.css',
    }),
  ],
});
