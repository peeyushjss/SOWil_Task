/*jshint esversion: 6 */

(function () {

    'use strict';

    const express = require('express'),
        // Db = require('./db'),
        bodyParser = require('body-parser'),
        cors = require('cors'),
        // fs = require('fs'),
        config = require('./config/config'),
        app = express(),
        moment = require('moment');

    app.use(function (req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.use(express.static(__dirname + '/../client'));

    app.use(cors());

    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true }));

    let datevise = moment().format('DD_MM_YYYY');

    // exports.createLogFile = function () {
    //     console.log('log file craeted successfully');
    //     fs.exists(config.logs.filename + '_' + datevise, function (exists) {
    //         if (!exists) {
    //             fs.writeFile(config.logs.filename + '_' + datevise);
    //         }
    //     });
    // };

    // exports.createLogFile();

    //Getting a path for model directory, where schema is defined
    var normalizedPath = require("path").join(__dirname, "./models");

    //Registering mongoose schema
    require("fs").readdirSync(normalizedPath).forEach(function (file) {
        require("./models/" + file);
    });

    console.log('server is running on port : ' + config.server.port);
    app.listen(config.server.port);

    require('./routes')(app);

    module.exports = app;

}());