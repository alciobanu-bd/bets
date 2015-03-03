
utilsModule
.factory('ServerDate', [
'$http', '$q', 'InitUrls', 'CallUrlService',
function ($http, $q, InitUrls, CallUrlService) {

    var gapBetweenClientAndServer;

    var getServerTime = function () {
        var defered = $q.defer();

        InitUrls.then(function (urls) {

            var timeBeforeCall = new Date();

            CallUrlService.get({uri: urls.serverDate},
                function (data) {
                    var timeResponse = new Date();
                    var clientDate = new Date();

                    var roundTrip = (timeResponse - timeBeforeCall) / 2;
                    var serverDate = new Date(data.date);
                    serverDate.setMilliseconds(serverDate.getMilliseconds() + roundTrip);

                    gapBetweenClientAndServer = clientDate - serverDate;

                    defered.resolve(gapBetweenClientAndServer);
                },function () {
                    // TODO treat error
                });
        });
        return defered.promise;
    }

    var serverTimePromise = getServerTime();

    return {
        getDate: function () {
            var defered = $q.defer();
            serverTimePromise.then(function (gapClientServer) {
                var date = new Date();
                date.setMilliseconds(date.getMilliseconds() + gapClientServer);
                defered.resolve(date);
            });
            return defered.promise;
        }
    };

}
]);
