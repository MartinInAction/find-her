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
        '/auth/logout',
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
    app.use(
        '/profile',
        createProxyMiddleware({
            target: 'https://api.gotinder.com/v2/',
            changeOrigin: true,
        })
    );
    app.use(
        '/user/*',
        createProxyMiddleware({
            target: 'https://api.gotinder.com/',
            changeOrigin: true,
        })
    );
    app.use(
        '/user/recs',
        createProxyMiddleware({
            target: 'https://api.gotinder.com/v2/',
            changeOrigin: true,
        })
    );
    app.use(
        '/photos/hot-girls/',
        createProxyMiddleware({
            target: 'https://www.gettyimages.com/',
            changeOrigin: true,
        })
    );

    
};

