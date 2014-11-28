
configModule

    .config(['$provide', '$httpProvider', function ($provide, $httpProvider) {

        $provide.factory('UrlLanguageAdderInterceptor', [
            '$q', 'CurrentLanguageFactory',
            function ($q, CurrentLanguageFactory) {

                return {
                    request: function (config) {

                        if (config.url.indexOf(".html") < 0 && config.url.indexOf("ip-api.com") < 0) {
                            if (!config.params) {
                                config.params = {};
                            }
                            config.params.lang = CurrentLanguageFactory.language.code;
                        }

                        return config|| $q.when(config);
                    }
                }
            }
        ]);

        $httpProvider.interceptors.push('UrlLanguageAdderInterceptor');

    }]);
