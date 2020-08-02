const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const app = express();
const generateAccessToken = require('./generateToken')

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(pino);

app.post('/generate-token', async (req, res) => {
    let {body} = req
    return generateAccessToken({emailAddress: body.email, password: body.pass})
        .then((response) => res.json(response))
        .catch((err) => {
            console.log(err)
            return res.status(500).end()
        })
})

app.listen(3001, () =>
    console.log('Server is running on localhost:3001 💦👙')
);
