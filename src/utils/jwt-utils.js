const { sign, verify } = require('jsonwebtoken');

const createAccessToken = (userId) => {
    return sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: '20m',
    });
};

const createRefreshToken = (userId) => {
    return sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: '7d',
    });
};

const verifyRefresh = (token) => {
    try {
        return verify(token, process.env.REFRESH_TOKEN_SECRET).userId;
    } catch (e) {
        return undefined;
    }
};

module.exports = {
    createAccessToken,
    createRefreshToken,
    verifyRefresh,
};