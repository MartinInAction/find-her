const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const app = express();
const {createProxyMiddleware} = require('http-proxy-middleware')
const generateAccessToken = require('./generateToken')

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(pino);

app.post('/generate-token', async (req, res) => {
    let {body} = req
    return generateAccessToken({emailAddress: body.email, password: body.pass})
        .then((response) => {
            console.log(res)
            return res.json(response)
        })
        .catch((err) => {
            console.log(err)
            return res.status(401).end()
        })
})



app.post('/auth/login/facebook', (req, res) => {
    res.setHeader('User-Agent', 'Tinder/7.5.3 (iPhone; iOS 10.3.2; Scale/2.00)');
    res.setHeader('Accept', 'application/json');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('platform', 'ios');
    res.setHeader('Accept-Language', 'en');
})

app.post('/matches', (req, res) => {
    res.setHeader('User-Agent', 'Tinder/7.5.3 (iPhone; iOS 10.3.2; Scale/2.00)');
    res.setHeader('Accept', 'application/json');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('platform', 'ios');
    res.setHeader('Accept-Language', 'en');
})

const tinderProxyOptions = {
    target: 'https://api.gotinder.com/v2/', // target host
    changeOrigin: true, // needed for virtual hosted sites
    ws: true, // proxy websockets
}

const localProxyOptions = {
    target: 'http://localhost:3001/', // target host
    changeOrigin: true, // needed for virtual hosted sites
    ws: true, // proxy websockets
}


app.use('/generate-token', createProxyMiddleware(localProxyOptions));

app.use('/auth/login/facebook', createProxyMiddleware(tinderProxyOptions));

app.use('/matches', createProxyMiddleware(tinderProxyOptions));


app.listen(3001, () =>
    console.log('Server is running on localhost:3001 💦👙')
);
