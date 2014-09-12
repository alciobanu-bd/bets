
// NOTE that app is defined globally

var User = require('./../model/User.js');
var Roles = require('./../model/Roles.js');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');

var _ = require('underscore');

User
    .methods(['get', 'post', 'put', 'delete'])
    .before('post', function (req, res, next) {

        if (req.body.password != req.body.confirmPassword) {
            var errorFields = {password: true, confirmPassword: true};
            res.status(500).json({
                message: "Account couldn't be created. Passwords are not matching.",
                errorFields: errorFields
            }).end();
        }

        else {

            User.find({$or: [{username: req.body.username}, {email: req.body.email}]}, function (err, foundUsers) {

                if (err) {
                    res.status(500).json({
                        message: "Account couldn't be created due to server errors."
                    });
                    res.end();
                }
                else {

                    if (foundUsers.length > 0) {

                        var errorFields = {username: false, email:false};

                        for (var i in foundUsers) {
                            var fUser = foundUsers[i];
                            errorFields.username = fUser.username == req.body.username;
                            errorFields.email = fUser.email == req.body.email;
                        }

                        res.status(409).json({
                            message: "Account couldn't be created. Some fields are already taken.",
                            errorFields: errorFields
                        }).end();
                    }

                    else {
                        // be sure these fields are saved

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
                                req.body.role = Roles.user.name;
                                req.body.registrationIp = req.connection.remoteAddress;
                                next();
                            }
                        });
                    }

                }
            });
        }

    })
    // only admins are permitted to see all existing users, gets on a specific user are permitted for all users
//    .before('get', jwtauth([tokenChecks.hasRoleWithoutId('ROLE_ADMIN'), tokenChecks.hasRoleWithId('ROLE_USER')]))
    .before('get')
    .before('put', jwtauth([tokenChecks.hasSameIdOrHasRole('ROLE_ADMIN')]))
    .before('delete', jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]))
    .route('rm-rf.delete', /*jwtauth([tokenChecks.hasRole('ROLE_SUPERUSER')]),*/ {
        handler: function(req, res, next) {
            User.remove({}, function(err) {
                if (err) {
                    res.statusCode = 400;
                    res.json({
                        message: "An error has occured."
                    }).end();
                }
                else{
                    res.json({
                        message: "Success."
                    }).end();
                    console.log('User collection removed');
                }
            });
        }
    });

User.register(app, '/api/user');
