const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

module.exports = {
    // mode: "development || "production",
    entry: {
        production: "./src/production",
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js"
    },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};