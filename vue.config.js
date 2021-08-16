module.exports = {
  lintOnSave: true,
  configureWebpack: {
    optimization: {
      splitChunks: {
        cacheGroups: {
          default: false,
          // Merge all the CSS into one file
          styles: {
            name: 'styles',
            test: /\.(le|c|sc|sa)ss$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
  },

  chainWebpack (config) {
    config.optimization.delete('splitChunks')
  }
};