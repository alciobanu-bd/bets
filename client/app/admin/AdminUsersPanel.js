
adminModule

.controller('AdminUsersPanel', [
'$scope', 'InitUrls', 'CallUrlService', 'RolesFactory', '$modal',
function ($scope, InitUrls, CallUrlService, RolesFactory, $modal) {

    $scope.RolesFactory = RolesFactory;

    $scope.users = [];
    $scope.searchedUser = "";

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

    $scope.openActivateModal = function (user) {
        var modalInstance = $modal.open({
            templateUrl: 'activateAdminModal.html',
            controller: 'ActivateAdminController',
            resolve: {
                user: function () {
                    return user;
                }
            }
        });

        modalInstance.result.then(function (resolvedUser) {
            user = resolvedUser;
        });

    }

    var getUserByUsername = function (username) {
        for (var i = 0; i < $scope.users.length; i++) {
            if ($scope.users[i].username == username) {
                return $scope.users[i];
            }
        }
        return null;
    }

    $scope.openUserModalOnEnter = function (ev) {

        if (ev.keyCode != 13) {
            return false;
        }

        var user = getUserByUsername($scope.searchedUser);

        if (!user) {
            return;
        }

        var modalInstance = $modal.open({
            templateUrl: 'profileViewModalAdmin.html',
            controller: 'ProfileViewAdminController',
            resolve: {
                user: function () {
                    return user;
                }
            }
        });

        modalInstance.result.then(function (resolvedUser) {
            user = resolvedUser;
        });

    }

}
]);

adminModule
.controller('ProfileViewAdminController', [
'$scope', '$modalInstance', 'user', 'InitUrls', 'CallUrlService', 'RolesFactory',
function ($scope, $modalInstance, user, InitUrls, CallUrlService, RolesFactory) {

    $scope.RolesFactory = RolesFactory;

    $scope.user = user;

    $scope.ok = function () {
    }

    $scope.cancel = function () {
    }

}
]);


adminModule
.controller('ActivateAdminController', [
'$scope', '$modalInstance', 'user', 'InitUrls', 'CallUrlService',
function ($scope, $modalInstance, user, InitUrls, CallUrlService) {

    $scope.user = user;
    $scope.activationModel = user.active;

    $scope.toggleActive = function () {
        $scope.activationModel = !$scope.activationModel;
    }

    $scope.ok = function () {

        $scope.errorSaving = false;

        InitUrls.then(function (urls) {
            CallUrlService.post({uri: urls.user.activateAsAdmin},
            {userId: user._id, activationOption: $scope.activationModel},
            function (data) {
                $scope.user.active = $scope.activationModel;
                $modalInstance.close($scope.user);
            },
            function (response) {
                $scope.errorSaving = true;
            });
        });

    }

    $scope.cancel = function () {
        $modalInstance.dismiss('Cancelled');
    }

}
]);
