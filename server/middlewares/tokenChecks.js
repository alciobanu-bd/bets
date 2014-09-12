
var Roles = require('./../model/Roles.js');

var hasRole = function (role) {
    return function (req, res, next, user) {
        if (role && Roles.roleValue(user.role) < Roles.roleValue(role)) {
            res.status(401).json({
                message: "You are not permitted to execute this method."
            });
        }
    }
}

var hasSameId = function () {
    return function (req, res, next, user) {

        if (req.params.id) {
            if (user._id != req.params.id) {
                res.status(401).json({
                    message: "You are not permitted to execute this method."
                }).end();
            }
        }
    }
}

var hasRoleWithId = function (role) { // for /get/:id
    return function (req, res, next, user) {

        if (req.params.id) {
            if (role && Roles.roleValue(user.role) < Roles.roleValue(role)) {
                res.status(401).json({
                    message: "You are not permitted to execute this method."
                }).end();
            }
        }
    }
}

var hasRoleWithoutId = function (role) { // for /get (withoud :id)
    return function (req, res, next, user) {

        if (req.params.id == undefined) {
            if (role && Roles.roleValue(user.role) < Roles.roleValue(role)) {
                res.status(401).json({
                    message: "You are not permitted to execute this method."
                }).end();
            }
        }
    }
}

var hasSameIdOrHasRole = function (role) {
    return function (req, res, next, user) {
        if (req.params.id) {
            if (role && Roles.roleValue(user.role) < Roles.roleValue(role)) {
                // if role isn't enough, check if same id
                if (user._id != req.params.id) {
                    res.status(401).json({
                        message: "You are not permitted to execute this method."
                    }).end();
                }
            }

        }
    }
}

module.exports = {
    hasRole: hasRole,
    hasSameId: hasSameId,
    hasRoleWithId: hasRoleWithId,
    hasRoleWithoutId: hasRoleWithoutId,
    hasSameIdOrHasRole: hasSameIdOrHasRole
};
