
var User = require('./../model/User.js');
var jwt = require('jwt-simple');

var Translations = require('./../config/Translations.js');

module.exports = function (callbacks, activationCheck) {

    return function(req, res, next) {

        var token = req.headers['x-access-token'];

        if (token) {
            try {
                var decoded = jwt.decode(token, app.get('jwtTokenSecret'));

                if (decoded.exp <= new Date()) {
                    res.status(401).json({
                        message: Translations[req.query.lang].jwtauth.tokenExpired
                    }).end();
                }
                else {
                    // get the user
                    User.findOne({ _id: decoded.iss }, function(err, user) {

                        if (err) {
                            res.status(401).json({
                                message: Translations[req.query.lang].jwtauth.coldntVerifyIdentity
                            }).end();
                        }
                        else {

                            if (user) {

                                if ((!user.active && activationCheck && !activationCheck.skipActivationCheck) ||
                                    (!user.active && !activationCheck)) {
                                    res.status(401).json({
                                        message: Translations[req.query.lang].jwtauth.accountInactive
                                    }).end();
                                }
                                else {

                                    if (user.disabled) {
                                        res.status(401).json({
                                            message: Translations[req.query.lang].jwtauth.accountDisabled
                                        }).end();
                                        return;
                                    }

                                    var successCallbacks = 0;

                                    for (var i = 0; i < callbacks.length; i++) {
                                        callbacks[i](req, res, next, user, function () {
                                            // on error
                                        },
                                        function () {
                                            // on success
                                            successCallbacks++;

                                            if (successCallbacks == callbacks.length) {
                                                if (!res.data || !res.data.local) {
                                                    res.data = {
                                                        local: {}
                                                    };
                                                }
                                                res.data.local.user = user;
                                                next();
                                            }
                                        });
                                    }

                                    if (callbacks.length == 0) {
                                        next();
                                    }

                                }
                            }
                            else {
                                res.status(401).json({
                                    message: Translations[req.query.lang].jwtauth.tokenInvalid
                                }).end();
                            }

                        }
                    });
                }

            } catch (err) {
                res.status(401).json({
                    message: Translations[req.query.lang].jwtauth.tokenExpired
                }).end();
            }
        } else {
            res.status(401).json({
                message: Translations[req.query.lang].jwtauth.didntSendToken
            }).end();
        }

    };
}
