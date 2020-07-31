const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

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


app.listen(3001, () =>
    console.log('Express server is running on localhost:3001')
);
