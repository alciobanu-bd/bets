
historyModule

.factory('HistoryFactory', [
'InitUrls', 'CallUrlService',
function (InitUrls, CallUrlService) {

    var thisFactory = {};
    thisFactory.betHistory = null;

    thisFactory.loadHistory = function (onSuccess, onError) {
        InitUrls.then(function (data) {
            CallUrlService.getArray({uri: data.bet.history},
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
