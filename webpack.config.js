module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [/node_modules\/@antv/]  // @antv 관련 소스맵 로딩 제외
      }
    ]
  }
}; 