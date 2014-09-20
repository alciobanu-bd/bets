
var Bet = require('./../model/Bet.js');
var User = require('./../model/User.js');
var _ = require('underscore');

var updatePointsForBets = function (req, res, next) {
    // calculate points for every bet of this week based on results

    if (req.body.events && _.every(req.body.events, function (event) {
            return event.hasOwnProperty('homeScore') && event.hasOwnProperty('awayScore')}
    )) {

        var weekId = req.param("id");

        Bet.find({weekId: weekId}, // find all bets of this week
            function (err, bets) {

                if (err) {
                    res.status(500).json({
                        message: "An error occured when trying to update points for this week's bets."
                    });
                }

                else {

                    var savedBets = 0;
                    var errorBets = 0;

                    for (var j in bets) {
                        // iterate over bets
                        var bet = bets[j];
                        var points = 0; // this is how many points a bet gets

                        for (var k in bet.scores) {
                            var score = bet.scores[k];

                            for (var i in req.body.events) {
                                var event = req.body.events[i];
                                // compare every score of the bet with every event

                                if (score.index == event.index) {

                                    if (score.homeScore == event.homeScore && score.awayScore == event.awayScore) {
                                        // user guessed the correct score --> 3 points
                                        points += 3;
                                    }
                                    else if (score.homeScore - score.awayScore == event.homeScore - event.awayScore) {
                                        // user guessed the correct difference --> 2 points
                                        points += 2;
                                    }
                                    else if (((score.homeScore > score.awayScore) == (event.homeScore > event.awayScore)) &&
                                            (score.homeScore < score.awayScore) == (event.homeScore < event.awayScore)){
                                        // user guessed the correct team to win the match --> 1 point
                                        points += 1;
                                    }

                                }

                            }

                        }

                        // save points
                        bet.points = points;
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
                                    message: "An error occured when trying to update points for this week's bets."
                                });
                            }

                        });
                    }
                }
            });
    }
}

var updatePointsForUsers = function (req,res, next) {

    // update all users' points

    Bet.aggregate([
            { $group: {
                _id: '$userId',
                points: { $sum: '$points'}
            }}
        ], function (err, aggregatedBets) {

            if (err) {
                res.status(500).json({
                    message: "An error occured while trying to update users' points."
                });
            }
            else {

                var savedUsers = 0;

                for (var i in aggregatedBets) {
                    var betsForAUser = aggregatedBets[i];

                    User.findOne({_id: betsForAUser._id},
                        function (err, user) {

                            if (err) {
                                res.status(500).json({
                                    message: "An error occured while trying to update users' points."
                                });
                            }

                            else {
                                if (user) {

                                    user.points = betsForAUser.points;
                                    user.save(function (err) {

                                        if (err) {
                                            res.status(500).json({
                                                message: "An error occured while trying to update users' points."
                                            });
                                        }

                                        else {
                                            savedUsers++;
                                        }

                                        if (savedUsers == aggregatedBets.length) {
                                            next();
                                        }

                                    });

                                }
                                else {
                                    res.status(500).json({
                                        message: "An error occured while trying to update users' points."
                                    });
                                }
                            }

                        });

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
                message: "An error occured while trying to update users' place."
            });
        }

        else {

            var savedUsers = 0;

            for (var i in users) {
                var user = users[i];
                var partitionedPoints = _.partition(users, function (item) {
                    return user.points < item.points;
                }); // in the first array, we will have all users with more points than current user
                user.place = partitionedPoints[0].length + 1; // so we easily set the place

                user.save(function (err) {
                    if (err) {
                        res.status(500).json({
                            message: "An error occured while trying to update users' place."
                        });
                    }
                    else {
                        savedUsers++;
                    }
                    if (savedUsers == users.length) {
                        next();
                    }
                });

            }

            next();

        }

    });
}

module.exports = {
    updatePointsForBets: updatePointsForBets,
    updatePointsForUsers: updatePointsForUsers,
    updateUsersPlace: updateUsersPlace
};
