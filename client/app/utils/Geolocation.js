
utilsModule

.factory('Geolocation',
['$q', 'Settings', '$http',
function ($q, Settings, $http) {

    var defered = $q.defer();

    $http.get(Settings.geolocationAddresses.ipApiCom)
        .success(function (data) {
            defered.resolve(data);
        })
        .error(function (rejection) {
            defered.reject(rejection);
        });

    return defered.promise;

}
]);
