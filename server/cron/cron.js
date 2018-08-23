// cron will run to update notice is valid or not according to their valid date

/*
 * JSHint esversion : 6
 */

(function () {

    "use strict";

    const CronJob = require('cron').CronJob;
    const server = require('../server');

    new CronJob('* 02 12 * * *', function () {

        server.createLogFile();
        /*
         * Runs every day (Monday through Sunday)
         * at 12:02:00 AM.
         */
    }, null, true);

}());



//function updateStatus() {
//    console.log('updated Status');
//}
//
//setInterval(function () {
//    updateStatus();
//}, 1000 * 5);