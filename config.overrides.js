const path = require('path');

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
    }
  }
}