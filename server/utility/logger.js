/*
 * JSHint esversion : 6
 */

(function () {

    "use strict";
    const winston = require('winston');
    const moment = require("moment");
    const config = require('../config/config');
    let datevise = moment().format('DD_MM_YYYY');

//    fs.exists('logs/onlineNoticeBoard.log', function (exists) {
//        if (!exists) {
//            fs.writeFile('logs/onlineNoticeBoard.log');
//        }
//    });

    const logging = new (winston.Logger)({
        transports: [
            new (winston.transports.File)({
                filename: config.logs.filename + '_' + datevise,
                json: true
            })
        ]
    });


    const logger = {

        /**
         The below function is a wrapper function on Winston which takes in request and also logs the
         client request id (x-client-id)
         **/
        log: function (level, msg) {
            logging.log(level, msg);
        }
    };

    module.exports = logger;

}());