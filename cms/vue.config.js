module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:3000/',
        // target: 'https://www.example.co.kr:3000/',
        // target: '13.125.132.44:3000',
        changeOrigin: true
      }
    }
  }
}