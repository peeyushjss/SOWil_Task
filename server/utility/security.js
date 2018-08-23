'use strict';

//http://lollyrock.com/articles/nodejs-encryption/

var Config = require('../config/config'),
        crypto = require('crypto'),
        algorithm = 'aes-256-ctr';

var privateKey = Config.key.privateKey;

// method to encrypt data(password)
exports.encryptPassword = function (password) {
    var cipher = crypto.createCipher(algorithm, privateKey);
    var crypted = cipher.update(password, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

// method to decrypt data(password) 
exports.decryptPassword = function (password) {
    try {
        var decipher = crypto.createDecipher(algorithm, privateKey);
        var dec = decipher.update(password, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    } catch (ex) {
        return ex;
    }
};

exports.validateEmail = function (email) {
    let regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regEx.test(email); // valid email returns true otherwise false
};

exports.validateMobile = function (mobile) {
    var regEx = /^[0-9]{10}$/;
    return regEx.test(mobile); // valid number returns true otherwise false
};