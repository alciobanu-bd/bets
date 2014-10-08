
historyModule

.factory('HistoryFactory', [
'InitUrls', 'CallUrlService',
function (InitUrls, CallUrlService) {

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

    return thisFactory;

}
]);
