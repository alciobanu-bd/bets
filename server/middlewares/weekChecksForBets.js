
var Week = require('./../model/Week.js');
var Translations = require('./../config/Translations.js');

var checkIfWeekEnded = function (req, res, next, week, onError, onSuccess) {
    if (week.locked || week.ended || week.endDate < new Date()) {
        res.status(500).json({
            message: Translations[req.query.lang].weekChecksForBets.betPlacementNotAvailableOnThisWeek
        }).end();
        onError();
    }
    else {
        onSuccess();
    }
}

var checkIfCorrectNumberOfMatches = function (req, res, next, week, onError, onSuccess) {

    var numberOfBets;
    if (req.body.scores) {
        numberOfBets = req.body.scores.length;
    }
    else {
        numberOfBets = 0;
    }

    if (week.required != numberOfBets) {
        res.status(500).json({
            message: Translations[req.query.lang].weekChecksForBets.youAreRequiredToPlay + week.required +
                Translations[req.query.lang].weekChecksForBets.matchesYouPlayed + numberOfBets + '.'
        }).end();
        onError();
    }
    else {
        onSuccess();
    }

}

var weekChecks = function (callbacks) {
    return function (req, res, next) {

        var weekNumber = req.body.weekNumber;

        Week.findOne({number: weekNumber}, {}, function (err, week) {

            if (err) {
                res.status(500).json({
                    message: Translations[req.query.lang].weekChecksForBets.serverError
                }).end();
            }

            else {

                if (week) {

                    var successCallbacks = 0;

                    for (var i = 0; i < callbacks.length; i++) {
                        callbacks[i](req, res, next, week,
                        function () {
                            // on error
                        },
                        function () {
                            // on success
                            successCallbacks++;

                            if (successCallbacks == callbacks.length) {
                                if (!res.data || !res.data.local) {
                                    res.data = {
                                        local: {}
                                    };
                                }
                                res.data.local.week = week;
                                next();
                            }

                        });
                    }

                }

                else {
                    // week not found
                    res.status(500).json({
                        message: Translations[req.query.lang].weekChecksForBets.weekNumberMalformed
                    }).end();
                }

            }

        });

    };
}

var callbacks = {
    checkIfCorrectNumberOfMatches: checkIfCorrectNumberOfMatches,
    checkIfWeekEnded: checkIfWeekEnded
};

module.exports = {
    weekMiddleware: weekChecks,
    callbacks: callbacks
};
