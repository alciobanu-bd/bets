
var Week = require('./../model/Week.js');

var checkIfWeekEnded = function (req, res, next, week) {
    if (week.locked || week.ended) {
        res.status(500).json({
            message: 'Bet placement on this week is locked.'
        }).end;
    }
}

var checkIfCorrectNumberOfMatches = function (req, res, next, week) {

    var numberOfBets;
    if (req.body.scores) {
        numberOfBets = req.body.scores.length;
    }
    else {
        numberOfBets = 0;
    }

    console.log("week.required != numberOfBets", week.required, numberOfBets);

    if (week.required != numberOfBets) {
        res.status(500).json({
            message: 'You are required to play ' + week.required + ' matches. You placed ' + numberOfBets + '.'
        }).end;
    }

}

var weekChecks = function (callbacks) {
    return function (req, res, next) {

        var weekNumber = req.body.weekNumber;

        Week.findOne({number: weekNumber}, {}, function (err, week) {

            if (err) {
                res.status(500).json({
                    message: 'Server encountered an error. Please try again'
                }).end;
            }

            else {

                if (week) {

                    for (var i in callbacks) {
                        callbacks[i](req, res, next, week);
                    }

                    next();

                }

                else {
                    // week not found
                    res.status(500).json({
                        message: 'The week number you sent is malformed.'
                    }).end;
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
