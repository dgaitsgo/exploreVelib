const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: [
    "babel-polyfill", './src/index.js'
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test : /\.css$/,
        use : [{ loader : 'style-loader' }, { loader : 'css-loader' }]
      },
      {
          test: /\.json$/,
          use : [{ loader : 'json' }]
      },
      {
        test: /\.less$/,
        use : [
            {
              loader : 'style-loader'
            },
            {
             loader : 'css-loader'
            },
            {
            loader : 'less-loader',
            options: {
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif|svg|pdf|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name]-[hash:8].[ext]'
            },
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
	modules: [path.resolve(__dirname, './src'), 'node_modules']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
	   new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './dist',
	  hot: true,
    proxy: {
      "/api": "http://localhost:3000"
    }
  }
}
