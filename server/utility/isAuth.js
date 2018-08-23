// get an instance of the router for api routes

const UTILS = require("./utils");
const utils = new UTILS();

// route middleware to decode a token in case of create any user.
exports.isAuthForCreateUser = async function(req, res, next) {
    console.log('isAuthForCreateUser middleware run');
    if (typeof req.headers.access_token !== 'undefined') {
        let userInfo = await utils.returnUserInfoByToken(req.headers.access_token);
        if (userInfo && userInfo.role && userInfo.role.toLowerCase() === "admin") {
            req.canCreateUser = true;
            next();
        } else {
            res.json({ status: false, info: "User is not authorized for create user" })
        }

    } else
        res.json({ status: false, info: "User is not valid" });
};

// route middleware to decode a token in case of create notice.
exports.isAuthForCreateNotice = async function(req, res, next) {
    console.log('isAuthForCreateNotice middleware run');
    if (typeof req.headers.access_token !== 'undefined') {
        let userInfo = await utils.returnUserInfoByToken(req.headers.access_token);
        if (userInfo && userInfo.role && (userInfo.role.toLowerCase() === "admin" || userInfo.role.toLowerCase() === "faculty")) {
            req.canCreateNotice = true;
            next();
        } else
            res.json({ status: false, info: "User is not authorized for create notice" });

    } else
        res.json({ status: false, info: "User is not valid" });
};

// route middleware to decode a token in case of create event.
exports.isAuthForCreateEvent = async function(req, res, next) {
    console.log('isAuthForCreateEvent middleware run');
    if (typeof req.headers.access_token !== 'undefined') {
        let userInfo = await utils.returnUserInfoByToken(req.headers.access_token);
        if (userInfo && userInfo.role && (userInfo.role.toLowerCase() === "admin" || userInfo.role.toLowerCase() === "faculty")) {
            req.canCreateEvent = true;
            next();
        } else
            res.json({ status: false, info: "User is not authorized for create event" });

    } else
        res.json({ status: false, info: "User is not authorized for create event" });
};