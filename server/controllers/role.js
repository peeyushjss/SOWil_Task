/* jshint esversion : 6 */

"use strict";

const mongoose = require('mongoose'),
    role = mongoose.model('role'),
    config = require('../config/config'),
    async = require('async'),
    _ = require('lodash'),
    logger = require('../utility/logger');
/**
 POST: /register
 */

exports.addRole = (req, res, next) => {
    let userType = req.body.userType;
    let roles = req.body.role;
    let filter = {};
    if (userType)
        filter = {
            "userType": userType
        };

    async.waterfall([
        (callback) => {
            role.getRoles(filter, (err, result) => {
                if (err) {
                    logger.log(config.strings.ERROR, "oops something went wrong L-29 F-/controller/user.js");
                    callback({ status: false, message: "Oops something went wrong!!" });
                } else {
                    callback(null, result);
                }
            });
        },
        (requestData, callback) => {
            if (requestData && _.isEmpty(requestData)) {
                let allRoles = [];
                allRoles.push(roles);
                let options = {
                    "userType": userType,
                    "role": allRoles
                }
                role.createRole(options, (error, result) => {
                    if (error) {
                        logger.log(config.strings.ERROR, "oops something went wrong L-29 F-/controller/user.js");
                        callback({ status: false, message: "Oops something went wrong!!" });
                    } else {
                        callback(null, result);
                    }
                });
            } else {
                let options = [];
                options = requestData[0].role;
                options.push(roles);
                role.updateRole(filter, options, (error, result) => {
                    if (error) {
                        logger.log(config.strings.ERROR, "oops something went wrong L-29 F-/controller/user.js");
                        callback({ status: false, message: "Oops something went wrong!!" });
                    } else {
                        callback(null, result);
                    }
                });
            }
        }
    ], (err, result) => {
        if (err) {
            return res.json(err);
        } else {
            return res.json(result);
        }
    });
};

exports.getRole = (req, res) => {
    let userType = req.body.userType;
    let filter = {};
    if (userType)
        filter = {
            "userType": userType
        };
    role.getRoles(filter, (err, user) => {
        if (!err) {
            logger.log(config.strings.INFO, "Successfully get all users!");
            res.json({ status: true, result: user });
        } else {
            logger.log(config.strings.ERROR, "oops something went wrong fetching all users L-70 F-/controller/user.js");
            res.json({ status: false, error: err, message: "oops something went wrong!" });
        }
    });
};
