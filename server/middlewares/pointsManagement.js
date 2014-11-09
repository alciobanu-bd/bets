
var Bet = require('./../model/Bet.js');
var User = require('./../model/User.js');
var mailServices = require('./../services/mailServices.js');
var _ = require('underscore');

var fs = require('fs');
var LOG_CONGRATS_MAIL_FILE_NAME = 'logs/congrats_log.txt';

var updatePointsForBetsOfThisWeek = function (req, res, next) {
    // calculate points for every bet of this week based on results

    if (req.body.events != undefined && _.every(req.body.events, function (event) {
            return event.hasOwnProperty('homeScore') && event.hasOwnProperty('awayScore')}
    )) {

        var weekId = req.params.id;

        Bet.find({weekId: weekId}, // find all bets of this week
            function (err, bets) {

                if (err) {
                    res.status(500).json({
                        message: "An error occurred when trying to update points for this week's bets."
                    }).end();
                }

                else {

                    var savedBets = 0;
                    var errorBets = 0;

                    req.bestBets = []; // calculate best bets and put them in this array
                    var maxPoints = -1;

                    for (var j = 0; j < bets.length; j++) {
                        // iterate over bets
                        var bet = bets[j];
                        var points = 0; // this is how many points a bet gets

                        for (var k = 0; k < bet.scores.length; k++) {
                            var score = bet.scores[k];

                            for (var i = 0; i < req.body.events.length; i++) {
                                var event = req.body.events[i];
                                // compare every score of the bet with every event

                                if (score.index == event.index) {

                                    score.homeScore = parseInt(score.homeScore);
                                    event.homeScore = parseInt(event.homeScore);
                                    score.awayScore = parseInt(score.awayScore);
                                    event.awayScore = parseInt(event.awayScore);

                                    var pointsPerEvent = 0;

                                    if (score.homeScore == event.homeScore && score.awayScore == event.awayScore) {
                                        // user guessed the correct score --> 3 points
                                        pointsPerEvent += 3;
                                    }
                                    else if (score.homeScore - score.awayScore == event.homeScore - event.awayScore) {
                                        // user guessed the correct difference --> 2 points
                                        pointsPerEvent += 2;
                                    }
                                    else if (((score.homeScore > score.awayScore) == (event.homeScore > event.awayScore)) &&
                                            (score.homeScore < score.awayScore) == (event.homeScore < event.awayScore)){
                                        // user guessed the correct team to win the match --> 1 point
                                        pointsPerEvent += 1;
                                    }

                                    points += pointsPerEvent;
                                    score.points = pointsPerEvent;

                                }

                            }

                        }

                        if (points >= maxPoints) {

                            if (points > maxPoints) {
                                req.bestBets = [];
                            }
                            req.bestBets.push(bet);

                            maxPoints = points;
                        }

                        // save points
                        bet.points = points;
                        bet.ended = true;

                        bet.markModified('scores');

                        bet.save(function (err) {

                            if (err) {
                                errorBets++;
                            }
                            else {
                                savedBets++;
                            }

                            if (savedBets == bets.length) {
                                // all bets saved successfully
                                next();
                            }
                            else if (savedBets + errorBets == bets.length) {
                                // some bets didn't save
                                res.status(500).json({
                                    message: "An error occurred when trying to update points for this week's bets."
                                }).end();
                            }

                        });
                    }

                    if (bets.length == 0) {
                        next();
                    }

                }
            });
    }

    else {
        res.status(500).json({
            message: "You didn't provide any results for the events."
        }).end();
    }
}

var calculateWinners = function (req, res, next) {

    Bet.aggregate([
        { $group: {
            _id: '$weekId',
            points: {$max: '$points'}
        }}
    ], function (err, bestPointsPerWeek) {

        if (err) {
            res.status(500).json({
                message: "Couldn't calculate winners. Please try again."
            }).end();
        }
        else {
            bestPointsPerWeek = _.filter(bestPointsPerWeek, function (bet) {
                return bet.points > 0;
            });

            bestPointsPerWeek = _.map(bestPointsPerWeek, function (bet) {
                return {
                    weekId: bet._id,
                    points: bet.points
                };
            });

            Bet.find({$or: bestPointsPerWeek}, function (err, winningBets) {

                if (err) {
                    res.status(500).json({
                        message: "Couldn't calculate winners. Please try again."
                    }).end();
                }
                else {

                    var groupedUsers = _.countBy(winningBets, function (bet) {
                        return bet.userId;
                    });

                    var winningUsers = _.map(winningBets, function (bet) {
                        return {
                            _id: bet.userId,
                            wonWeeks: groupedUsers[bet.userId]
                        };
                    });

                    var errs = 0;
                    var succs = 0;

                    for (var i = 0; i < winningUsers.length; i++) {
                        var user = winningUsers[i];
                        User.update({_id: user._id}, {$set: {wonWeeks: user.wonWeeks}}, {upsert: true},
                        function (err) {
                            if (err) {
                                errs++;
                            }
                            else {
                                succs++;
                            }

                            if (errs + succs == winningUsers.length) {
                                if (errs > 0) {
                                    res.status(500).json({
                                        message: "Couldn't calculate winners. Please try again."
                                    }).end();
                                }
                                else {
                                    next();
                                }
                            }
                        });
                    }

                }

            });
        }

    });

}

var sendCongratsToWinners = function (req, res, next) {

    var betSaveErr = 0;
    var betSaveSucc = 0;

    req.bestBets = _.filter(req.bestBets, function (bet) {
        return !bet.congratsSent && bet.points > 0;
    });

    if (req.bestBets.length == 0) {
        next();
        return;
    }

    var numberOfPoints = req.bestBets[0].points;
    var weekNumber = req.bestBets[0].weekNumber;

    var bestBetsUserIds = _.map(req.bestBets, function (bet) {
        return bet.userId;
    });

    var bestBetsIds = _.map(req.bestBets, function (bet) {
        return bet._id;
    });

    // send congrats if the bet isn't congrated
    User.find({_id: {$in: bestBetsUserIds}},
    function (err, users) {

        if (err) {
            res.status(500).json({
                message: "Couldn't send congratulations to winners. Please try again."
            }).end();
        }
        else {

            Bet.update({_id: {$in: bestBetsIds}}, {$set: {congratsSent: true}}, {multi: true},
                function (err) {

                    if (err) {
                        res.status(500).json({
                            message: "Couldn't send congratulations to winners. Please try again."
                        }).end();
                    }
                    else {

                        for (var i = 0; i < users.length; i++) {
                            var user = users[i];
                            var bet = {
                                points: numberOfPoints,
                                weekNumber: weekNumber
                            };
                            mailServices.sendCongratulationsToWeekWinners(bet, user.username, user.email,
                                function (info) {
                                    // on success
                                    fs.appendFile(LOG_CONGRATS_MAIL_FILE_NAME,
                                    new Date() +'delivered: ' + JSON.stringify(info) + '\r\n\r\n' +
                                    '--------------------------------------------------------------------------'
                                    + '--------------------------------------------------------------------------' +
                                    '\r\n\r\n');
                                }, function (err) {
                                    // on error
                                    fs.appendFile(LOG_CONGRATS_MAIL_FILE_NAME, new Date() + err + '\r\n');
                                });
                        }

                        next();

                    }

                });
        }

    });
}

var resetUsersPointsBeforeAggregating = function (req, res, next) {

    User.update({}, {$set: {points: 0, avgPoints: 0}}, function (err) {
        if (err) {
            res.status(500).json({
                message: "An error occurred while trying to update users' points."
            }).end();
        }
        else {
            next();
        }
    });
}

var updatePointsForUsers = function (req, res, next) {

    // update all users' points

    Bet.aggregate([
            { $group: {
                _id: '$userId',
                points: { $sum: '$points'},
                count: { $sum: { $cond: [ '$ended', { $size: '$scores' }, 0 ] } }
            }}
        ], function (err, aggregatedBets) {

            if (err) {
                res.status(500).json({
                    message: "An error occurred while trying to update users' points."
                }).end();
            }
            else {

                var savedUsers = 0;
                var errorUsers = 0;

                for (var i in aggregatedBets) {
                    var betsForAUser = aggregatedBets[i];

                    var avgPts;
                    if (betsForAUser.count != 0) {
                        avgPts = (betsForAUser.points * 100) / (betsForAUser.count * 3);
                    }
                    else {
                        avgPts = 0;
                    }

                    User.update({_id: betsForAUser._id},
                    {$set: {points: betsForAUser.points, avgPoints: avgPts}},
                    function (err) {

                        if (err) {
                            errorUsers++;
                        }
                        else {
                            savedUsers++;
                        }

                        if (savedUsers == aggregatedBets.length) {
                            next();
                        }
                        else if (savedUsers + errorUsers == aggregatedBets.length) {
                            res.status(500).json({
                                message: "An error occurred while trying to update users' points."
                            }).end();
                        }

                    });

                }

                if (aggregatedBets.length == 0) {
                    next();
                }

            }
        }

    );
}

var updateUsersPlace = function (req, res, next) {

    User.find({}, // find all users
    function (err, users) {

        if (err) {
            res.status(500).json({
                message: "An error occurred while trying to update users' place."
            }).end();
        }

        else {

            var savedUsers = 0;
            var errorUsers = 0;

            for (var i in users) {
                var user = users[i];
                var partitionedPoints = _.partition(users, function (item) {
                    return user.points < item.points;
                }); // in the first array, we will have all users with more points than current user
                user.place = partitionedPoints[0].length + 1; // so we easily set the place

                user.save(function (err) {
                    if (err) {
                        errorUsers++;
                    }
                    else {
                        savedUsers++;
                    }
                    if (savedUsers == users.length) {
                        res.status(200).json({
                            message: "Points and places were update for every user."
                        }).end();
                    }
                    else if (savedUsers + errorUsers == users.length) {
                        res.status(500).json({
                            message: "An error occurred while trying to update users' place."
                        }).end();
                    }
                });

            }

            if (users.length == 0) {
                res.status(200).json({
                    message: "Points and places were updated for every user."
                }).end();
            }

        }

    });
}

module.exports = {
    updatePointsForBetsOfThisWeek: updatePointsForBetsOfThisWeek,
    sendCongratsToWinners: sendCongratsToWinners,
    calculateWinners: calculateWinners,
    resetUsersPointsBeforeAggregating: resetUsersPointsBeforeAggregating,
    updatePointsForUsers: updatePointsForUsers,
    updateUsersPlace: updateUsersPlace
};
