const webpack = require("webpack");

module.exports = {
  devServer: { port: 9001 },
  publicPath: process.env.NODE_ENV === "production" ? "/work-flow/" : "/"
  //   chainWebpack: config => {
  //     config.plugin("provide").use(webpack.ProvidePlugin, [
  //       {
  //         $: "jquery",
  //         jquery: "jquery",
  //         jQuery: "jquery",
  //         "window.jQuery": "jquery"
  //       }
  //     ]);
  //   }
};
