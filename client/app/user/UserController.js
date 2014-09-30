
userModule

.controller('UserController', [
'$scope', 'UserInformation', 'UserInformationCalls', 'InitUrls', 'RolesFactory', 'RoutesFactory',
function ($scope, UserInformation, UserInformationCalls, InitUrls, RolesFactory, RoutesFactory) {

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

    $scope.loginOnEnterKey = function (ev) {
        if (ev.keyCode == 13) {
            $scope.login();
        }
        return false;
    }

    $scope.login = function () {

        $scope.loginInProgress = true;

        InitUrls.then(function (data) {
            var credentials = _.object(_.map($scope.inputs, function (item, key) {
                return [key, item.model];
            }));
            var loginPromise = UserInformationCalls.login(data, credentials);

            loginPromise.then(
            function (data) {
                $scope.encounteredError = false;
                RoutesFactory.goHome();
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
        UserInformationCalls.logout();
        RoutesFactory.goHome();
    }

}
]
);
