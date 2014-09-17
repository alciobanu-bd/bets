
// NOTE that app is defined globally

var Bet = require('./../model/Bet.js');
var BetStatus = require('./../model/BetStatus.js');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');
var weekChecks = require('./../middlewares/weekChecksForBets.js');

var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var setUserId = function(req, res, next, user) {
    // set userId
    req.body.userId = user._id;
}

Bet
.methods(['get', 'post', 'put', 'delete'])

.before('post', weekChecks.weekMiddleware([weekChecks.callbacks.checkIfWeekEnded, weekChecks.callbacks.checkIfCorrectNumberOfMatches]))
.before('put', weekChecks.weekMiddleware([weekChecks.callbacks.checkIfWeekEnded, weekChecks.callbacks.checkIfCorrectNumberOfMatches]))

.before('post',
function(req, res, next) {

    req.body.points = 0;
    req.body.ended = false;
    req.body.status = BetStatus.active;

    next();

})

.before('get', jwtauth([tokenChecks.hasRoleWithId('ROLE_USER'), tokenChecks.hasRoleWithoutId('ROLE_ADMIN')]))
.before('post', jwtauth([tokenChecks.hasRole('ROLE_USER'), setUserId]))
.before('put', jwtauth([tokenChecks.hasRole('ROLE_USER'), setUserId]))
.before('delete', jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]))

/*
Expects a query parameter named weekNumber
 */
.route('getBetByWeek.get',  function (req, res, next) {
        console.log("here")
        res.status(200).json({message: "123"}).end();
    })

;

Bet.register(app, '/api/bet');

/*
jwtauth([tokenChecks.hasRole('ROLE_USER'),
    function (req, res, next, user) {

        if (!req.query.weekNumber) {
            res.status(500).json({
                message: 'No week number to look for.'
            }).end();
        }

        else {
            Bet.findOne({username: user.username, weekNumber: req.query.weekNumber}, function (err, bet) {

                if (err || !bet) {
                    res.status(500).json({
                        message: 'An error occured while fetching your last bets.'
                    }).end();
                }

                else {
                    res.status(200).json(bet).end();
                }

            });
        }

    }
]),
*/