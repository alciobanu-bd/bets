
configModule

.config(['$provide', '$httpProvider', function ($provide, $httpProvider) {


    $provide.factory('TokenInterceptor', [
        '$q', 'LoginTokenFactory',
        function ($q, LoginTokenFactory) {

            return {
                request: function (config) {
                    config.headers['x-access-token'] = LoginTokenFactory.getToken();
                    return config|| $q.when(config);
                }
            }
        }
    ]);

    $httpProvider.interceptors.push('TokenInterceptor');

}]);
