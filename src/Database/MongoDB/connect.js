require('dotenv').config();
const mongoose = require('mongoose');

function ConnectDB(){
    console.log('Trying to connect...')
    mongoose.connect(`${process.env['MONGOURL']}`, { useNewUrlParser: true, useUnifiedTopology: true }).then(console.log('Connected')).catch( err => console.log(err))
}

module.exports = ConnectDB;