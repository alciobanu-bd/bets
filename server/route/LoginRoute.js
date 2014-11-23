
// NOTE that app is defined globally

var User = require('./../model/User.js');
var ForgotPasswordCode = require('./../model/ForgotPasswordCode.js');
var jwt = require('jwt-simple');
var express = require('express');
var moment = require('moment');
var bcrypt = require('bcrypt-nodejs');

var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');

var Translations = require('./../config/Translations.js');

var fs = require('fs');
var LOG_EXTEND_TOK_FILE_NAME = 'logs/extend_tok_log.txt';
var LOG_LOGIN_FILE_NAME = 'logs/login_log.txt';

var router = express.Router();

var markLastLogin = function (userId) {

    User.update({_id: userId}, {$set: {lastLogin: new Date()}}, {upsert: true},
    function (err) {
        if (err) {
            fs.append(LOG_LOGIN_FILE_NAME, 'lastLogin update failed for user ' + userId + ' -- ' + err + '\r\n');
        }
    });

}

// login
var getToken = function (userId, expireTime) {
    var expires = moment().add(expireTime[0], expireTime[1]).valueOf();
    var token = jwt.encode({
        iss: userId,
        exp: expires
    }, app.get('jwtTokenSecret'));

    markLastLogin(userId);

    return {token: token, expires: expires};
}

router.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    User
    .find
    ({username: req.body.username},
    {salt: 0}, // exclude salt
    function (err, users) {
        if (err || users.length == 0) {
            res.status(401).json({message: Translations[req.query.lang].login.usernameDoesntExist}).end();
        }
        else if (users.length > 1) {
            res.status(500).json({
                    message: Translations[req.query.lang].login.moreThanOneUser + req.body.username + "."}
            ).end();
        }
        else if (users[0].disabled) {
            res.status(401).json({
                message: Translations[req.query.lang].login.accountDisabled
            }).end();
        }
        else {

            bcrypt.hash(password, users[0].serverSalt, null, function(err, hash) {
                if (err) {
                    res.status(500).json({
                        message: Translations[req.query.lang].login.serverErrors
                    }).end();
                }
                else {
                    if (hash == users[0].password) {
                        // user logged in successfully

                        var tok;

                        if (req.body.keepMeLoggedIn && req.body.keepMeLoggedFor) {
                            tok = getToken(users[0]._id, [req.body.keepMeLoggedFor, 'days']);
                        }
                        else {
                            tok = getToken(users[0]._id, [4, 'hours']);
                        }

                        users[0] = users[0].toObject();
                        delete users[0]['password'];
                        delete users[0]['salt'];
                        delete users[0]['serverSalt'];
                        delete users[0]['registrationIp'];

                        res.status(200).json({
                            token : tok.token,
                            expires: tok.expires,
                            user: users[0]
                        }).end();

                        fs.appendFile(LOG_LOGIN_FILE_NAME, new Date() + ", " + users[0].username + " logged in. " + '\r\n');

                    }

                    else {
                        res.status(400).json({
                            message: Translations[req.query.lang].login.invalidCredentials
                        }).end();
                    }
                }
            });
        }
    });

});

router.post('/extend_expiration_token',
jwtauth([tokenChecks.hasRole('ROLE_USER')], {skipActivationCheck: true}),
function (req, res, next) {
    // if the user hits this middleware, it means his/her token is active
    // so the token expiration can be changed

    var user = res.data.local.user;
    var tok;

    if (req.body.days) {
        tok = getToken(user._id, [req.body.days, 'days']);
    }
    else {
        tok = getToken(user._id, [4, 'hours']);
    }

    user = user.toObject();
    delete user['password'];
    delete user['serverSalt'];
    delete user['salt'];
    delete user['registrationIp'];

    fs.appendFile(LOG_EXTEND_TOK_FILE_NAME,
        new Date() + "extended token for user: " + user.username + " (expires: " + new Date(tok.expires) + ")" + '\r\n');

    res.status(200).json({
        token : tok.token,
        expires: tok.expires,
        user: user
    }).end();

}
);

router.post('/salt', function (req, res) {
    User.find({username: req.body.username}, function (err, users) {
        if (err || users.length == 0) {
            res.status(404).json({message: Translations[req.query.lang].login.usernameDoesntExist}).end();
        }
        else if (users.length > 1) {
            res.status(500).json({
                message: Translations[req.query.lang].login.moreThanOneUser + req.body.username + "."}
            ).end();
        }
        else {
            res.status(200).json({salt: users[0].salt}).end();
        }
    });
});

router.post('/reset-salt',
function (req, res) {

    var receivedCode = req.body.code;

    ForgotPasswordCode.findOne({forgotPasswordCode: receivedCode},
    function (err, code) {
        if (err) {
            res.status(500).json({
                message: Translations[req.query.lang].login.errorFetchingResetCode
            }).end();
        }
        else {

            if (!code) {
                res.status(404).json({
                    message: Translations[req.query.lang].login.resetCodeNoUser
                }).end();
                return;
            }

            User.findOne({_id: code.userId}, function (err, user) {
                if (err || !user) {
                    res.status(404).json({message: Translations[req.query.lang].login.resetCodeNoUser}).end();
                }
                else {
                    res.status(200).json({salt: user.salt}).end();
                }
            });

        }
    });

});

app.use('/api/auth', router);
