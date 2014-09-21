
var express = require('express');
var Bet = require('./../model/Bet.js');
var Week = require('./../model/Week.js');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');

var _ = require('underscore');

var router = express.Router();

router.get('/history',
jwtauth([tokenChecks.hasRole('ROLE_USER')]),
function (req, res, next) {

    Bet.find({userId: res.data.local.user._id}, {},
    {sort: {weekNumber: -1}},
    function (err, bets) {

        if (err) {
            res.status(500).json({
                message: "Cannot fetch bet history from database."
            }).end();
        }
        else {

            Week.find({}, function (err, weeks) {
                if (err) {
                    res.status(500).json({
                        message: "Cannot fetch bet history from database."
                    }).end();
                }
                else {

                    var history = [];

                    for (var i in bets) {
                        var bet = bets[i];
                        var week = _.find(weeks, function (item) {
                            return item.number == bet.weekNumber;
                        });
                        var historyItem = {
                            weekNumber: week.number,
                            points: bet.points,
                            betEnded: bet.ended,
                            weekEnded: week.ended,
                            requiredEvents: week.required,
                            weekEndDate: week.endDate,
                            betScores: bet.scores,
                            weekEvents: week.events
                        };

                        history.push(historyItem);
                    }

                    res.status(200).json(history).end();

                }
            });

        }

    });

});

app.use('/api/bet', router);
