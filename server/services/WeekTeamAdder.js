
var Team = require('./../model/Team');

exports.addTeamInfoToWeek = function (week, callback) {

    var callCallback = function (err, week) {
        if (typeof callback === 'function') {
            callback(err, week);
        }
    }

    var teamsQuery = [];

    for (var i = 0; i < week.events.length; i++) {
        if (week.events[i].homeTeam.teamId && week.events[i].awayTeam.teamId) {
            teamsQuery.push({
                _id: week.events[i].homeTeam.teamId
            });
            teamsQuery.push({
                _id: week.events[i].awayTeam.teamId
            });
        }
    }

    if (teamsQuery.length == 0) {
        return callCallback(null, week);
    }

    Team.find({$or: teamsQuery}, function (err, teams) {
        if (err) {
            return callCallback(err, null);
        }

        for (var i = 0; i < teams.length; i++) {
            var team = teams[i];
            for (var j = 0; j < week.events.length; j++) {
                var event = week.events[j];
                if (team._id.equals(event.homeTeam.teamId)) {
                    event.homeTeam = team;
                    break;
                }
                if (team._id.equals(event.awayTeam.teamId)) {
                    event.awayTeam = team;
                    break;
                }
            }
        }

        return callCallback(null, week);

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
            if (week.events[i].homeTeam.teamId && week.events[i].awayTeam.teamId) {
                teamsQuery.push({
                    _id: week.events[i].homeTeam.teamId
                });
                teamsQuery.push({
                    _id: week.events[i].awayTeam.teamId
                });
            }
        }
    }

    if (teamsQuery.length == 0) {
        return callCallback(null, weeks);
    }

    Team.find({$or: teamsQuery}, function (err, teams) {
        if (err) {
            return callCallback(err, null);
        }

        for (var i = 0; i < weeks.length; i++) {
            var week = weeks[i];
            for (var j = 0; j < week.events.length; j++) {
                var event = week.events[j];
                var found = 0;
                for (var k = 0; k < teams.length; k++) {
                    var team = teams[k];
                    if (team._id.equals(event.homeTeam.teamId)) {
                        event.homeTeam = team;
                        found++;
                    }
                    if (team._id.equals(event.awayTeam.teamId)) {
                        event.awayTeam = team;
                        found++;
                    }
                    if (found == 2) {
                        break;
                    }
                }
            }
        }

        callCallback(null, weeks);

    });

}
