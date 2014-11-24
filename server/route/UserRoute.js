
// NOTE that app is defined globally

var User = require('./../model/User.js');
var Roles = require('./../model/Roles.js')('en');
var RegistrationCode = require('./../model/RegistrationCode.js');
var ForgotPasswordCode = require('./../model/ForgotPasswordCode.js');
var Random = require('./../services/Random.js');
var express = require('express');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');
var bcrypt = require('bcrypt-nodejs');

var Translations = require('./../config/Translations.js');
var mailServices = require('./../services/mailServices.js');

var fs = require('fs');
var LOG_USER_MAIL_FILE_NAME = 'logs/user_mail_log.txt';

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
                    message: Translations[req.query.lang].userRoute.errorFetchingUserFromDb
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
                    message: Translations[req.query.lang].userRoute.errorFetchingUsersFromDb
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
                    message: Translations[req.query.lang].userRoute.errorFetchingDetails
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
            message: Translations[req.query.lang].userRoute.cantCreatePasswordsNotMatching,
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
                    message: Translations[req.query.lang].userRoute.cantCreateServerErrors
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
                        message: Translations[req.query.lang].userRoute.cantCreateFieldsAlreadyTaken,
                        errorFields: errorFields
                    }).end();
                }

                else {

                    User.find({}, {place: 1, points: 1}, function (err, userPlaces) {
                        if (err) {
                            res.status(500).json({
                                message: Translations[req.query.lang].userRoute.cantCreateServerErrors
                            }).end();
                        }
                        else {

                            //calculate place (number of users which have more points than zero + 1)
                            req.body.place = _.filter(userPlaces, function (user) {
                                return user.points > 0;
                            }).length + 1;

                            req.body.registerDate = new Date();
                            req.body.points = 0;
                            req.body.wonWeeks = 0;
                            req.body.avgPoints = 0;
                            req.body.role = Roles.user.name;
                            req.body.registrationIp = req.connection.remoteAddress;
                            req.body.serverSalt = bcrypt.genSaltSync();
                            req.body.active = false;
                            req.body.disabled = false;
                            req.body.isMailNotificationOn = true;

                            bcrypt.hash(req.body.password, req.body.serverSalt, null, function (err, hash) {
                                if (err) {
                                    res.status(500).json({
                                        message: Translations[req.query.lang].userRoute.cantCreateServerErrors
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
                message: Translations[req.query.lang].userRoute.accountCreatedButNotARegistrationCode
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
                        message: Translations[req.query.lang].userRoute.accountCreatedButNotARegistrationCode
                    });
                }
                else {

                    mailServices.sendConfirmationLinkOnRegistration(req.data.user, regCode.registrationCode,
                        function (info) {
                            // success
                        },
                        function (err) {
                            // error
                            fs.appendFile(LOG_USER_MAIL_FILE_NAME, "registration mail couldn't be delivered " + err + '\r\n');
                        });

                    req.data.user = req.data.user.toObject();
                    delete req.data.user['serverSalt'];
                    delete req.data.user['salt'];
                    delete req.data.user['registrationIp'];
                    delete req.data.user['password'];

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
                    message: Translations[req.query.lang].userRoute.registrationCodeCouldntBeProvided
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
                            message: Translations[req.query.lang].userRoute.registrationCodeCouldntBeProvided
                        }).end();
                    }
                    else {

                        mailServices.resendConfirmationLink(res.data.local.user, regCode.registrationCode,
                            function (info) {
                                // success
                            },
                            function (err) {
                                // error
                                fs.appendFile(LOG_USER_MAIL_FILE_NAME, "Registration code via mail failed" + err + '\r\n');
                            });

                        res.status(200).json({
                            message: Translations[req.query.lang].userRoute.emailWithActivationSent
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
                    message: Translations[req.query.lang].userRoute.userNotFound
                }).end();
            }
            else {
                for (var i in req.body) {
                    user[i] = req.body[i];
                }

                user.save(function (err) {
                    if (err) {
                        res.status(500).json({
                            message: Translations[req.query.lang].userRoute.userCouldntBeSavedToDb
                        }).end();
                    }
                    else {

                        delete user['password'];
                        delete user['salt'];
                        delete user['serverSalt'];
                        delete user['registrationIp'];

                        res.status(200).json(user).end();
                    }
                });

            }
        });

}
);

router.post('/user/forgotPassword',
function (req, res, next) {

    var usernameOrEmail = req.body.usernameOrEmail;

    User.findOne({$or: [
        {username: usernameOrEmail},
        {email: usernameOrEmail}
    ]}, function (err, user) {
        if (err) {
            res.status(500).json({
                message: Translations[req.query.lang].userRoute.errorFetchingDetails
            }).end();
        }
        else {
            if (!user) {
                res.status(404).json({
                    message: Translations[req.query.lang].userRoute.couldntFindAccountATForgotPw
                }).end();
            }
            else {

                ForgotPasswordCode.findOne({userId: user._id},
                    function (err, code) {


                        if (err) {
                            res.status(500).json({
                                message: Translations[req.query.lang].userRoute.resetCodeCouldntBeProvided
                            }).end();
                        }

                        else {

                            if (!code) {
                                code = new ForgotPasswordCode();
                            }
                            code.userId = user._id;
                            var now = new Date();
                            code.expirationDate = now.setHours(now.getHours() + 24 * 1);
                            code.forgotPasswordCode = Random.randomString();

                            code.save(function (err) {
                                if (err) {
                                    res.status(500).json({
                                        message: Translations[req.query.lang].userRoute.resetCodeCouldntBeProvided
                                    }).end();
                                }
                                else {

                                    mailServices.sendConfirmationLinkOnForgotPassword(user,
                                        code.forgotPasswordCode,
                                        function (info) {
                                            // success
                                        },
                                        function (err) {
                                            // error
                                            fs.appendFile(LOG_USER_MAIL_FILE_NAME, "Forgot password code via mail failed" + err + '\r\n');
                                        });

                                    res.status(200).json({
                                        message: Translations[req.query.lang].userRoute.emailContainingCodeSent
                                    }).end();

                                }
                            });

                        }
                    });

            }
        }
    });

});

router.post('/user/changePassword',
jwtauth([tokenChecks.hasRole('ROLE_USER')]),
function (req, res, next) {

    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var confirmPassword = req.body.confirmPassword;

    var user = res.data.local.user;

    if (newPassword != confirmPassword) {
        res.status(500).json({
            message: Translations[req.query.lang].userRoute.newPwAndconfirmPwNotMatching
        }).end();
    }

    bcrypt.hash(oldPassword, user.serverSalt, null, function (err, oldPwHash) {
        if (err) {
            res.status(500).json({
                message: Translations[req.query.lang].userRoute.couldntChangePw
            }).end();
        }
        else {

            if (oldPwHash != user.password) {
                res.status(500).json({
                    message: Translations[req.query.lang].userRoute.oldPwIsWrong
                }).end();
            }
            else {


                bcrypt.hash(newPassword, user.serverSalt, null, function (err, hash) {
                    if (err) {
                        res.status(500).json({
                            message: Translations[req.query.lang].userRoute.couldntChangePw
                        }).end();
                    }
                    else {

                        User.update({_id: user._id},
                            {$set: {active: false, password: hash}},
                            function (err) {
                                if (err) {
                                    res.status(500).json({
                                        message: Translations[req.query.lang].userRoute.couldntChangePw
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
                    message: Translations[req.query.lang].userRoute.newPwSavedErrorSendingMail
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
                            message: Translations[req.query.lang].userRoute.newPwSavedErrorSendingMail
                        });
                    }
                    else {

                        mailServices.sendConfirmationLinkOnPasswordChange(res.data.local.user,
                            regCode.registrationCode,

                            function (info) {
                                // success
                            },
                            function (err) {
                                // error
                                fs.appendFile(LOG_USER_MAIL_FILE_NAME, "change password mail couldn't be delivered" + err + '\r\n');
                            });

                        res.status(200).json({changed: "ok"}).end();

                    }
                });

            }
        });

}
);

router.post('/user/resetPassword',
function (req, res, next) {

    var receivedCode = req.body.code;

    ForgotPasswordCode.findOne({forgotPasswordCode: receivedCode},
    function (err, code) {
        if (err) {
            res.status(500).json({
                message: Translations[req.query.lang].userRoute.errorFetchingResetCode
            }).end();
        }
        else {

            if (!code) {
                res.status(500).json({
                    message: Translations[req.query.lang].userRoute.resetCodeCantBeFound
                }).end();
                return;
            }

            if (new Date(code.expirationDate) < new Date()) {
                res.status(500).json({
                    message: Translations[req.query.lang].userRoute.resetCodeExpired
                }).end();
            }
            else {

                req.body.userId = code.userId;

                next();

            }

        }
    });

},
function (req, res) {

    var newPassword = req.body.newPassword;
    var confirmPassword = req.body.confirmPassword;

    if (newPassword != confirmPassword) {
        res.status(500).json({
            message: Translations[req.query.lang].userRoute.newPwAndconfirmPwNotMatching
        }).end();
    }

    var userId = req.body.userId;

    User.findOne({_id: userId},
    function (err, user) {

        if (err || !user) {
            res.status(500).json({
                message: Translations[req.query.lang].userRoute.couldntChangePw
            }).end();
        }
        else {

            bcrypt.hash(newPassword, user.serverSalt, null, function (err, hash) {
                if (err) {
                    res.status(500).json({
                        message: Translations[req.query.lang].userRoute.couldntChangePw
                    }).end();
                }
                else {

                    User.update({_id: user._id},
                        {$set: {password: hash}},
                        function (err) {
                            if (err) {
                                res.status(500).json({
                                    message: Translations[req.query.lang].userRoute.couldntChangePw
                                }).end();
                            }
                            else {
                                res.status(200).json({ok: true}).end();
                            }
                        });

                }
            });

        }

    });
});

/*
 * Expects a registration code in body json.
 */
router.post('/user/activate',
jwtauth([function (req, res, next, user, onError, onSuccess) {

    RegistrationCode.findOne({userId: user._id},
    function (err, regCode) {
        if (err) {
            res.status(500).json({
                message: Translations[req.query.lang].userRoute.userCouldntBeActivated
            }).end();
            onError();
        }
        else {

            if (req.body.registrationCode != regCode.registrationCode) {
                res.status(500).json({
                    message: Translations[req.query.lang].userRoute.codeIsNotValid
                }).end();
                onError();
            }
            else {

                if (new Date(regCode.expirationDate) < new Date()) {
                    res.status(500).json({
                        message: Translations[req.query.lang].userRoute.activationCodeExpired
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
                message: Translations[req.query.lang].userRoute.userCouldntBeActivated
            }).end();
        }
        else {
            res.status(200).json(user).end();
            RegistrationCode.remove({registrationCode: req.body.registrationCode});
        }
    });
});

app.use('/api', router);
