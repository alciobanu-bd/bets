
adminModule

.controller('AdminUsersPanel', [
'$scope', 'InitUrls', 'CallUrlService', 'RolesFactory', '$modal',
function ($scope, InitUrls, CallUrlService, RolesFactory, $modal) {

    $scope.RolesFactory = RolesFactory;

    $scope.users = [];
    $scope.searchedUser = "";

    var resetSorts = function (exceptingField, value) {
        $scope.sorts = {
            lastLogin: 0,
            username: 0,
            points: 0
        };
        if (exceptingField && value) {
            $scope.sorts[exceptingField] = value;
        }
    }

    resetSorts();

    $scope.toggleSorting = function (field, defaultSort) {

        if (!defaultSort) {
            defaultSort = 1;
        }
        if ($scope.sorts[field] == 0) {
            $scope.sorts[field] = defaultSort;
        }
        else {
            $scope.sorts[field] *= -1;
        }

        resetSorts(field, $scope.sorts[field]);

    }

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

        $scope.openModal(user);

    }

    $scope.openModal = function (user) {
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
            for (var i in resolvedUser) {
                user[i] = resolvedUser[i];
            }
        }, function (dismissedUser) {
            for (var i in dismissedUser) {
                user[i] = dismissedUser[i];
            }
        });
    }
}
]);

adminModule
.controller('ProfileViewAdminController', [
'$scope', '$modalInstance', 'user', 'InitUrls', 'CallUrlService', 'RolesFactory', 'UserInformation',
'Languages',
function ($scope, $modalInstance, user, InitUrls, CallUrlService, RolesFactory, UserInformation,
Languages) {

    $scope.RolesFactory = RolesFactory;
    $scope.userInfo = UserInformation;
    $scope.user = user;
    $scope.Languages = Languages;

    var initialUser = {};
    angular.extend(initialUser, user);

    $scope.ok = function () {
        $scope.errorSaving = false;
        InitUrls.then(function (urls) {
            CallUrlService.put({uri: urls.user.address, id: $scope.user._id},
            {
                role: $scope.user.role,
                disabled: $scope.user.disabled,
                active: $scope.user.active
            },
            function (data) {
                $modalInstance.close(data);
            },
            function (response) {
                $scope.errorSaving = true;
            });
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss(initialUser);
    }

    $scope.toDate = function (date) {
        return new Date(date);
    }

}
]);

