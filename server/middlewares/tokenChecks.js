
var Roles = require('./../model/Roles.js');

var hasRole = function (role) {
    return function (req, res, next, user, onError) {
        if (role && Roles.roleValue(user.role) < Roles.roleValue(role)) {
            res.status(401).json({
                message: "You are not permitted to execute this method."
            });
            onError();
        }
    }
}

var hasSameId = function () {
    return function (req, res, next, user, onError) {

        if (req.params.id) {
            if (user._id != req.params.id) {
                res.status(401).json({
                    message: "You are not permitted to execute this method."
                }).end();
                onError();
            }
        }
    }
}

var hasSameIdOrHasRole = function (role) {
    return function (req, res, next, user, onError) {
        if (req.params.id) {
            if (role && Roles.roleValue(user.role) < Roles.roleValue(role)) {
                // if role isn't enough, check if same id
                if (user._id != req.params.id) {
                    res.status(401).json({
                        message: "You are not permitted to execute this method."
                    }).end();
                    onError();
                }
            }

        }
    }
}

module.exports = {
    hasRole: hasRole,
    hasSameId: hasSameId,
    hasSameIdOrHasRole: hasSameIdOrHasRole
};
