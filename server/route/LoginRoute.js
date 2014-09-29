
// NOTE that app is defined globally

var User = require('./../model/User.js');
var jwt = require('jwt-simple');
var express = require('express');
var moment = require('moment');
var bcrypt = require('bcrypt-nodejs');

var router = express.Router();

// login
var getToken = function (userId) {
    var expires = moment().add(7, 'days').valueOf();
    var token = jwt.encode({
        iss: userId,
        exp: expires
    }, app.get('jwtTokenSecret'));
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
            res.status(401).json({message: "Username doesn't exist."}.end());
        }
        else if (users.length > 1) {
            res.status(500).json({
                    message: "More than one user found with the username " + req.body.username + "."}
            ).end();
        }
        else if (users[0].disabled) {
            res.status(401).json({
                message: "Login failed. Your account is disabled."
            }).end();
        }
        else {

            bcrypt.hash(password, users[0].serverSalt, null, function(err, hash) {
                if (err) {
                    res.status(500).json({
                        message: "Login failed. Server encountered some errors."
                    }).end();
                }
                else {
                    if (hash == users[0].password) {
                        // user logged in successfully

                        var tok = getToken(users[0].id);

                        users[0] = users[0].toObject();
                        delete users[0]['password'];
                        delete users[0]['serverSalt'];
                        delete users[0]['registrationIp'];

                        res.status(200).json({
                            token : tok.token,
                            expires: tok.expires,
                            user: users[0]
                        }).end();
                    }

                    else {
                        res.status(400).json({
                            message: 'Login failed. Credentials you provided are invalid.'
                        }).end();
                    }
                }
            });
        }
    });

});

router.post('/salt', function (req, res) {
    User.find({username: req.body.username}, function (err, users) {
        if (err || users.length == 0) {
            res.status(404).json({message: "Username doesn't exist."}).end();
        }
        else if (users.length > 1) {
            res.status(500).json({
                message: "More than one user found with the username " + req.body.username + "."}
            ).end();
        }
        else {
            res.status(200).json({salt: users[0].salt}).end();
        }
    });
});

app.use('/api/auth', router);
