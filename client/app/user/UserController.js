
userModule

.controller('UserController', [
'$scope', 'UserInformation', 'InitUrls', 'Templates', '$location',
function ($scope, UserInformation, InitUrls, Templates, $location) {

    $scope.userInfo = UserInformation;

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

        InitUrls.get({}, function (data) {
            var credentials = _.object(_.map($scope.inputs, function (item, key) {
                return [key, item.model];
            }));
            var loginPromise = UserInformation.login(data, credentials);

            loginPromise.then(
            function (data) {
                $scope.encounteredError = false;
                $scope.goHome();
            },
            function (rejection) {
                $scope.error.encounteredError = true;
                $scope.error.message = rejection.data.message;
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
