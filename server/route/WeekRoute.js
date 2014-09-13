
// NOTE that app is defined globally

var Week = require('./../model/Week.js');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');

Week
.methods(['get', 'post', 'put', 'delete'])

.before('post', jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]))
.before('put', jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]))
.before('delete', jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]))

.route('last.get',
function (req, res, next) {

    Week.find({},
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

    }).sort({number: -1}).limit(1);

})

.route('beforeLast.get',
function (req, res, next) {

    Week.find({},
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

        }).sort({number: -1}).limit(2);

})

;

Week.register(app, '/api/week');
