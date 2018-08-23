/*jshint multistr: true ,node: true*/
/*jshint esversion: 6 */
"use strict";

const TestServer = require('./server');

describe('Going to Intiate the Test Case Suite for API ', function () {

    before(function (done) {
        // start the web server
        process.env.TEST_ENV = 'TEST';
        let TestServerInstance = new TestServer();
        TestServerInstance.initialize(done);
    });

//    //run test cases for Order Notify API
//    describe("Order Notify API Test Suite", function () {
//        var orderNotifyTestCases = require('./suites/orderNotify');
//        orderNotifyTestCases();
//    });
//
//    //run test cases for Item Status Change Notify API
//    describe("Status Change API Test Suite", function () {
//        var statusChangeApiTestCases = require('./suites/statusChangeNotify');
//        statusChangeApiTestCases();
//    });
//
//    //run test cases for Item Status Change Notify API
//    describe("Status Check API Test Suite", function () {
//        var statusCheckApiTestCases = require('./suites/statusCheck');
//        statusCheckApiTestCases();
//    });

});