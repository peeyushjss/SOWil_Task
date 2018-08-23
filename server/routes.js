/* jshint esversion: 6 */

'use strict';

const User = require('./controllers/user');
const isAuth = require('./utility/isAuth');

// APIs Endpoint
module.exports = function (app) {

    app.route('/api/register')
        .post(isAuth.isAuthForCreateUser, User.registerUser);

    app.route('/api/login')
        .post(User.loginUser);

    app.route('/api/getAllUsers')
        .get(User.getAllUser);

    app.route('/api/forgetPassword')
        .post(User.forgetPwd);

    app.route('/api/resetPassword')
        .post(User.resetPwd);

};