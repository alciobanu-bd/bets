
resourceModule
.factory('InitUrls', [
'$resource',
function ($resource) {
    return
    $resource('/api', {},
        {
            'get': { method:'GET' }
        }
    );
}
])
