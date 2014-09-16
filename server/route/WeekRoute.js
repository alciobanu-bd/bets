
// NOTE that app is defined globally

var Week = require('./../model/Week.js');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');

Week
.methods(['get', 'post', 'put', 'delete'])

.before('post',
function (req, res, next) {

    req.body.locked = false;
    req.body.ended = false;
    next();

})

.before('post', jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]))
.before('put', jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]))
.before('delete', jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]))

.route('last.get',
function (req, res, next) {

    Week.find({}, {},
    {sort: {number: -1}, limit: 1},
    function (err, weeks) {

        if (err) {
            res.status(500).json({
                message: "Error fetching current week."
            }).end();
        }

        else {
            if (weeks.length > 0) {
                res.status(200).json(weeks[0]).end();
            }
            else {
                res.status(200).json({number: 0}).end();
            }
        }

    });

})

.route('beforeLast.get',
function (req, res, next) {

    Week.find({}, {},
        {sort: {number: -1}, limit: 2},
        function (err, weeks) {

            if (err) {
                res.status(500).json({
                    message: "Error fetching current week."
                }).end();
            }

            else {
                if (weeks.length > 1) {
                    res.status(200).json(weeks[1]).end();
                }
                else {
                    res.status(200).json({number: 0}).end();
                }
            }

        });

})

;

Week.register(app, '/api/week');
