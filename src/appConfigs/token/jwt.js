require('dotenv').config()
const jwt = require('jsonwebtoken');

function generate(user) {
    return jwt.sign({ payload: { cde: user.cde, name: user.name } }, `${process.env['SECRET']}`, { expiresIn: '2d' });
}

function verify(token) {
    try {
        const verified = jwt.verify(token, `${process.env['SECRET']}`)
        return verified;
    } catch {
        throw Error;
    }
}

module.exports = { generate, verify };