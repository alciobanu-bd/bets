
var Team = require('./../model/Team');

exports.addTeamInfoToWeek = function (week, callback) {

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


exports.addTeamInfoToWeeks = function (weeks, callback) {

    callCallback = function (err, weeks) {
        if (typeof callback === 'function') {
            callback(err, weeks);
        }
    }

    var teamsQuery = [];

    for (var j = 0; j < weeks.length; j++) {
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

    if (teamsQuery.length == 0) {
        return callCallback(null, weeks);
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
                        break;
                    }
                }
            }
        }

        callCallback(null, weeks);

    });

}
