
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

/**
 * Deals with uploading a file to the server through http.
 * See also: FileModelDirective
 */
.service('FileUploader', ['$http', function ($http) {

        /**
         *
         * @param request - should be an object with 2 properties: the file and the uri
         * @param onSuccess - callbacks that's called on image upload success
         * @param onError - callback that's called on image upload error
         */
    this.uploadFile = function (request, onSuccess, onError){

        var fd = new FormData();
        fd.append('file', request.file); // file should be a file selected with FileModelDirective

        $http.post(request.uri, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(data, headers){
            if (typeof onSuccess === 'function') {
                onSuccess(data, headers);
            }
        })
        .error(function(response){
            if (typeof onError == 'function') {
                onError(response);
            }
        });

    }
}]);