
configModule

    .config(['$provide', '$httpProvider', function ($provide, $httpProvider) {

        $provide.factory('NonActiveUserInterceptor', [
            '$q', 'UserInformation', '$location', 'Templates', 'RoutesFactory',
            function ($q, UserInformation, $location, Templates, RoutesFactory) {

                return {
                    response: function (response) {
                        if (response.config.url && response.config.url.indexOf("api") >= 0) {
                            if (UserInformation.isLogged && !UserInformation.user.active) {
                                RoutesFactory.goToActivation();
                            }
                        }
                        return response || $q.when(response);
                    }
                }
            }
        ]);

        $httpProvider.interceptors.push('NonActiveUserInterceptor');

    }]);
