const DashboardPlugin = require("webpack-dashboard/plugin");

module.exports = {
  configureWebpack: {
    plugins: [new DashboardPlugin()]
  }
};
