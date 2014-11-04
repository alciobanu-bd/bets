
// NOTE that app is defined globally

var express = require('express');
var Week = require('./../model/Week.js');
var User = require('./../model/User.js');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');
var pointsManagementFunctions = require('./../middlewares/pointsManagement.js');
var mailServices = require('./../services/mailServices.js');
var _ = require('underscore');

var fs = require('fs');
var LOG_WEEK_MAIL_FILE_NAME = 'logs/user_mail_log.txt';

var router = express.Router();

router.get('/week/:id([0-9a-fA-F]{24})',
function (req, res, next) {

    Week.findOne({_id: req.params.id},
    function (err, week) {
        if (err) {
            res.status(500).json({
                message: "Error fetching week from database."
            }).end();
        }
        else {
            res.status(200).json(week).end();
        }
    });

});

router.get('/week',
function (req, res, next) {

    Week.find({},
    function (err, weeks) {
        if (err) {
            res.status(500).json({
                message: "Error fetching weeks from database."
            }).end();
        }
        else {
            res.status(200).json(weeks).end();
        }
    });

});

router.get('/week/last',
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
                    weeks[0] = weeks[0].toObject();
                    if (new Date(weeks[0].endDate) > new Date()) {
                        weeks[0].available = true;
                    }
                    else {
                        weeks[0].available = false;
                    }
                    res.status(200).json(weeks[0]).end();
                }
                else {
                    res.status(200).json({number: 0}).end();
                }
            }

        });

});

router.get('/week/mail-notification',
jwtauth([tokenChecks.hasRole("ROLE_ADMIN")]),
function (req, res) {

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
                weeks[0] = weeks[0].toObject();
                if (new Date(weeks[0].endDate) < new Date()) {
                    res.status(500).json({
                        message: "Week is not available anymore."
                    }).end();
                }
                else {

                    User.find({}, function (err, users) {
                        if (err) {
                            res.status(500).json({
                                message: "Error fetching users."
                            }).end();
                        }
                        else {

                            if (weeks[0].mailNotificationSent) {
                                // an e-mail was already sent on this week
                                res.status(500).json({
                                    message: "An e-mail notification was already sent for this week."
                                }).end();
                                return;
                            }

                            var doneUpdate = false;

                            for (var i = 0; i < users.length; i++) {

                                var user = users[i];

                                if (!user.isMailNotificationOn) {
                                    continue;
                                }

                                mailServices.sendNotificationAboutNewWeek (
                                    weeks[0], user.username, user.email, function () {
                                    // on success

                                    // if a single user receives the message,
                                    // the week notification is considered sent for current week

                                        if (!doneUpdate) {
                                            Week.update({_id: weeks[0]._id}, {$set: {mailNotificationSent: true}},
                                            function (err) {
                                                // nothing
                                            });
                                            doneUpdate = true;
                                        }

                                }, function (error) {
                                    // on error

                                    fs.appendFile(LOG_WEEK_MAIL_FILE_NAME, err + '\r\n');

                                });
                            }

                            res.status(200).json({
                                message: "Mails were queued and are about to be sent."
                            }).end();

                        }
                    });
                }
            }
            else {
                res.status(200).json({number: 0}).end();
            }
        }

    });
});

router.post('/week',
jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]),
function (req, res, next) {

    var week = new Week();

    week.locked = false;
    week.ended = false;
    week.mailNotificationSent = false;

    var eventWithMinTime = _.min(req.body.events, function (event) {
        return new Date(event.startDate).getTime();
    });

    var endDate = new Date(eventWithMinTime.startDate);
    week.endDate = endDate.setHours(endDate.getHours() - 1);


    for (var i in req.body) {
        week[i] = req.body[i];
    }

    week.save(function (err) {
        if (err) {
            res.status(500).json({
                message: "Week wasn't saved to database."
            }).end();
        }
        else {
            res.status(201).json(week).end();
        }
    });

});

router.put('/week/update/:id([0-9a-fA-F]{24})',
jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]),
function (req, res, next) {

    if (req.body.events.length < 1) {
        res.status(500).json({
            message: "There are no events in this week."
        }).end();
        return;
    }

    if (req.body.endDate) {
        delete req.body.endDate;
    }

    var week = {};

    var eventWithMinTime = _.min(req.body.events, function (event) {
        return new Date(event.startDate).getTime();
    });

    var endDate = new Date(eventWithMinTime.startDate);
    week.endDate = endDate.setHours(endDate.getHours() - 1);

    for (var i in req.body) {
        week[i] = req.body[i];
    }

    Week.update({_id: req.params.id}, {$set: week}, function (err) {
        if (err) {
            res.status(500).json({
                message: "Week wasn't saved to database."
            }).end();
        }
        else {
            res.status(200).json(week).end();
        }
    });

});

router.get('/week/beforeLast',
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
                    weeks[1] = weeks[1].toObject();
                    if (new Date(weeks[1].endDate) > new Date()) {
                        weeks[1].available = true;
                    }
                    else {
                        weeks[1].available = false;
                    }
                    res.status(200).json(weeks[1]).end();
                }
                else {
                    res.status(200).json({number: 0}).end();
                }
            }

        });

})

/**
 * Weeknumber given as url query param (@number)
 */
router.get('/week/getByNumber',
function (req, res, next) {

    Week.findOne(
        {number: req.query.number},
        function (err, week) {

            if (err) {
                res.status(500).json({
                    message: "Error fetching week with number +"
                        + req.query.number +
                        "."
                }).end();
            }

            else {

                if (week) {
                    week = week.toObject();
                    if (new Date(week.endDate) > new Date()) {
                        week.available = true;
                    }
                    else {
                        week.available = false;
                    }
                    res.status(200).json(week).end();
                }

                else {
                    res.status(200).json({number: 0}).end();
                }

            }

        });

})

router.put('/week/:id([0-9a-fA-F]{24})',
jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]),

function(req, res, next) {

    Week.findOne({_id: req.params.id},
    function (err, week) {
        if (err || !week) {
            res.status(500).json({
                message: "Week information wasn't saved. There was an error with the database."
            }).end();
        }
        else {
            for (var i in req.body) {
                week[i] = req.body[i];
            }

            if (req.body.updateScore) {
                week.ended = true;
            }

            week.save(function (err) {
                if (err) {
                    res.status(500).json({
                        message: "Week information wasn't saved. There was an error with the database."
                    }).end();
                }
                else {

                    if (req.body.updateScore) {
                        res.localData = {
                            week: week
                        }; // this will be used by the last middleware of this route as response
                        next();
                    }
                    else {
                        res.status(200).json(week).end();
                    }
                }
            });

        }
    });

},

pointsManagementFunctions.updatePointsForBetsOfThisWeek,
pointsManagementFunctions.sendCongratsToWinners,
pointsManagementFunctions.resetUsersPointsBeforeAggregating,
pointsManagementFunctions.updatePointsForUsers,
pointsManagementFunctions.updateUsersPlace
);

app.use('/api', router);
