
configModule

    .config(['$provide', '$httpProvider', function ($provide, $httpProvider) {

        $provide.factory('401Interceptor', [
            '$q', 'UserInformation', 'LoginTokenFactory', '$location', 'Socket',
            function ($q, UserInformation, LoginTokenFactory, $location, Socket) {

                return {
                    responseError: function (config) {
                        if (config.status == 401 && UserInformation.isLogged) {

                            UserInformation.isLogged = false;
                            if (UserInformation.user) {
                                delete UserInformation.user;
                            }

                            Socket.unregisterMe();
                            LoginTokenFactory.deleteToken();
                            $location.path('');
                        }
                        return $q.reject(config);
                    }
                }
            }
        ]);

        $httpProvider.interceptors.push('401Interceptor');

    }]);
