require('dotenv').config()
const bcrypt = require('bcrypt');

async function hash(text){
    const hash = await bcrypt.hash(text, Number(process.env['SALT']));
    return hash;
}

async function compare(text, psswrd){
    const bool = await bcrypt.compare(text, psswrd);
    return bool;
}

module.exports = {hash, compare};