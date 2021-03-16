const path = require('path');
const { DefinePlugin } = require('webpack');
const { parsed } = require('dotenv').config();

module.exports = {
  webpack: (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        modules: ['node_modules'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', 'css'],
        alias: {
          ...config.resolve.alias,
          '@src': path.resolve(__dirname, 'src')
        }
      },
      plugins: [
        ...config.plugins,
        new DefinePlugin({
          ...(process.env.MODE === 'development'
            ? {'process.env.REACT_APP_DUMP_IMAGES': JSON.stringify(parsed.DUMP_IMAGES)}
            : {}
          )
        })
      ]
    }
  },
  devServer: (configFunction) => {
    return (_proxy = {}, allowedHost) => {
      const proxy = {
        ..._proxy,
        '/socket.io': {
          target: 'http://localhost:4000',
          ws: true
        }
      }
      const config = configFunction(proxy, allowedHost);

      return {
        ...config,
        setup: require('./socketServer')
      }
    }
  }
}
