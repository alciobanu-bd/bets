
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

    Bet.find({userId: res.data.local.user._id},
    function (err, bets) {

        if (err) {
            res.status(500).json({
                message: "Cannot fetch bet history from database."
            }).end();
        }
        else {

            Week.find({}, {},
            {sort: {number: -1}},
            function (err, weeks) {
                if (err) {
                    res.status(500).json({
                        message: "Cannot fetch bet history from database."
                    }).end();
                }
                else {

                    var history = [];

                    for (var i in weeks) {
                        var week = weeks[i];
                        var bet = _.find(bets, function (item) {
                            return item.weekNumber == week.number;
                        });
                        if (!bet) {
                            // user didn't place a bet this week
                            bet = {
                                placed: false,
                                scores: [],
                                points: 0
                            };
                        }
                        else {
                            bet.placed = true;
                        }
                        var historyItem = {
                            weekNumber: week.number,
                            points: bet.points,
                            placed: bet.placed,
//                            betEnded: bet.ended,
//                            weekEnded: week.ended,
                            requiredEvents: week.required,
                            weekEndDate: week.endDate,
                            betScores: bet.scores,
                            weekEvents: week.events,
                            available: new Date(week.endDate) > new Date()
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
