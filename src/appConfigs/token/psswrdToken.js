const crypto = require('crypto');

function resetToken() {
    const token = crypto.randomBytes(6).toString('hex');
    var dateNow = new Date();  
    var aDayFuture = new Date(dateNow.setDate(dateNow.getDate() + 1)).toISOString();
    return { passToken: token, Hour: aDayFuture }
}

module.exports = resetToken;