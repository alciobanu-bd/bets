
historyModule

.controller('HistoryController', [
'$scope', 'HistoryFactory',
function ($scope, HistoryFactory) {

    HistoryFactory.loadHistory(function () {
        $scope.historyObject = HistoryFactory.betHistory;
        for (var i in $scope.historyObject) {
            var events = [];
            var historyElement = $scope.historyObject[i];

            for (var j in historyElement.weekEvents) {
                var weekEvent = historyElement.weekEvents[j];
                var bet = _.find(historyElement.betScores, function (item) {
                    return item.index == weekEvent.index;
                });
                events.push({
                    homeTeam: weekEvent.homeTeam,
                    awayTeam: weekEvent.awayTeam,
                    startDate: weekEvent.startDate,
                    score: {
                        real: {
                            home: weekEvent.homeScore,
                            away: weekEvent.awayScore
                        },
                        bet: {
                            home: bet ? bet.homeScore : '',
                            away: bet ? bet.awayScore : ''
                        }
                    },
                    points: bet ? bet.points : ''
                });
            }

            delete historyElement.weekEvents;
            delete historyElement.betScores;

            historyElement.events = events;

        }
    });

}
]);
