const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        '/auth/login/facebook',
        createProxyMiddleware({
            target: 'https://api.gotinder.com/v2/',
            changeOrigin: true,
        })
    );
    app.use(
        '/auth',
        createProxyMiddleware({
            target: 'https://api.gotinder.com/v2/',
            changeOrigin: true,
        })
    );
    app.use(
        '/matches',
        createProxyMiddleware({
            target: 'https://api.gotinder.com/v2/',
            changeOrigin: true,
        })
    );
};
