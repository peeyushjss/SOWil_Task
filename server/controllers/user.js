/* jshint esversion : 6 */

"use strict";

const mongoose = require('mongoose'),
    login = mongoose.model('user'),
    config = require('../config/config'),
    encryption = require('../utility/security'),
    jwt = require('jsonwebtoken'),
    async = require('async'),
    _ = require('lodash'),
    logger = require('../utility/logger'),
    nodemailer = require('nodemailer');

/**
 POST: /register
 */

exports.registerUser = (req, res, next) => {
    let requestBody = _.get(req, 'body', {});

    async.waterfall([
        (callback) => {
            login.getLoginUser({
                $or: [
                    { email: requestBody.email },
                    { mobile: requestBody.mobile },
                ]
            }, (err, result) => {
                if (err) {
                    logger.log(config.strings.ERROR, "oops something went wrong L-29 F-/controller/user.js");
                    callback({ status: false, message: "Oops something went wrong!!" });
                } else {
                    if (result) {
                        logger.log(config.strings.ERROR, "User is already registered! L-33 F-/controller/user.js");
                        callback({ status: false, message: "User is already registered!" });
                    } else {
                        logger.log(config.strings.INFO, "User ready for registered");
                        callback(null, requestBody);
                    }
                }
            });
        },
        (requestData, callback) => {
            requestData.password = encryption.encryptPassword(requestData.password);
            login.createUser(requestData, (err, result) => {
                if (err) {
                    logger.log(config.strings.ERROR, JSON.stringify(err) + " L-46 F-/controller/user.js");
                    callback({ status: false, message: err });
                } else {
                    logger.log(config.strings.INFO, "User registered successfully");
                    callback(null, result);
                }
            });
        }
    ], (err, result) => {
        if (err) {
            return res.json(err);
        } else {
            return res.json(result);
        }
    });

};

exports.getAllUser = (req, res) => {
    login.getAllUsers((err, user) => {
        if (!err) {
            logger.log(config.strings.INFO, "Successfully get all users!");
            res.json({ status: true, result: user });
        } else {
            logger.log(config.strings.ERROR, "oops something went wrong fetching all users L-70 F-/controller/user.js");
            res.json({ status: false, error: err, message: "oops something went wrong!" });
        }
    });
};

exports.loginUser = (req, res, next) => {
    let requestBody = _.get(req, 'body', {});
    async.waterfall([
        (callback) => {
            login.getLoginUser({
                $or: [
                    { email: requestBody.userName },
                    { mobile: requestBody.userName }
                ]
            }, (err, result) => {
                if (err) {
                    logger.log(config.strings.ERROR, JSON.stringify(err) + "L-86 F-/controller/user.js");
                    callback({ status: false, message: "Oops something went wrong!" });
                } else {
                    if (result) {
                        logger.log(config.strings.INFO, "User Name Successfully found!");
                        callback(null, result);
                    } else {
                        logger.log(config.strings.ERROR, "Invalid username L-93 F-/controller/user.js");
                        callback({ status: false, message: "Invalid username!" });
                    }
                }
            });
        },
        (user, callback) => {
            let decryptPwd = encryption.decryptPassword(user.password);
            if (requestBody.password === decryptPwd) {
                let response = {};
                response.status = true;
                response.token = jwt.sign(user, config.key.privateKey);
                response.data = {
                    "_id": user._id,
                    "email": user.email,
                    "mobile": user.mobile,
                    "name": user.name,
                    "userType": user.userType
                };
                logger.log(config.strings.INFO, "User Login Successfully!");
                callback(null, response);
            } else {
                logger.log(config.strings.ERROR, "Invalid password L-107 F-/controller/user.js");
                callback({ status: false, message: "Invalid password!" });
            }
        }
    ], (err, result) => {
        if (err)
            return res.json(err);
        else
            return res.json(result);
    });
};

exports.forgetPwd = (req, res, next) => {
    let requestBody = _.get(req, 'body', {});
    async.waterfall([
        (callback) => {
            login.getLoginUser({
                $and: [
                    { isActive: true },
                    { isDeleted: { $ne: true } },
                    {
                        $or: [{ email: requestBody.userName },
                        { uniqueId: requestBody.userName },
                        { mobile: requestBody.userName }
                        ]
                    }
                ]
            }, (err, result) => {
                if (err) {
                    logger.log(config.strings.ERROR, JSON.stringify(err) + "L-129 F-/controller/user.js");
                    callback({ status: false, message: "Oops something went wrong!" });
                } else {
                    if (result) {
                        logger.log(config.strings.INFO, "User Name available!");
                        callback(null, result);
                    } else {
                        logger.log(config.strings.ERROR, "Invalid username L-136 F-/controller/user.js");
                        callback({ status: false, message: "Invalid username!" });
                    }
                }
            });
        },
        (user, callback) => {
            let decryptPwd = encryption.decryptPassword(user.password);
            var response = {};
            response.status = true;
            response.message = "Password sent to your register Email id!";

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.email.username,
                    pass: config.email.password
                }
            });

            let mailOptions = {
                from: config.email.username,
                to: requestBody.userName,
                subject: "Password",
                text: 'Your Password is : ' + decryptPwd,
                // html: '<h3>' + bodyData.body + '</h3>'
            };
            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    logger.log(config.strings.ERROR, error + " L-136 F-/controller/user.js");
                    callback({ status: false, message: error });
                } else {
                    callback(null, response);
                }
            });
        }
    ], (err, result) => {
        if (err)
            return res.json(err);
        else
            return res.json(result);
    });
};

exports.resetPwd = (req, res, next) => {

    let requestBody = _.get(req, 'body', {});
    let email;
    let response = {};

    if (requestBody && requestBody.oldPassword && requestBody.newPassword && requestBody.confirmPassword) {
        if (requestBody && requestBody.newPassword === requestBody.confirmPassword) {
            let token = req.headers.access_token;
            if (token) {
                let decoded = jwt.decode(token, 'onlineNotice');
                if (decoded) {
                    if (decoded._doc && decoded._doc.email) {
                        email = decoded._doc.email;
                    }
                } else {
                    res.json({ status: false, message: "Invalid User!" });
                }
            }

            async.waterfall([
                (callback) => {
                    login.getLoginUser({
                        $and: [
                            { isActive: true },
                            { isDeleted: { $ne: true } },
                            { email: email }
                        ]
                    }, (err, result) => {
                        if (err) {
                            logger.log(config.strings.ERROR, JSON.stringify(err) + "L-86 F-/controller/user.js");
                            callback({ status: false, message: "Oops something went wrong!" });
                        } else {
                            if (result) {
                                logger.log(config.strings.INFO, "User Name Successfully found!");
                                callback(null, result);
                            } else {
                                logger.log(config.strings.ERROR, "Invalid username L-93 F-/controller/user.js");
                                callback({ status: false, message: "Invalid username!" });
                            }
                        }
                    });
                },
                (user, callback) => {
                    let decryptPwd = encryption.decryptPassword(user.password);
                    if (requestBody.oldPassword === decryptPwd) {
                        let newPassword = encryption.encryptPassword(requestBody.newPassword);
                        login.updateUser({
                            $and: [
                                { isActive: true },
                                { isDeleted: { $ne: true } },
                                { email: email }
                            ]
                        }, { $set: { password: newPassword } }, (err, result) => {
                            if (err) {
                                logger.log(config.strings.ERROR, JSON.stringify(err) + "L-86 F-/controller/user.js");
                                callback({ status: false, message: "Oops something went wrong at update password time!" });
                            } else {
                                if (result) {
                                    response.status = true;
                                    response.message = "User Password Successfully updated";
                                    logger.log(config.strings.INFO, "User Password Successfully updated!");
                                    callback(null, response);
                                } else {
                                    logger.log(config.strings.ERROR, "Invalid username L-93 F-/controller/user.js");
                                    callback({ status: false, message: "Invalid username!" });
                                }
                            }
                        });
                    } else {
                        logger.log(config.strings.ERROR, "Invalid password L-107 F-/controller/user.js");
                        callback({ status: false, message: "Invalid password!" });
                    }
                }
            ], (err, result) => {
                if (err)
                    return res.json(err);
                else
                    return res.json(result);
            });
        } else {
            logger.log(config.strings.ERROR, "Both password are should match. L-107 F-/controller/user.js");
            res.json({ status: false, message: "Both password are should match!" });
        }
    } else {
        logger.log(config.strings.ERROR, "All required fields are not available. L-107 F-/controller/user.js");
        res.json({ status: false, message: "All required fields are not present!" });
    }
};