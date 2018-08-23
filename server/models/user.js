/* jshint esversion : 6 */

'use strict';

const mongoose = require('mongoose'),
    logger = require('../utility/logger'),
    config = require('../config/config'),
    Schema = mongoose.Schema;

/**
 * @module  User
 * @description contain the details of User  
 */

let UserSchema = new Schema({

    /** 
     User email. It can only contain string, is required field and unique field which is indexed.
     */
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true
    },

    /** 
     Contact Number. It can only contain number, is required field and unique field which is indexed.
     */

    mobile: { type: String, unique: true, required: true },

    /** 
     name. It can containg string, is required field
     */
    name: { type: String, required: true },

    /** 
     Password. It can only contain string, is required field.
     */

    password: { type: String, required: true },

    /** 
     userType. It can only contain string, is required field. Eg: Admin, Doctor, Patient
     */

    userType: { type: String, required: true }

});

UserSchema.statics.getAllUsers = function (query, callback) {
    this.find(query, callback);
};

UserSchema.statics.createUser = function (requestData, callback) {
    this.create(requestData, callback);
};

UserSchema.statics.getLoginUser = function (query, callback) {
    this.findOne(query, callback);
};

UserSchema.statics.updateUser = function (check, setValue, callback) {
    this.update(check, setValue, callback);
};

// UserSchema.statics.updateUser = function(userId, data, callback) {
//     this.findOneAndUpdate({ 'userId': userId }, { $set: data }, { new: true }, callback);
// };

// UserSchema.statics.removeUser = function(userId, callback) {
//     this.remove({ 'userId': userId }, callback);
// };

let user = mongoose.model('user', UserSchema);

let userTable = mongoose.model('user');

userTable.findOne({ userType: "admin" }, function (err, result) {
    if (err)
        logger.log(config.strings.INFO, "Record can't be insert due to error on find : ", err);
    else if (!result) {
        loginTable.create({
            "email": "peeyushjss@gmail.com",
            "mobile": "9599812027",
            "name": "Admin",
            "userType": "admin",
            "password": "Admin"
        }, function (error, record) {
            if (error)
                logger.log(config.strings.ERROR, "Record can't be insert due to error on save : ", error);
            else if (record)
                logger.log(config.strings.INFO, "Record is inserted");
        });
    } else
        logger.log(config.strings.ERROR, "Record is already exist");
});

/** export schema */
module.exports = {
    User: user
};