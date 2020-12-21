require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const {mongooseConnection} = require('./src/utils/mongo-init');
const {login, refresh, isAuthenticated} = require('./src/auth/index');


const db = mongooseConnection;
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());

app.post('/login', login);
app.post('/refresh', refresh);
app.post('/isAuthenticated', isAuthenticated);

app.listen(4200, () => {
    console.log('app listening on port 4200');
});