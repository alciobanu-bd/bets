
var User = require('./../model/User.js');
var jwt = require('jwt-simple');

module.exports = function (callbacks, activationCheck) {

    return function(req, res, next) {

        var token = req.headers['x-access-token'];

        if (token) {
            try {
                var decoded = jwt.decode(token, app.get('jwtTokenSecret'));

                if (decoded.exp <= new Date()) {
                    res.status(401).json({
                        message: "Your token has expired. Please log in again."
                    }).end();
                }
                else {
                    // get the user
                    User.findOne({ _id: decoded.iss }, function(err, user) {

                        if (err) {
                            res.status(401).json({
                                message: "An error has occurred. We couldn't verify your identity."
                            }).end();
                        }
                        else {

                            if (user) {

                                if ((!user.active && activationCheck && !activationCheck.skipActivationCheck) ||
                                    (!user.active && !activationCheck)) {
                                    res.status(401).json({
                                        message: "Your account is inactive."
                                    }).end();
                                }
                                else {

                                    var successCallbacks = 0;

                                    for (var i in callbacks) {
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

                                }
                            }
                            else {
                                res.status(401).json({
                                    message: "Login token is invalid."
                                }).end();
                            }

                        }
                    });
                }

            } catch (err) {
                res.status(401).json({
                    message: "Your token has expired. Please log in again."
                }).end();
            }
        } else {
            res.status(401).json({
                message: "You didn't send an authorization token."
            }).end();
        }

    };
}
