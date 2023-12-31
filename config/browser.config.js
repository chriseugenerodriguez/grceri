var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  plugins: [
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    }),
    // new PurifyCSSPlugin({
    //     // Give paths to parse for rules. These should be absolute!
    //     paths: glob.sync(['*.html']),
    // }),
    new CopyPlugin([
      { from: 'src/assets', to: 'assets' }
    ]),
    new CompressionPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        default: false,
        vendors: false,
        // vendor chunk
        vendor: {
          // name of the chunk
          name: 'vendor',
          // async + async chunks
          chunks: 'all',
          // import file path containing node_modules
          test: /node_modules/,
          // priority
          priority: 20
        },
        // Split code common to all chunks to its own chunk
        commons: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true
        }
      },
    },
    noEmitOnErrors: true,
    mangleWasmImports: true,
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        chunkFilter: function (chunk) {
          if (chunk.name === 'vendor') {
            return false;
          }

          return true;
        },
        parallel: 4,
        sourceMap: true,
        extractComments: 'all',
        cache: true
      }),
    ],
  }
};