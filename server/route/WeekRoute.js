
// NOTE that app is defined globally

var express = require('express');
var Week = require('./../model/Week.js');
var User = require('./../model/User.js');
var Team = require('./../model/Team.js');
var Roles = require('./../model/Roles.js')('en');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');
var pointsManagementFunctions = require('./../middlewares/pointsManagement.js');
var mailServices = require('./../services/mailServices.js');
var _ = require('underscore');

var Translations = require('./../config/Translations.js');

var fs = require('fs');
var LOG_WEEK_MAIL_FILE_NAME = 'logs/user_mail_log.txt';

var router = express.Router();

var addTeamInfoToWeek = function (week, callback) {

    callCallback = function (err, week) {
        if (typeof callback === 'function') {
            callback(err, week);
        }
    }

    var teamsQuery = [];

    for (var i = 0; i < week.events.length; i++) {
        teamsQuery.push({
            _id: week.events[i].homeTeam.teamId
        });
        teamsQuery.push({
            _id: week.events[i].awayTeam.teamId
        });
    }

    Team.find({$or: teamsQuery}, function (err, teams) {
        if (err) {
            callCallback(err, null);
            return;
        }

        for (var i = 0; i < teams.length; i++) {
            var team = teams[i];
            for (var j = 0; j < week.events.length; j++) {
                var event = week.events[j];
                if (team._id == event.homeTeam.teamId) {
                    event.homeTeam = team;
                    break;
                }
                if (team._id == event.awayTeam.teamId) {
                    event.awayTeam = team;
                    break;
                }
            }
        }

        callCallback(null, week);

    });

}


var addTeamInfoToWeeks = function (weeks, callback) {

    callCallback = function (err, weeks) {
        if (typeof callback === 'function') {
            callback(err, weeks);
        }
    }

    var teamsQuery = [];

    for (var j = 0; j < weeks; j++) {
        var week = weeks[j];
        for (var i = 0; i < week.events.length; i++) {
            teamsQuery.push({
                _id: week.events[i].homeTeam.teamId
            });
            teamsQuery.push({
                _id: week.events[i].awayTeam.teamId
            });
        }
    }

    Team.find({$or: teamsQuery}, function (err, teams) {
        if (err) {
            callCallback(err, null);
            return;
        }

        for (var i = 0; i < teams.length; i++) {
            var team = teams[i];
            var found = false;
            for (var k = 0; k < weeks.length; k++) {
                if (found) {
                    break;
                }
                var week = weeks[k];
                for (var j = 0; j < week.events.length; j++) {
                    var event = week.events[j];
                    if (team._id == event.homeTeam.teamId) {
                        event.homeTeam = team;
                        found = true;
                        break;
                    }
                    if (team._id == event.awayTeam.teamId) {
                        event.awayTeam = team;
                        found = true;
                        berak;
                    }
                }
            }
        }

        callCallback(null, week);

    });

}



router.get('/week/:id([0-9a-fA-F]{24})',
function (req, res, next) {

    Week.findOne({_id: req.params.id},
    function (err, week) {
        if (err) {
            res.status(500).json({
                message: Translations[req.query.lang].weekRoute.errorFetchingWeekFromDb
            }).end();
        }
        else {
            addTeamInfoToWeek(week, function (err, week) {
                if (err) {
                    res.status(500).json({
                        message: Translations[req.query.lang].weekRoute.errorFetchingWeekFromDb
                    }).end();
                    return;
                }
                res.status(200).json(week).end();
            });
        }
    });

});

router.get('/week',
jwtauth([tokenChecks.hasRole("ROLE_USER")]),
function (req, res, next) {

    var queryObject = {};

    if (Roles.roleValue(res.data.local.user.role) < Roles.admin.value) {
        queryObject.hidden = false;
        // if user isn't at least admin, he should see only the unhidden weeks
    }

    Week.find(queryObject,
    function (err, weeks) {
        if (err) {
            res.status(500).json({
                message: Translations[req.query.lang].weekRoute.errorFetchingWeeksFromDb
            }).end();
        }
        else {
            addTeamInfoToWeeks(weeks, function (err, weeks) {
                if (err) {
                    res.status(500).json({
                        message: Translations[req.query.lang].weekRoute.errorFetchingWeeksFromDb
                    }).end();
                    return;
                }

                res.status(200).json(weeks).end();
            });
        }
    });

});

router.get('/week/last',
jwtauth([tokenChecks.hasRole("ROLE_USER")]),
function (req, res, next) {

    var queryObject = {};

    if (Roles.roleValue(res.data.local.user.role) < Roles.admin.value) {
        queryObject.hidden = false;
        // if user isn't at least admin, he should see only the unhidden weeks
    }

    Week.find(queryObject, {},
        {sort: {number: -1}, limit: 1},
        function (err, weeks) {

            if (err) {
                res.status(500).json({
                    message: Translations[req.query.lang].weekRoute.errorFetchingCurrentWeek
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

                    addTeamInfoToWeek(weeks[0], function (err, week) {
                        if (err) {
                            res.status(500).json({
                                message: Translations[req.query.lang].weekRoute.errorFetchingCurrentWeek
                            }).end();
                            return;
                        }
                        res.status(200).json(week).end();
                    });

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

    Week.find({hidden: false}, {},
    {sort: {number: -1}, limit: 1},
    function (err, weeks) {

        if (err) {
            res.status(500).json({
                message: Translations[req.query.lang].weekRoute.errorFetchingCurrentWeek
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
                                    message: Translations[req.query.lang].weekRoute.emailNotificationAlreadySent
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
                                    weeks[0], user, function () {
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
                                message: Translations[req.query.lang].weekRoute.mailsQueuedAboutToBeSent
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
                message: Translations[req.query.lang].weekRoute.weekWasntSavedToDb
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
            message: Translations[req.query.lang].weekRoute.weekHasNoEventsAddThem
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
                message: Translations[req.query.lang].weekRoute.weekWasntSavedToDb
            }).end();
        }
        else {
            res.status(200).json(week).end();
        }
    });

});

router.get('/week/beforeLast',
jwtauth([tokenChecks.hasRole('ROLE_USER')]),
function (req, res, next) {

    var queryObject = {};

    if (Roles.roleValue(res.data.local.user.role) < Roles.admin.value) {
        queryObject.hidden = false;
        // if user isn't at least admin, he should see only the unhidden weeks
    }

    Week.find(queryObject, {},
        {sort: {number: -1}, limit: 2},
        function (err, weeks) {

            if (err) {
                res.status(500).json({
                    message: Translations[req.query.lang].weekRoute.errorFetchingBeforeCurrentWeek
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

                    addTeamInfoToWeek(weeks[1], function (err, week) {
                        if (err) {
                            res.status(500).json({
                                message: Translations[req.query.lang].weekRoute.errorFetchingBeforeCurrentWeek
                            }).end();
                            return;
                        }
                        res.status(200).json(week).end();
                    });

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
jwtauth([tokenChecks.hasRole('ROLE_USER')]),
function (req, res, next) {

    var queryObject = {number: req.query.number};

    if (Roles.roleValue(res.data.local.user.role) < Roles.admin.value) {
        queryObject.hidden = false;
        // if user isn't at least admin, he should see only the unhidden weeks
    }

    Week.findOne(
        queryObject,
        function (err, week) {

            if (err) {
                res.status(500).json({
                    message: Translations[req.query.lang].weekRoute.errorFetchingWeekWithNumber
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

                    addTeamInfoToWeek(week, function (err, week) {
                        if (err) {
                            res.status(500).json({
                                message: Translations[req.query.lang].weekRoute.errorFetchingWeekWithNumber
                                + req.query.number +
                                "."
                            }).end();
                            return;
                        }
                        res.status(200).json(week).end();
                    });

                }

                else {
                    res.status(200).json({number: 0}).end();
                }

            }

        });

})


/**
 * Used to update official result for matches.
 * To update a week, use the update route.
 */
router.put('/week/:id([0-9a-fA-F]{24})',
jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]),

function(req, res, next) {

    Week.findOne({_id: req.params.id},
    function (err, week) {
        if (err || !week) {
            res.status(500).json({
                message: Translations[req.query.lang].weekRoute.weekInfoNotSavedDbError
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
                        message: Translations[req.query.lang].weekRoute.weekInfoNotSavedDbError
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
pointsManagementFunctions.calculateWinners,
pointsManagementFunctions.setWinnersOnBets,
pointsManagementFunctions.sendCongratsToWinners,
pointsManagementFunctions.resetUsersPointsBeforeAggregating,
pointsManagementFunctions.updatePointsForUsers,
pointsManagementFunctions.updateUsersPlace
);

app.use('/api', router);
