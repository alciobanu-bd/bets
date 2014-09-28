
configModule

    .config(['$provide', '$httpProvider', function ($provide, $httpProvider) {

        $provide.factory('NonActiveUserInterceptor', [
            '$q', 'UserInformation', '$location', 'Templates', 'RoutesFactory',
            function ($q, UserInformation, $location, Templates, RoutesFactory) {

                return {
                    request: function (req) {
                        if (UserInformation.isLogged && !UserInformation.user.active) {
                            RoutesFactory.goToActivation();
                        }
                        return req || $q.when(req);
                    }
                }
            }
        ]);

        $httpProvider.interceptors.push('NonActiveUserInterceptor');

    }]);
