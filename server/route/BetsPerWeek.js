
// NOTE that app is defined globally

var Week = require('./../model/Week.js');
var Bet = require('./../model/Bet.js');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');

var express = require('express');

var router = express.Router();

router.get('/getBetByWeek',
jwtauth([
    function (req, res, next, user, onError) {
        if (!req.query.weekNumber) {
            res.status(500).json({
                message: 'No week number to look for.'
            }).end();
            onError();
        }
    },
    tokenChecks.hasRole('ROLE_USER')])
,
function(req, res) {

    var user = res.data.local.user;

    Bet.findOne({userId: user._id, weekNumber: req.query.weekNumber}, function (err, bet) {

        if (err) {
            res.status(500).json({
                message: 'An error occurred while fetching your last bets.'
            }).end();
        }

        else if (!bet) {
            res.status(500).json({
                message: 'You didn\'t place a bet this week.'
            }).end();
        }

        else {

            res.status(200).json(bet).end();

        }


    });

});

app.use('/api/bets', router);

