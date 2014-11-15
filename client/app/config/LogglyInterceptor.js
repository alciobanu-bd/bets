
configModule

.config(['$provide', '$httpProvider', function ($provide, $httpProvider) {

    $provide.factory('LogglyRequestInterceptor', [
        '$q', '$log',
        function ($q, $log) {

            return {
                request: function (config) {
                    if (["POST", "PUT"].indexOf(config.method) > -1 && config.url.indexOf("bet") > -1) {
                        // log bets to loggly
                        $log.info({
                            req: config
                        });
                    }
                    return config|| $q.when(config);
                }
            }
        }
    ]);

    $httpProvider.interceptors.push('LogglyRequestInterceptor');

}]);
