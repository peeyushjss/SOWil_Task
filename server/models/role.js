/* jshint esversion : 6 */

'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * @module  Role
 * @description contain the details of UserType with their role  
 */

let RoleSchema = new Schema({

    /** 
     role. It can contains array, is required field
     */
    role: { type: Array, required: true },

    /** 
     userType. It can only contain string, is required field. Eg: Admin, Doctor, Patient
     */

    userType: { type: String, required: true }

});

RoleSchema.statics.getRoles = function (query, callback) {
    this.findOne(query, callback);
};

RoleSchema.statics.createRole = function (requestData, callback) {
    this.create(requestData, callback);
};

RoleSchema.statics.updateRole = function (check, setValue, callback) {
    this.update(check, setValue, callback);
};

let role = mongoose.model('role', RoleSchema);

/** export schema */
module.exports = {
    Role: role
};