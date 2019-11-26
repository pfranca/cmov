const crypto = require('crypto');

let getRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
    .toString('hex')
    .slice(0,length);
}

let sha512 = function(password, salt){
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    let value = hash.digest('hex');
    return{
        salt:salt,
        passwordHash: value
    };
};

function saltHashPassword(userPassword){
    let salt = getRandomString(16);
    let passwordData = sha512(userPassword, salt);
    return passwordData;
};

function checkHashPassword(userPassword, salt){
    let passwordData = sha512(userPassword,salt);
    return passwordData;
}

module.exports.saltHashPassword = saltHashPassword;
module.exports.checkHashPassword = checkHashPassword;