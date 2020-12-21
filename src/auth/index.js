const {createAccessToken, createRefreshToken, verifyRefresh} = require("../utils/jwt-utils");
const {User} = require('../utils/mongo-init');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

exports.login = async function(req, res){

    const {email, password} = req.body;

    const user = await User.find({ 'email': email}, 'email password group queues refreshToken', function (err, result) {
        if (err) console.log(err);
    }).exec();

    if (!user || user.length === 0) {
        res.status(401).send({error: 'Invalid credentials.'});
    } else if (bcrypt.compareSync(password, user[0].password)) {
        const accessToken = createAccessToken(email);
        const accessDate = new Date();
        accessDate.setMinutes(accessDate.getMinutes() + 20);

        const refreshToken = createRefreshToken(email);
        const refreshDate = new Date();
        refreshDate.setDate(refreshDate.getDate() + 7);

        await User.findOneAndUpdate({email: email}, {refreshToken: refreshToken});

        res.send({
            message: 'Successfully logged in',
            access_token: { token: accessToken, expires: accessDate },
            refresh_token: { token: refreshToken, expires: refreshDate },
        });
    } else {
        res.status(401).send({error: 'Invalid credentials.'});
    }
}

exports.refresh = async function (req, res){
    const token = req.body.refresh_token || '';
    const email = verifyRefresh(token);

    if (!token || !email) {
        return res.status(401).send({
            error: 'Invalid token.'
        });
    }

    const user = await User.find({ 'email': email}, 'refreshToken', function (err, result) {
        if (err) console.log(err);
    }).exec();

    if (token !== user[0].refreshToken) {
        return res.status(401).send({
            error: 'Invalid token.'
        });
    }

    const accessToken = createAccessToken(email);
    const accessDate = new Date();
    accessDate.setMinutes(accessDate.getMinutes() + 20);

    const refreshToken = createRefreshToken(email);
    const refreshDate = new Date();
    refreshDate.setDate(refreshDate.getDate() + 7);

    await User.findOneAndUpdate({email: email}, {refreshToken: refreshToken});

    res.send({
        message: 'Successfully refreshed token',
        access_token: { token: accessToken, expires: accessDate },
        refresh_token: { token: refreshToken, expires: refreshDate },
    });
}

exports.isAuthenticated = function(req, res){
    let accessToken = req.body.access_token;

    if (!accessToken) {
        return res.status(403).send({
            isAuthenticated: false,
        });
    }

    try {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        res.send({
            isAuthenticated: true,
        });
    } catch(e) {
        return res.status(401).send({
            isAuthenticated: false,
        });
    }
}