
var Week = require('./../model/Week.js');

var checkIfWeekEnded = function (req, res, next, week, onError) {
    if (week.locked || week.ended || week.endDate < new Date()) {
        res.status(500).json({
            message: 'Bet placement on this week is not available.'
        }).end();
        onError();
    }
}

var checkIfCorrectNumberOfMatches = function (req, res, next, week, onError) {

    var numberOfBets;
    if (req.body.scores) {
        numberOfBets = req.body.scores.length;
    }
    else {
        numberOfBets = 0;
    }

    if (week.required != numberOfBets) {
        res.status(500).json({
            message: 'You are required to play ' + week.required + ' matches. You placed ' + numberOfBets + '.'
        }).end();
        onError();
    }

}

var weekChecks = function (callbacks) {
    return function (req, res, next) {

        var weekNumber = req.body.weekNumber;

        Week.findOne({number: weekNumber}, {}, function (err, week) {

            if (err) {
                res.status(500).json({
                    message: 'Server encountered an error. Please try again'
                }).end();
            }

            else {

                if (week) {

                    var errorFromCallbacks = false;

                    for (var i in callbacks) {
                        callbacks[i](req, res, next, week, function () {
                            errorFromCallbacks = true;
                        });
                    }

                    if (!errorFromCallbacks) {
                        if (!res.data || !res.data.local) {
                            res.data = {
                                local: {}
                            };
                        }
                        res.data.local.week = week;
                        next();
                    }

                }

                else {
                    // week not found
                    res.status(500).json({
                        message: 'The week number you sent is malformed.'
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
