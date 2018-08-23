/*jshint esversion: 6 */
'use strict';

const HTTP = require('http'),
        EXPRESS = require('express'),
        BODY_PARSER = require('body-parser');

class TestServer {
    constructor() {
        let self = this;
        self.TestUtils = require('../testUtils');
        self.AppServer = require('../../app');
        self.logger = require('../../utils/logger.js');
        self.mockServerPort = 1111;

    }

    initialize(callback) {
        var self = this;

        self.initTestMockServer()
                .then(function () {
                    self.logger.info('Mock server setup is complete');

                    self.AppServer(function () {

                        self.logger.info('App server setup is complete');
                        self.TestUtils.initializeDatabase(function () {

                            self.logger.info('Database initialization is complete');
                            callback();
                        });
                    });
                })
                .catch(function (error) {
                    self.logger.info('Error occurred while initializing Test suite', error);
                    var err = new Error('An error occcured while initialising the Mock Servers');
                    callback(err);
                });
    }

    initTestMockServer() {

        var self = this;

        return new Promise(function (resolve, reject) {

            let mockApp = EXPRESS();

            // Basic app setup

            mockApp.set('port', self.mockServerPort);
            mockApp.use(BODY_PARSER.json());

            HTTP.createServer(mockApp)
                    .on('error', function (err) {
                        self.logger.error(err);
                        reject(err);
                    })

                    .listen(self.mockServerPort, 'localhost', function () {
                        self.logger.info("Mock-WebServer", "Listening on localhost on port " + mockApp.get('port') + ' in ' + (process.env.NODE_ENV || 'development'));
                        resolve();
                    });


        });
    }
}

module.exports = TestServer;