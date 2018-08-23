/* jshint esversion: 6, node: true */

"use strict";

const JWT = require('jsonwebtoken');

class Utils {

    async returnUserInfoByToken(token) {

        return new Promise(function(resolve, reject) {
            let decoded = JWT.decode(token, 'onlineNoticeBoard');
            if (decoded && decoded._doc) {
                return resolve(decoded._doc);
            } else {
                return reject(null);
            }
        });

    }

}

module.exports = Utils;