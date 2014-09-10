
var User = require('./../model/User.js');
var jwt = require('jwt-simple');

var checkToken = function(req, res, next) {

    var token = req.headers['x-access-token'];

    if (token) {
        try {
            var decoded = jwt.decode(token, app.get('jwtTokenSecret'));

            if (decoded.exp <= Date.now()) {
                res.status(401).json({
                    message: "Your token expired. Please log in again."
                });
            }
            else {
                // get the user
                User.findOne({ _id: decoded.iss }, function(err, user) {
                    if (err) {
                        res.status(401).json({
                            message: "An error has ocured. We couldn't verify your identity."
                        });
                    }
                    else {
                        if (user.role) {

                        }
                    }
                });
            }

        } catch (err) {
            res.status(401).json({
                message: "Your token expired. Please log in again."
            });
        }
    } else {
        res.status(401).json({
            message: "You didn't send an authorization token."
        });
    }

};

module.exports = {
    user: checkToken
};
