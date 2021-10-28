const path = require("path");
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  entry: "./index.js",
  output: {
    filename: "app.bundle.js",
    path: path.resolve(__dirname, "/dist/"),
  },
  mode:"development",
  devServer:{
      static: path.resolve(__dirname)
  },
};
