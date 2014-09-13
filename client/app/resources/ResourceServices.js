
resourceModule

.factory('InitUrls', [
'$http', '$q',
function($http, $q) {

    var defered = $q.defer();

    $http.get(REST_HOSTNAME + '/api')
    .success(
    function (data) {
        defered.resolve(data);
    })
    .error(
    function () {
        defered.reject('oh snap!');
    }
    );

    return defered.promise;

}])

.factory('CallUrlService', ['$resource', function($resource) {
    return $resource(REST_HOSTNAME + '/:uri/:id', {uri: '@uri', id: '@id'}, {
        get: {method: 'GET', isArray: false},
        getArray: {method: 'GET', isArray: true},
        post: {method: 'POST'},
        put: {method: 'PUT'},
        delete: {method: 'DELETE'}
    })
}])