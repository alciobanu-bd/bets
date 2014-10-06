
// NOTE that app is defined globally

var User = require('./../model/User.js');
var Roles = require('./../model/Roles.js');
var RegistrationCode = require('./../model/RegistrationCode.js');
var Random = require('./../services/Random.js');
var express = require('express');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');
var bcrypt = require('bcrypt-nodejs');

var mailServices = require('./../services/mailServices.js');

var _ = require('underscore');
var router = express.Router();

router.get('/user/:id([0-9a-fA-F]{24})',
jwtauth([tokenChecks.hasRole('ROLE_USER')]),
function (req, res, next) {

    User.findOne({_id: req.params.id},
        {password: 0, salt: 0, serverSalt: 0},
        function (err, user) {
            if (err) {
                res.status(500).json({
                    message: "Error fetching user from database."
                }).end();
            }
            else {
                res.status(200).json(user).end();
            }
        });

});

router.get('/user',
jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]),
function (req, res, next) {

    User.find({},
        {password: 0, salt: 0, serverSalt: 0},
        function (err, users) {
            if (err) {
                res.status(500).json({
                    message: "Error fetching users from database."
                }).end();
            }
            else {
                res.status(200).json(users).end();
            }
        });

});

router.get('/user/details',
jwtauth([tokenChecks.hasRole('ROLE_USER')], {skipActivationCheck: true}),
function (req, res, next) {

    User.findOne({_id: res.data.local.user._id},
        {password: 0, salt: 0, serverSalt: 0},
        function (err, user) {
            if (err) {
                res.status(500).json({
                    message: "Error fetching details from database."
                }).end();
            }
            else {
                res.status(200).json(user).end();
            }
        });

});

router.post('/user',
function (req, res, next) {

    if (req.body.password != req.body.confirmPassword) {
        var errorFields = {password: true, confirmPassword: true};
        res.status(500).json({
            message: "Account couldn't be created. Passwords are not matching.",
            errorFields: errorFields
        }).end();
    }

    else {

        User.find({$or: [
            {username: req.body.username},
            {email: req.body.email}
        ]}, function (err, foundUsers) {

            if (err) {
                res.status(500).json({
                    message: "Account couldn't be created due to server errors."
                });
                res.end();
            }
            else {

                if (foundUsers.length > 0) {

                    var errorFields = {username: false, email: false};

                    for (var i = 0; i < foundUsers.length; i++) {
                        var fUser = foundUsers[i];
                        if (fUser.username == req.body.username) {
                            errorFields.username = true;
                        }
                        if (fUser.email == req.body.email) {
                            errorFields.email = true;
                        }
                    }

                    res.status(409).json({
                        message: "Account couldn't be created. Some fields are already taken.",
                        errorFields: errorFields
                    }).end();
                }

                else {

                    User.find({}, {place: 1, points: 1}, function (err, userPlaces) {
                        if (err) {
                            res.status(500).json({
                                message: "Account couldn't be created due to server errors."
                            }).end();
                        }
                        else {

                            //calculate place (number of users which have more points than zero + 1)
                            req.body.place = _.filter(userPlaces, function (user) {
                                return user.points > 0;
                            }).length + 1;

                            req.body.registerDate = new Date();
                            req.body.points = 0;
                            req.body.avgPoints = 0;
                            req.body.role = Roles.user.name;
                            req.body.registrationIp = req.connection.remoteAddress;
                            req.body.serverSalt = bcrypt.genSaltSync();
                            req.body.active = false;

                            bcrypt.hash(req.body.password, req.body.serverSalt, null, function (err, hash) {
                                if (err) {
                                    res.status(500).json({
                                        message: "Account couldn't be created due to server errors."
                                    }).end();
                                }
                                else {
                                    req.body.password = hash;
                                    next();
                                }
                            });

                        }
                    });
                }

            }
        });
    }
},

function (req, res, next) {

    var user = new User();

    for (var i in req.body) {
        user[i] = req.body[i];
    };

    user.save(function (err) {
        if (err) {
            res.status(500).json(err);
        }
        else {
            req.data = {
                user: user
            };
            next();
        }
    });

},
function (req, res, next) {

    RegistrationCode.findOne({userId: req.data.user._id},
    function (err, regCode) {

        if (err) {
            res.status(500).json({
                message: "Account was saved, but a registration code couldn't be provided via e-mail. " +
                    "Please login and request a new one."
            });
        }

        else {

            if (!regCode) {
                regCode = new RegistrationCode();
            }
            regCode.userId = req.data.user._id;
            var now = new Date();
            regCode.expirationDate = now.setHours(now.getHours() + 24 * 5);
            regCode.registrationCode = Random.randomString();

            regCode.save(function (err) {
                if (err) {
                    res.status(500).json({
                        message: "Account was saved, but a registration code couldn't be provided via e-mail. " +
                            "Please login and request a new one."
                    });
                }
                else {

                    mailServices.sendConfirmationLinkOnRegistration(req.data.user.username, req.data.user.email, regCode.registrationCode,
                        function (info) {
                            // success
                        },
                        function (err) {
                            // error
                            console.log("registration mail couldn't be delivered", err);
                        });

                    res.status(201).json(req.data.user).end();

                }
            });

        }
    });

});

router.get('/user/resend_regcode',
jwtauth([tokenChecks.hasRole('ROLE_USER')], {skipActivationCheck: true}),
function (req, res, next) {

    RegistrationCode.findOne({userId: res.data.local.user._id},
        function (err, regCode) {

            if (err) {
                res.status(500).json({
                    message: "A registration code couldn't be provided."
                }).end();
            }

            else {

                if (!regCode) {
                    regCode = new RegistrationCode();
                }
                regCode.userId = res.data.local.user._id;
                var now = new Date();
                regCode.expirationDate = now.setHours(now.getHours() + 24 * 5);
                regCode.registrationCode = Random.randomString();

                regCode.save(function (err) {
                    if (err) {
                        res.status(500).json({
                            message: "A registration code couldn't be provided."
                        }).end();
                    }
                    else {

                        mailServices.sendConfirmationLinkOnRegistration(res.data.local.user.username, res.data.local.user.email, regCode.registrationCode,
                            function (info) {
                                // success
                            },
                            function (err) {
                                // error
                                console.log("Registration code via mail failed", err);
                            });

                        res.status(200).json({
                            message: "An e-mail containing an activation code will be sent to your e-mail shortly."
                        }).end();

                    }
                });

            }
        });

});

router.put('/user/:id([0-9a-fA-F]{24})',
jwtauth([
    tokenChecks.hasSameIdOrHasRole('ROLE_ADMIN'),
    function(req, res, next, user, onError, onSuccess) {

        // prevent users to save role if they don't have admin role
        if (Roles.roleValue(user.role) < Roles.admin.value ||
            (req.body.role && Roles.roleValue(user.role) <= Roles.roleValue(req.body.role))) {

            if (req.body.role) {
                delete req.body.role;
            }
            if (req.body.active) {
                delete req.body.active;
            }
            if (req.body.disabled) {
                delete req.body.disabled;
            }
        }

        if (req.body.registrationIp) {
            delete req.body.registrationIp;
        }

        if (req.body.points) {
            delete req.body.points;
        }

        if (req.body.place) {
            delete req.body.place;
        }

        onSuccess();

    }
]),
function(req, res, next) {

    User.findOne({_id: req.params.id},
        function (err, user) {
            if (err || !user) {
                res.status(500).json({
                    message: "User couldn't be found in the database."
                }).end();
            }
            else {
                for (var i in req.body) {
                    user[i] = req.body[i];
                }

                user.save(function (err) {
                    if (err) {
                        res.status(500).json({
                            message: "User couldn't be saved in the database. Please try again."
                        }).end();
                    }
                    else {
                        res.status(200).json(user).end();
                    }
                });

            }
        });

}
);

router.post('/user/changePassword',
jwtauth([tokenChecks.hasRole('ROLE_USER')]),
function (req, res, next) {

    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var confirmPassword = req.body.confirmPassword;

    var user = res.data.local.user;

    if (newPassword != confirmPassword) {
        res.status(500).json({
            message: "New password and confirm password do not match."
        }).end();
    }

    bcrypt.hash(oldPassword, user.serverSalt, null, function (err, oldPwHash) {
        if (err) {
            res.status(500).json({
                message: "We couldn't change your password. Please try again."
            }).end();
        }
        else {

            if (oldPwHash != user.password) {
                res.status(500).json({
                    message: "Old password you entered is wrong."
                }).end();
            }
            else {


                bcrypt.hash(newPassword, user.serverSalt, null, function (err, hash) {
                    if (err) {
                        res.status(500).json({
                            message: "We couldn't change your password. Please try again."
                        }).end();
                    }
                    else {

                        User.update({_id: user._id},
                            {$set: {active: false, password: hash}},
                            function (err) {
                                if (err) {
                                    res.status(500).json({
                                        message: "We couldn't change your password. Please try again."
                                    }).end();
                                }
                                else {
                                    next();
                                }
                            });

                    }
                });


            }

        }
    });
},
function (req, res, next) {

    RegistrationCode.findOne({userId: res.data.local.user._id},
        function (err, regCode) {

            if (err) {
                res.status(500).json({
                    message: "New password was saved, but no confirmation e-mail could be sent." +
                        "Please login and request a new one."
                });
            }

            else {

                if (!regCode) {
                    regCode = new RegistrationCode();
                }
                regCode.userId = res.data.local.user._id;
                var now = new Date();
                regCode.expirationDate = now.setHours(now.getHours() + 24 * 5);
                regCode.registrationCode = Random.randomString();

                regCode.save(function (err) {
                    if (err) {
                        res.status(500).json({
                            message: "New password was saved, but no confirmation e-mail could be sent. " +
                                "Please login and request a new one."
                        });
                    }
                    else {

                        mailServices.sendConfirmationLinkOnPasswordChange(res.data.local.user.username,
                            res.data.local.user.email,
                            regCode.registrationCode,

                            function (info) {
                                // success
                            },
                            function (err) {
                                // error
                                console.log("change password mail couldn't be delivered", err);
                            });

                        res.status(200).json({changed: "ok"}).end();

                    }
                });

            }
        });

}
);

/*
 * Expects a registration code in body json.
 */
router.post('/user/activate',
jwtauth([function (req, res, next, user, onError, onSuccess) {

    RegistrationCode.findOne({userId: user._id},
    function (err, regCode) {
        if (err) {
            res.status(500).json({
                message: "An error occurred with the database."
            }).end();
            onError();
        }
        else {

            if (req.body.registrationCode != regCode.registrationCode) {
                res.status(500).json({
                    message: "The registration code you entered is not valid."
                }).end();
                onError();
            }
            else {

                if (new Date(regCode.expirationDate) < new Date()) {
                    res.status(500).json({
                        message: "The registration code you entered expired. Please request another one."
                    }).end();
                    onError();
                }

                else {
                    onSuccess();
                }

            }
        }
    });

}], {skipActivationCheck: true}),
function (req, res, next) {

    var user = res.data.local.user;

    user.active = true;
    user.save(function (err) {
        if (err) {
            res.status(500).json({
                message: "User couldn't be activated due to database errors."
            }).end();
        }
        else {
            res.status(200).json(user).end();
            RegistrationCode.remove({registrationCode: req.body.registrationCode});
        }
    });


});

app.use('/api', router);
