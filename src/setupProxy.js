const { createProxyMiddleware } = require('http-proxy-middleware');

// Set up a custom proxy for development locally
module.exports = function (app) {
  const pathRewrite = {};
  if (process.env.REACT_APP_API_PREFIX_MH) {
    pathRewrite[`^${process.env.REACT_APP_API_PREFIX_MH}`] = '';
  }
  if (process.env.REACT_APP_API_PREFIX_FPS) {
    pathRewrite[`^${process.env.REACT_APP_API_PREFIX_FPS}`] = '';
  }
  if (process.env.REACT_APP_API_PREFIX) {
    pathRewrite[`^${process.env.REACT_APP_API_PREFIX}`] = '';
  }
  app.use(
    process.env.REACT_APP_API_PREFIX_MH ?? '/',
    createProxyMiddleware({
      target: process.env.REACT_APP_PROXY_API_MH,
      changeOrigin: true,
      // Remove the `/api/mh` when proxying to the backend
      pathRewrite: pathRewrite
      // Uncomment the following to get some better proxy logs
      // logLevel: 'debug'
    })
  );
  app.use(
    process.env.REACT_APP_API_PREFIX_FPS ?? '/',
    createProxyMiddleware({
      target: process.env.REACT_APP_PROXY_API_FPS,
      changeOrigin: true,
      // Remove the `/api/fps` when proxying to the backend
      pathRewrite: pathRewrite
      // Uncomment the following to get some better proxy logs
      // logLevel: 'debug'
    })
  );
  app.use(
    process.env.REACT_APP_API_PREFIX ?? '/',
    createProxyMiddleware({
      target: process.env.REACT_APP_PROXY_API,
      changeOrigin: true,
      // Remove the `/api` when proxying to the backend
      pathRewrite
      // Uncomment the following to get some better proxy logs
      // logLevel: 'debug'
    })
  );
};
