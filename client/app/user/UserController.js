
userModule

.controller('UserController', [
'$scope', 'UserInformation', 'InitUrls', 'RolesFactory',
function ($scope, UserInformation, InitUrls, RolesFactory) {

    $scope.userInfo = UserInformation;
    $scope.RolesFactory = RolesFactory;

    $scope.inputs = {
        username: {
            model: ''
        },
        password: {
            model: ''
        }
    };

    $scope.error = {
        message: '',
        encounteredError: false
    };

    $scope.login = function () {

        $scope.loginInProgress = true;

        InitUrls.then(function (data) {
            var credentials = _.object(_.map($scope.inputs, function (item, key) {
                return [key, item.model];
            }));
            var loginPromise = UserInformation.login(data, credentials);

            loginPromise.then(
            function (data) {
                $scope.encounteredError = false;
                $scope.goHome();
                $scope.loginInProgress = false;
            },
            function (rejection) {
                $scope.error.encounteredError = true;
                $scope.error.message = rejection.data.message;
                $scope.loginInProgress = false;
            }
            );

        });

    }

    $scope.logout = function () {
        UserInformation.logout();
        $scope.goHome();
    }

}
]
);
