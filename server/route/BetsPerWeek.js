
// NOTE that app is defined globally

var Week = require('./../model/Week.js');
var Bet = require('./../model/Bet.js');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');

var Translations = require('./../config/Translations.js');

var express = require('express');
var router = express.Router();

router.get('/getBetByWeek',
jwtauth([
    function (req, res, next, user, onError, onSuccess) {
        if (!req.query.weekNumber) {
            res.status(500).json({
                message: Translations[req.query.lang].betsPerWeek.noWeekNumber
            }).end();
            onError();
        }
        else {
            onSuccess();
        }
    },
    tokenChecks.hasRole('ROLE_USER')])
,
function(req, res) {

    var user = res.data.local.user;

    Bet.findOne({userId: user._id, weekNumber: req.query.weekNumber}, function (err, bet) {

        if (err) {
            res.status(500).json({
                message: Translations[req.query.lang].betsPerWeek.errorFetchingLastBets
            }).end();
        }

        else if (!bet) {
            res.status(500).json({
                message: Translations[req.query.lang].betsPerWeek.didntPlaceABet
            }).end();
        }

        else {

            res.status(200).json(bet).end();

        }


    });

});

app.use('/api/bets', router);

