
configModule

    .config(['$provide', '$httpProvider', function ($provide, $httpProvider) {


        $provide.factory('NonActiveUserInterceptor', [
            '$q', 'UserInformation', '$location', 'Templates',
            function ($q, UserInformation, $location, Templates) {

                return {
                    response: function (config) {
                        if (config.url.indexOf("api") >= 0) {
                            if (UserInformation.isLogged && !UserInformation.user.active) {
                                $scope.currentBodyView = Templates.activation;
                                $location.path(Templates.activation.route);
                            }
                        }
                        return config|| $q.when(config);
                    }
                }
            }
        ]);

        $httpProvider.interceptors.push('NonActiveUserInterceptor');

    }]);
