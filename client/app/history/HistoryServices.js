
historyModule

.factory('HistoryFactory', [
'InitUrls', 'CallUrlService',
function (InitUrls, CallUrlService) {

    var thisFactory = {};
    thisFactory.betHistory = null;

    thisFactory.loadHistory = function () {
        InitUrls.then(function (data) {
            CallUrlService.getArray({uri: data.bet.history},
            function (data) {
                thisFactory.betHistory = data;
            }, function (resposne) {

            });
        })
    }

    return thisFactory;

}
]);
