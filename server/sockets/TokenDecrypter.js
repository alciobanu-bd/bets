
var jwt = require('jwt-simple');
var User = require('./../model/User.js');

var decrypt = function (token, callback) {

    if (token) {
        try {
            var decoded = jwt.decode(token, app.get('jwtTokenSecret'));

            if (decoded.exp <= new Date()) {
                callback("Token expired.", null);
            }
            else {
                // get the user
                User.findOne({ _id: decoded.iss }, function(err, user) {

                    if (err) {
                        callback(err, null);
                    }
                    else {

                        if (user) {
                            callback(null, user);
                        }
                        else {
                            callback("No user found.", null);
                        }

                    }
                });
            }

        } catch (err) {
            callback(err, null);
        }
    } else {
        callback("No token could be found.", null);
    }
}

module.exports = {
    decrypt: decrypt
};
