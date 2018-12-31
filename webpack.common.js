module.exports = {
  entry: {
    events: './chrome-extension/src/events/events.js',
    popup: './chrome-extension/src/popup/index.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
};
