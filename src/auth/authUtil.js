'use strict';

const JWT = require('jsonwebtoken');

const createTokenPair = async (payload, privateKey, publicKey) => {
    try {
        const accessToken = JWT.sign(payload, publicKey, {
            expiresIn: "1d"
        });
        const refreshToken = JWT.sign(payload, privateKey, {
            expiresIn: "7d"
        });

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) console.log(`Error verify::: ${err}`);
            else console.log(`Decode verify::: ${JSON.stringify(decode)}`);
        });

        return { accessToken, refreshToken };
    } catch (err) {
        console.log(`Error verify::: ${err}`);
    }

};

module.exports = {
    createTokenPair
}