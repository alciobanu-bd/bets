
configModule

    .config(['$provide', '$httpProvider', function ($provide, $httpProvider) {

        $provide.factory('401Interceptor', [
            '$q', 'UserInformation', 'LoginTokenFactory', 'RoutesFactory',
            function ($q, UserInformation, LoginTokenFactory, RoutesFactory) {

                return {
                    responseError: function (config) {
                        if (config.status == 401 && UserInformation.isLogged) {

                            UserInformation.isLogged = false;
                            if (UserInformation.user) {
                                delete UserInformation.user;
                            }

                            LoginTokenFactory.deleteToken();
                            RoutesFactory.goToLogin();

                        }
                        return config|| $q.when(config);
                    }
                }
            }
        ]);

        $httpProvider.interceptors.push('401Interceptor');

    }]);
