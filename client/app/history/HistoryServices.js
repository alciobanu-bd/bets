
historyModule

.factory('HistoryFactory', [
'InitUrls', 'CallUrlService', '$q', 'TeamSerializer',
function (InitUrls, CallUrlService, $q, TeamSerializer) {

    var thisFactory = {};
    thisFactory.betHistory = null;
    thisFactory.betHistoryUser = null;

    thisFactory.loadHistory = function (userId, onSuccess, onError) {

        thisFactory.betHistory = null;
        thisFactory.betHistoryUser = null;

        InitUrls.then(function (data) {
            var reqObject = {uri: data.bet.history};
            if (userId) {
                reqObject.id = userId
            }
            CallUrlService.get(reqObject,
            function (data) {
                for (var i = 0; i < data.history.length; i++) {
                    for (var j = 0; j < data.history[i].weekEvents.length; j++) {
                        TeamSerializer.adjustTeamForCurrentLanguage(data.history[i].weekEvents[j].homeTeam);
                        TeamSerializer.adjustTeamForCurrentLanguage(data.history[i].weekEvents[j].awayTeam);
                    }
                }
                thisFactory.betHistory = data.history;
                thisFactory.betHistoryUser = data.user;
                if (typeof onSuccess === 'function') {
                    onSuccess();
                }
            },
            function (resposne) {
                if (typeof onError === 'function') {
                    onError();
                }
            });
        })
    }

    thisFactory.loadHistoryForAWeek = function (weekId, page) {
        var deferred = $q.defer();
        InitUrls.then(function (data) {
            CallUrlService.get({uri: data.bet.historyByWeek, id: weekId, page: page},
            function (data) {
                deferred.resolve(data);
            },
            function (response) {
                deferred.reject(response);
            });
        });
        return deferred.promise;
    }

    return thisFactory;

}
]);
