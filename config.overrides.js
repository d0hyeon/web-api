const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = (config) => {
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
      new Dotenv()
    ]
  }
}