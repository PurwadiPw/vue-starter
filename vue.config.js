/** @type import('@vue/cli-service').ProjectOptions */
module.exports = {
  lintOnSave: false,

  // https://github.com/neutrinojs/webpack-chain/tree/v4#getting-started
  chainWebpack(config) {
    // We provide the app's title in Webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.set("name", process.env.VUE_APP_NAME);

    // Set up all the aliases we use in our app.
    config.resolve.alias.merge(require("./aliases.config").webpack);

    // Don't allow importing .vue files without the extension, as
    // it's necessary for some Vetur autocompletions.
    config.resolve.extensions.delete(".vue");

    // Only enable performance hints for production builds,
    // outside of tests.
    config.performance.hints(
      process.env.NODE_ENV === "production" &&
        !process.env.VUE_APP_TEST &&
        "warning"
    );
  },
  css: {
    // Enable CSS source maps.
    sourceMap: true,
  },
  // Configure Webpack's dev server.
  // https://cli.vuejs.org/guide/cli-service.html
  devServer: {
    host: "0.0.0.0",
    port: 8081,
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'development' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_URL_PROD,
        changeOrigin: true
      }
    }
  },
};
