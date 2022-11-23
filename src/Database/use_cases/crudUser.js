const mongoose = require('mongoose');
const User = require('../models/userSchema');
const jwt = require('../../appConfigs/token/jwt');
const crypt = require('../../appConfigs/hash/hash')
const psswrdToken = require('../../appConfigs/token/psswrdToken');

async function create({ cde, email, name, psswrd }) {
    const body = { cde: cde, email: email, name: name, psswrd: await crypt.hash(psswrd), changeTk: '', expireTime: new Date() }
    const user = await User.create(body);
    const token = jwt.generate(user);
    return token;
}

function read_token(token) {
    try {
        const user = jwt.verify(token)
        return user.payload;
    } catch {
        throw Error;
    }
}

async function read_login(login, psswrd) {
    try {
        const user = await User.findOne({ cde: login })
        const bool = await crypt.compare(psswrd, user.psswrd);
        if (bool) {
            return jwt.generate(user);
        } else {
            return '';
        }
    } catch {
        return ''
    }
}

async function setResetPassword(cde) {
    try {
        const user = await User.findOne({ cde: cde })
        if (!user) { throw Error; }
        const tk = psswrdToken();
        await User.findByIdAndUpdate({ _id: user._id }, {
            changeTk: tk.passToken,
            expireTime: tk.Hour
        })
        return { token: tk.passToken, email: user.email };
    } catch {
        throw Error;
    }
}

async function checkChangePsswrd(cde, token) {
    const user = await User.findOne({ cde: cde });
    if (user.changeTk === token && user.expireTime > new Date()) {
        return true;
    }
    return false;
}

async function changePassword(cde, newPsswrd) {
    User.findOneAndUpdate({ cde: cde }, {
        psswrd: await crypt.hash(newPsswrd)
    })
}

module.exports = { create, read_login, read_token, setResetPassword, checkChangePsswrd, changePassword };