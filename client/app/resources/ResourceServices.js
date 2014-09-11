
resourceModule

.factory('InitUrls', ['$resource', function($resource) {
    return $resource(REST_HOSTNAME + '/api', {}, {
        get: { method: 'GET'}
    });
}])

.factory('CallUrlService', ['$resource', function($resource) {
    return $resource(REST_HOSTNAME + '/:uri/:id', {uri: '@uri', id: '@id'}, {
        get: {method: 'GET'},
        getArray: {method: 'GET', isArray: true},
        post: {method: 'POST'},
        put: {method: 'PUT'},
        delete: {method: 'DELETE'}
    })
}])