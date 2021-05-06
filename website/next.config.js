module.exports = {
  trailingSlash: true,
  url: "https://www.sigmajs.org",
  async rewrites() {
    return [
      {
        source: '/demos/:slug*',
        destination: `http://localhost:8000/:slug*`,
      }
    ]
  }

};
