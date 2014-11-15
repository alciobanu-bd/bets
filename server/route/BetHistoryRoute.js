
var express = require('express');
var Bet = require('./../model/Bet.js');
var User = require('./../model/User.js');
var Roles = require('./../model/Roles.js');
var Week = require('./../model/Week.js');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');

var _ = require('underscore');

var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

router.get('/history/:id([0-9a-fA-F]{24})?',
jwtauth([tokenChecks.hasRole('ROLE_USER')]),
function (req, res, next) {

    var userId;

    if (req.params.id) {
        userId = req.params.id;
    }
    else {
        userId = res.data.local.user._id;
    }

    Bet.find({userId: userId},
    function (err, bets) {

        if (err) {
            res.status(500).json({
                message: "Cannot fetch bet history from database."
            }).end();
        }
        else {

            var queryDateObject = {hidden: false};
            if (userId.toString() != res.data.local.user._id.toString() && Roles.roleValue(res.data.local.user.role) < Roles.admin.value) {
                queryDateObject = {endDate: {$lt: new Date()}};
            }

            Week.find(queryDateObject, {},
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
                                points: 0,
                                weekNumber: week.number
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
                            competition: week.competition,
                            available: new Date(week.endDate) > new Date()
                        };

                        history.push(historyItem);
                    }

                    User.findOne({_id: userId},
                        {password: 0, salt: 0, serverSalt: 0, registrationIp: 0, isMailNotificationOn: 0},
                        function (err, user) {
                        if (err) {
                            res.status(500).json({
                                message: "Cannot fetch bet history from database."
                            }).end();
                        }
                        else {
                            res.status(200).json({
                                history: history,
                                user: user
                            }).end();
                        }
                    });

                }
            });

        }
    });
});

router.get('/history/getByWeek/:id([0-9a-fA-F]{24})',
jwtauth([tokenChecks.hasRole('ROLE_USER')]),
function (req, res, next) {
    // page is indexed from 0 -- zero is the first page

    var pageSize = 4;

    var weekNumber = req.params.id;
    var page = req.query.page;

    Week.findOne({_id: weekNumber},
    function (err, week) {

        if (err || !week) {
            res.status(500).json({
                message: "Couldn't find week information."
            }).end();
        }

        else {

            if (new Date() < new Date(week.endDate) && Roles.roleValue(res.data.local.user.role) < Roles.admin.value) {
                res.status(500).json({
                    message: "Week hasn't ended yet. You cannot see the history."
                }).end();
            }
            else {

                Bet.count({weekNumber: week.number},
                function (err, count) {
                    if (err) {
                        res.status(500).json({
                            message: "History couldn't be fetched."
                        }).end();
                    }
                    else {
                        Bet.find({weekNumber: week.number},
                            {congratsSent: 0, __v: 0},
                            {sort: {points: -1, username: 1}, skip: pageSize * page, limit: pageSize},
                            function (err, bets) {
                                if (err) {
                                    res.status(500).json({
                                        message: "History couldn't be fetched."
                                    }).end();
                                }
                                else {
                                    res.status(200).json({
                                        bets: bets,
                                        count: count,
                                        numberOfPages: Math.ceil(count / pageSize),
                                        itemsPerPage: pageSize
                                    }).end();
                                }
                            });
                    }
                });
            }

        }

    });

});

app.use('/api/bet', router);
