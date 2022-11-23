require('dotenv').config()
const jwt = require('jsonwebtoken');

function generate(user){
return jwt.sign({payload:{cde:user.cde, name:user.name}}, `${process.env['SECRET']}`, {expiresIn:'2d'});
}

function verify(token){
    try{
        return jwt.verify(token, `${process.env['SECRET']}`);
    }catch{
        throw Error;
    }
}

module.exports = {generate, verify};