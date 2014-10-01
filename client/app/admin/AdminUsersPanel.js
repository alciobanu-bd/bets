
adminModule

.controller('AdminUsersPanel', [
'$scope', 'InitUrls', 'CallUrlService', 'RolesFactory',
function ($scope, InitUrls, CallUrlService, RolesFactory) {

    $scope.RolesFactory = RolesFactory;

    $scope.users = [];

    $scope.retrieveUsers = function () {
        InitUrls.then(function (url) {
            CallUrlService.getArray({uri: url.user.address},
            function (data) {
                $scope.users = data;
            },
            function (response) {

            }
            );
        });
    }

    $scope.retrieveUsers();

}
]);
