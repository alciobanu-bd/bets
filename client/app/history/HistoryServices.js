
historyModule

.factory('HistoryFactory', [
'InitUrls', 'CallUrlService', '$q',
function (InitUrls, CallUrlService, $q) {

    var thisFactory = {};
    thisFactory.betHistory = null;

    thisFactory.loadHistory = function (userId, onSuccess, onError) {
        InitUrls.then(function (data) {
            var reqObject = {uri: data.bet.history};
            if (userId) {
                reqObject.id = userId
            }
            CallUrlService.getArray(reqObject,
            function (data) {
                thisFactory.betHistory = data;
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
